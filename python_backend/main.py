from fastapi import FastAPI, Depends, Query, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc, nullslast, case, and_, or_
from typing import List, Optional
from urllib.parse import urlparse
import json

from database import get_db, engine, Base
import models
import schemas
import os
import sys

# 强制终端输出使用 UTF-8 编码，防止 Windows PowerShell 乱码
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from dotenv import load_dotenv

load_dotenv()

# 把上级 crawler/ 目录加入 sys.path 以直接调用原来爬虫的逻辑
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "crawler"))
try:
    # 尝试导入 crawl_agent，我们将稍微改造它以便 Python backend 可以调用
    from crawl_agent import CrawlerAgent, search_baidu, fetch_page, SEARCH_MISSIONS
except ImportError:
    pass  # 后续我们会修改 crawler，现在先不强求完全加载

app = FastAPI(title="Student Growth Platform Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 爬虫集成逻辑 ---
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

log = logging.getLogger("backend")

# 用于控制不要同时跑多个爬虫实例
is_crawling = False


def _looks_broken_text(value: Optional[str]) -> bool:
    if value is None:
        return True
    text = str(value).strip()
    if not text:
        return True
    if "??" in text:
        return True
    if set(text) == {"?"}:
        return True
    q_ratio = text.count("?") / max(len(text), 1)
    return q_ratio >= 0.4


def _infer_category(title: str) -> str:
    t = title or ""
    if any(k in t for k in ["竞赛", "NOI", "NOIP", "CSP", "白名单"]):
        return "竞赛"
    if any(k in t for k in ["考试", "准考证", "成绩", "月历", "研考", "合格性", "测试"]):
        return "考试"
    if any(k in t for k in ["招生", "录取", "章程", "简章", "报名", "对口", "专升本", "分类考试"]):
        return "招生"
    if any(k in t for k in ["政策", "通知", "通告", "方案", "办法", "升学"]):
        return "升学"
    return "资讯"


def _infer_region(url: str, title: str) -> str:
    domain = (urlparse(url).netloc or "").lower()
    t = title or ""
    if "全国" in t:
        return "全国"
    if "合肥" in t or "hefei" in domain:
        return "合肥"
    if "安徽" in t or "ahzsks.cn" in domain or ".ah.gov.cn" in domain:
        return "安徽"
    return "全国"


def _infer_source(url: str, title: str) -> str:
    domain = (urlparse(url).netloc or "").lower()
    t = title or ""
    if "ahzsks.cn" in domain:
        return "安徽省教育招生考试院"
    if "moe.gov.cn" in domain:
        return "中华人民共和国教育部"
    if "gaokao.chsi.com.cn" in domain:
        return "阳光高考"
    if "noi.cn" in domain:
        return "NOI官网"
    if "hfyz.net" in domain:
        return "合肥市第一中学"
    if "hf168.net" in domain:
        return "合肥一六八中学"
    if "合肥" in t:
        return "合肥教育资讯"
    if "安徽" in t:
        return "安徽教育资讯"
    return "升学资讯整理"


def _infer_tags(title: str, category: str, region: str) -> str:
    keys = ["强基计划", "信息学", "科技特长生", "招生", "考试", "竞赛", "自主招生", "专升本", "分类考试", "研考", "白名单"]
    tags = [k for k in keys if k in (title or "")]
    if region and region not in tags:
        tags.insert(0, region)
    if category and category not in tags:
        tags.append(category)
    if not tags:
        tags = [region or "全国", category or "资讯"]
    return json.dumps(tags, ensure_ascii=False)


def normalize_item_data(item_data: dict) -> dict:
    item = dict(item_data or {})
    title = str(item.get("title") or "").strip()
    source_url = str(item.get("sourceUrl") or item.get("link") or "").strip()

    if _looks_broken_text(item.get("category")):
        item["category"] = _infer_category(title)
    if _looks_broken_text(item.get("region")):
        item["region"] = _infer_region(source_url, title)
    if _looks_broken_text(item.get("source")):
        item["source"] = _infer_source(source_url, title)
    if _looks_broken_text(item.get("tags")):
        item["tags"] = _infer_tags(title, item.get("category"), item.get("region"))

    if _looks_broken_text(item.get("school")):
        item["school"] = ""
    if _looks_broken_text(item.get("schoolLevel")):
        item["schoolLevel"] = ""

    if not item.get("importance"):
        item["importance"] = "high" if item.get("category") in ("招生", "考试", "竞赛") else "medium"

    if not item.get("sourceUrl") and source_url:
        item["sourceUrl"] = source_url

    return item


async def run_crawler_task():
    global is_crawling
    if is_crawling:
        log.warning("爬虫任务正在执行，跳过本次触发")
        return
        
    is_crawling = True
    try:
        log.info("开始执行智能体爬虫后台任务...")
        # 提取环境变量中的密钥
        llm_key = os.environ.get("DEEPSEEK_API_KEY", "")
        if not llm_key:
            log.error("环境变量 DEEPSEEK_API_KEY 未设置，爬虫无法运行")
            return
            
        from crawl_agent import SEARCH_MISSIONS
        from database import AsyncSessionLocal
        
        # 1. 查询库中已有记录的 URL，用于跳过已知网页（历史追溯拦截）
        async with AsyncSessionLocal() as db:
            res = await db.execute(select(models.ExamInfo.source_url))
            existing_urls = set(res.scalars().all())
            
        log.info(f"本地知识库已存在 {len(existing_urls)} 条记录，开始分批并发执行 {len(SEARCH_MISSIONS)} 个抓取任务...")
        
        loop = asyncio.get_event_loop()
        total_added = 0
        db_lock = asyncio.Lock()
        
        # 2. 定义单个主题的并发增量任务
        async def crawl_topic_and_save(topic):
            # 为每个主题独立分配一个智能体，防止线程共享冲突
            agent = CrawlerAgent(llm_key, existing_urls)
            # 放到线程池执行同步的大模型请求
            await loop.run_in_executor(None, agent.run_mission, topic)
            
            items = agent.collected
            if not items:
                return 0
                
            # 3. 单个主题跑完后，立刻增量写入数据库
            added = 0
            async with db_lock:
                async with AsyncSessionLocal() as db:
                    for item_data in items:
                        try:
                            normalized = normalize_item_data(item_data)
                            source_url = normalized.get("sourceUrl")
                            if not source_url:
                                log.warning("跳过缺失 sourceUrl 的数据项")
                                continue

                            stmt = select(models.ExamInfo).filter_by(source_url=source_url)
                            check_res = await db.execute(stmt)
                            if check_res.scalar() is None:
                                new_item = models.ExamInfo(
                                    title=normalized.get("title"),
                                    category=normalized.get("category"),
                                    date=normalized.get("date"),
                                    source=normalized.get("source"),
                                    summary=normalized.get("summary"),
                                    link=normalized.get("link"),
                                    source_url=source_url,
                                    region=normalized.get("region"),
                                    importance=normalized.get("importance"),
                                    ai_recommended=normalized.get("aiRecommended", False),
                                    tags=normalized.get("tags"),
                                    school=normalized.get("school"),
                                    school_level=normalized.get("schoolLevel"),
                                    admission_year=normalized.get("admissionYear")
                                )
                                db.add(new_item)
                                await db.commit()  # 移到循环内，单条提交
                                added += 1
                                existing_urls.add(source_url)
                        except Exception as e:
                            await db.rollback()
                            log.warning(f"单条写入冲突跳过 (URL: {item_data.get('sourceUrl')}): {e.__class__.__name__}")
            if added > 0:
                log.info(f"[{topic}] 增量入库完成，新增 {added} 条")
            return added

        # 4. 并发所有主题
        tasks = [crawl_topic_and_save(mission) for mission in SEARCH_MISSIONS]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for r in results:
            if isinstance(r, Exception):
                log.error(f"某并发任务抛出异常: {r}")
            else:
                total_added += r
                
        log.info(f"✅ 所有主题采集完成，本次全量任务共新增入库 {total_added} 条。")
    except Exception as e:
        log.error(f"后台爬虫任务执行异常: {e}")
    finally:
        is_crawling = False

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # 启动定时任务，每天凌晨 02:00 自动执行
    scheduler = AsyncIOScheduler()
    scheduler.add_job(run_crawler_task, CronTrigger(hour=2, minute=0))
    scheduler.start()
    log.info("APScheduler 后台定时任务已启动 (每天 02:00 触发 crawler)")

@app.post("/api/exam-info/trigger-crawl")
async def trigger_crawl_api(background_tasks: BackgroundTasks):
    if is_crawling:
        return {"msg": "Crawler is already running"}
        
    # 放入 FastAPI 的后台队列执行
    background_tasks.add_task(run_crawler_task)
    return {"msg": "Background crawler triggered successfully"}

@app.post("/api/exam-info/batch-import")
async def batch_import_exam_info(items: List[dict], db: AsyncSession = Depends(get_db)):
    added = 0
    for item_data in items:
        try:
            normalized = normalize_item_data(item_data)
            source_url = normalized.get("sourceUrl")
            if not source_url:
                continue

            stmt = select(models.ExamInfo).filter_by(source_url=source_url)
            check_res = await db.execute(stmt)
            if check_res.scalar() is None:
                new_item = models.ExamInfo(
                    title=normalized.get("title"), category=normalized.get("category", "资讯"),
                    date=normalized.get("date"), source=normalized.get("source"),
                    summary=normalized.get("summary"), link=normalized.get("link"),
                    source_url=source_url, region=normalized.get("region"),
                    importance=normalized.get("importance"), ai_recommended=normalized.get("aiRecommended", False),
                    tags=normalized.get("tags"), school=normalized.get("school"),
                    school_level=normalized.get("schoolLevel"), admission_year=normalized.get("admissionYear")
                )
                db.add(new_item)
                await db.commit()
                added += 1
        except Exception as e:
            await db.rollback()
            log.warning(f"单条写入冲突跳过 (URL: {item_data.get('sourceUrl')}): {e.__class__.__name__}")
    return {"msg": "success", "imported": added, "skipped": len(items) - added}


@app.get("/api/exam-info/page", response_model=schemas.PageResponse)
async def get_exam_info_page(
    page: int = Query(0, ge=0),
    size: int = Query(20, gt=0, le=100),
    category: Optional[str] = None,
    region: Optional[str] = None,
    schoolLevel: Optional[str] = None,
    school: Optional[str] = None,
    keyword: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(models.ExamInfo)
    
    if category:
        stmt = stmt.filter(models.ExamInfo.category == category)
    if region:
        stmt = stmt.filter(models.ExamInfo.region == region)
    if schoolLevel:
        stmt = stmt.filter(models.ExamInfo.school_level == schoolLevel)
    if school:
        stmt = stmt.filter(models.ExamInfo.school == school)
    if keyword:
        stmt = stmt.filter(
            (models.ExamInfo.title.like(f"%{keyword}%")) | 
            (models.ExamInfo.summary.like(f"%{keyword}%"))
        )
        
    # count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_elements = await db.scalar(count_stmt)
    
    # pagination & sorting
    # Prioritize Hefei middle-school-related items first, then by date/id desc.
    school_text = func.coalesce(models.ExamInfo.school, "")
    title_text = func.coalesce(models.ExamInfo.title, "")
    source_text = func.coalesce(models.ExamInfo.source, "")
    region_text = func.coalesce(models.ExamInfo.region, "")

    hefei_kw = "\u5408\u80a5"  # 合肥
    middle_keywords = [
        "\u4e2d\u5b66",          # 中学
        "\u4e00\u4e2d",          # 一中
        "\u4e8c\u4e2d",          # 二中
        "\u4e09\u4e2d",          # 三中
        "\u56db\u4e2d",          # 四中
        "\u4e94\u4e2d",          # 五中
        "\u516d\u4e2d",          # 六中
        "\u4e03\u4e2d",          # 七中
        "\u516b\u4e2d",          # 八中
        "\u4e5d\u4e2d",          # 九中
        "\u5341\u4e2d",          # 十中
        "\u5341\u4e00\u4e2d",    # 十一中
        "\u56db\u5341\u4e94\u4e2d",  # 四十五中
        "\u9644\u4e2d",          # 附中
    ]
    hefei_168_keywords = [
        "\u4e00\u516d\u516b\u4e2d\u5b66",  # 一六八中学
        "168\u4e2d\u5b66",                 # 168中学
    ]

    has_hefei = or_(
        school_text.like(f"%{hefei_kw}%"),
        title_text.like(f"%{hefei_kw}%"),
        source_text.like(f"%{hefei_kw}%"),
        region_text.like(f"%{hefei_kw}%")
    )

    school_fields = (school_text, title_text, source_text)

    middle_school_conditions = []
    for kw in middle_keywords:
        for field in school_fields:
            middle_school_conditions.append(field.like(f"%{kw}%"))
    has_middle_school_signal = or_(*middle_school_conditions)

    hefei_168_conditions = []
    for kw in hefei_168_keywords:
        for field in school_fields:
            hefei_168_conditions.append(field.like(f"%{kw}%"))
    is_hefei_168_middle = or_(*hefei_168_conditions)

    is_hefei_middle = or_(
        and_(has_hefei, has_middle_school_signal),
        is_hefei_168_middle
    )

    hefei_middle_priority = case((is_hefei_middle, 0), else_=1)

    stmt = stmt.order_by(hefei_middle_priority.asc(), models.ExamInfo.date.desc(), models.ExamInfo.id.desc())
    stmt = stmt.offset(page * size).limit(size)
    
    result = await db.execute(stmt)
    items = result.scalars().all()
    
    # convert to response format
    content_list = []
    for it in items:
        content_list.append(schemas.ExamInfoResponse(
            id=it.id,
            title=it.title,
            category=it.category,
            date=it.date,
            source=it.source,
            summary=it.summary,
            link=it.link,
            sourceUrl=it.source_url,
            region=it.region,
            importance=it.importance,
            aiRecommended=it.ai_recommended,
            tags=it.tags,
            school=it.school,
            schoolLevel=it.school_level,
            admissionYear=it.admission_year
        ))

    return schemas.PageResponse(
        content=content_list,
        totalElements=total_elements,
        totalPages=(total_elements + size - 1) // size,
        size=size,
        number=page
    )

@app.get("/api/exam-info/schools", response_model=List[str])
async def get_schools(db: AsyncSession = Depends(get_db)):
    stmt = select(models.ExamInfo.school).filter(models.ExamInfo.school.isnot(None), models.ExamInfo.school != "").distinct()
    result = await db.execute(stmt)
    schools = result.scalars().all()
    return schools

@app.get("/api/exam-info/hot-schools")
async def get_hot_schools(top: int = Query(8, gt=0), db: AsyncSession = Depends(get_db)):
    stmt = select(
        models.ExamInfo.school, 
        func.count(models.ExamInfo.id).label("match_count")
    ).filter(
        models.ExamInfo.school.isnot(None), 
        models.ExamInfo.school != ""
    ).group_by(
        models.ExamInfo.school
    ).order_by(
        desc("match_count")
    ).limit(top)
    
    result = await db.execute(stmt)
    rows = result.all()
    
    return [
        {"school": row[0], "matchCount": row[1]}
        for row in rows
    ]
