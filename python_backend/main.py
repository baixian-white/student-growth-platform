from fastapi import FastAPI, Depends, Query, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc, nullslast
from typing import List, Optional

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
                            stmt = select(models.ExamInfo).filter_by(source_url=item_data.get("sourceUrl"))
                            check_res = await db.execute(stmt)
                            if check_res.scalar() is None:
                                new_item = models.ExamInfo(
                                    title=item_data.get("title"),
                                    category=item_data.get("category"),
                                    date=item_data.get("date"),
                                    source=item_data.get("source"),
                                    summary=item_data.get("summary"),
                                    link=item_data.get("link"),
                                    source_url=item_data.get("sourceUrl"),
                                    region=item_data.get("region"),
                                    importance=item_data.get("importance"),
                                    ai_recommended=item_data.get("aiRecommended", False),
                                    tags=item_data.get("tags"),
                                    school=item_data.get("school"),
                                    school_level=item_data.get("schoolLevel"),
                                    admission_year=item_data.get("admissionYear")
                                )
                                db.add(new_item)
                                await db.commit()  # 移到循环内，单条提交
                                added += 1
                                existing_urls.add(item_data.get("sourceUrl"))
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
    stmt = stmt.order_by(models.ExamInfo.date.desc(), models.ExamInfo.id.desc())
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
