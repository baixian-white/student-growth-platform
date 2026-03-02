#!/usr/bin/env python3
"""
定时爬虫 — 安徽/合肥地区升学资讯汇聚系统 V2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
爬取目标：科技特长生、特长生招生、合肥重点高中/初中、强基计划、信息学奥赛
LLM 增强：静态抓取失败时调用 DeepSeek API 智能提取结构化信息

使用方法：
  pip install requests beautifulsoup4 openai
  python crawl_exam_news.py --once                          # 立即执行一次
  python crawl_exam_news.py --once --llm-key sk-xxx         # 带 LLM Key 执行
  # 定时调度由 Spring Boot @Scheduled 负责，无需本脚本内置 schedule
"""

import re
import sys
import time
import json
import logging
import argparse
import os
import requests
from datetime import datetime, date
from typing import Optional
from bs4 import BeautifulSoup

# ──── LLM 客户端（可选，DeepSeek / OpenAI 兼容接口） ─────────────────
_llm_client = None

def init_llm(api_key: str):
    global _llm_client
    try:
        from openai import OpenAI
        _llm_client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com"
        )
        log.info("DeepSeek LLM 客户端初始化成功")
    except ImportError:
        log.warning("openai 包未安装，LLM 增强不可用。请运行: pip install openai")
    except Exception as e:
        log.warning(f"LLM 初始化失败: {e}")

# ──── 配置 ────────────────────────────────────────────────────────
API_URL  = "http://localhost:8080/api/exam-info/batch-import"
API_KEY  = "crawler-secret-2025"
LOG_FILE = "crawler.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler(LOG_FILE, encoding="utf-8")]
)
log = logging.getLogger("crawler")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
}

CURRENT_YEAR = datetime.now().year

# ──── 工具函数 ────────────────────────────────────────────────────

def smart_decode(raw: bytes) -> str:
    for enc in ("utf-8", "gb18030", "gbk"):
        try:
            return raw.decode(enc)
        except Exception:
            pass
    return raw.decode("utf-8", errors="replace")

def safe_get(url: str, timeout: int = 12, verify_ssl: bool = True) -> Optional[str]:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout, verify=verify_ssl)
        return smart_decode(resp.content)
    except Exception as e:
        if verify_ssl and "SSL" in str(e):
            # SSL 证书问题时降级为不验证
            try:
                import urllib3
                urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
                resp = requests.get(url, headers=HEADERS, timeout=timeout, verify=False)
                return smart_decode(resp.content)
            except Exception as e2:
                log.warning(f"GET failed (no-SSL): {url} — {e2}")
                return None
        log.warning(f"GET failed: {url} — {e}")
        return None

def extract_date(text: str) -> Optional[str]:
    patterns = [
        r"(\d{4})-(\d{2})-(\d{2})",
        r"(\d{4})年(\d{1,2})月(\d{1,2})日",
        r"(\d{4})\.(\d{2})\.(\d{2})",
        r"(\d{4})/(\d{1,2})/(\d{1,2})",
    ]
    for pat in patterns:
        m = re.search(pat, text)
        if m:
            try:
                year, month, day = int(m.group(1)), int(m.group(2)), int(m.group(3))
                if 2020 <= year <= 2030 and 1 <= month <= 12 and 1 <= day <= 31:
                    return f"{year:04d}-{month:02d}-{day:02d}"
            except Exception:
                pass
    return None

def extract_year(text: str) -> Optional[int]:
    m = re.search(r"(202\d)", text)
    return int(m.group(1)) if m else CURRENT_YEAR

def classify_category(title: str, summary: str = "") -> str:
    text = title + " " + summary
    if any(k in text for k in ["奥赛", "竞赛", "NOIP", "CSP", "NOI", "联赛", "全国联赛"]):
        return "竞赛"
    if any(k in text for k in ["强基", "综合评价", "国测", "双一流"]):
        return "升学"
    if any(k in text for k in ["特长生", "科技类", "自主招生", "招生简章", "录取", "报名"]):
        return "招生"
    if any(k in text for k in ["高考", "考试", "认证", "测试", "中考"]):
        return "考试"
    if any(k in text for k in ["招生", "简章"]):
        return "招生"
    return "资讯"

def classify_region(title: str, summary: str = "") -> str:
    text = title + " " + summary
    hefei_kws = ["合肥", "庐阳", "蜀山", "包河", "瑶海", "滨湖", "新站", "高新"]
    anhui_kws = ["安徽", "芜湖", "蚌埠", "淮南", "阜阳", "宿州", "六安", "马鞍山",
                 "铜陵", "安庆", "黄山", "亳州", "宣城", "滁州", "池州", "淮北"]
    if any(k in text for k in hefei_kws):
        return "合肥"
    if any(k in text for k in anhui_kws):
        return "安徽"
    return "全国"

def classify_importance(title: str) -> str:
    high_kws = ["公告", "通知", "省队", "一等奖", "强基", "招生简章", "报名", "截止", "政策",
                "计划", "录取", "名单"]
    if any(k in title for k in high_kws):
        return "high"
    return "medium"

def classify_school_level(school: str) -> str:
    if not school:
        return ""
    if any(k in school for k in ["高中", "一中", "六中", "七中", "八中", "高级中学",
                                  "一六八", "168", "45中", "四十五中", "合肥中学"]):
        return "高中"
    if any(k in school for k in ["初中", "第一", "第二", "实验", "育英", "45中"]):
        return "初中"
    return ""

def is_anhui_relevant(title: str, summary: str = "") -> bool:
    text = title + " " + summary
    keywords = [
        "安徽", "合肥", "芜湖", "蚌埠", "淮南", "阜阳", "宿州", "六安",
        "马鞍山", "铜陵", "安庆", "黄山", "亳州", "宣城", "滁州", "池州",
        "淮北", "科技特长生", "信息学奥赛", "NOIP", "CSP", "强基计划",
        "特长生", "竞赛", "NOI"
    ]
    return any(k in text for k in keywords)

def make_item(title, url, source, pub_date=None, summary=None,
              school=None, school_level=None, region=None, tags=None,
              ai_recommended=None, importance=None, admission_year=None) -> dict:
    region = region or classify_region(title, summary or "")
    return {
        "title": title,
        "category": classify_category(title, summary or ""),
        "date": pub_date or str(date.today()),
        "source": source,
        "summary": summary or title,
        "link": url,
        "sourceUrl": url,
        "region": region,
        "importance": importance or classify_importance(title),
        "aiRecommended": ai_recommended if ai_recommended is not None else is_anhui_relevant(title, summary or ""),
        "tags": json.dumps(tags or [], ensure_ascii=False),
        "school": school or "",
        "schoolLevel": school_level or classify_school_level(school or ""),
        "admissionYear": admission_year or extract_year(title),
    }

# ──── LLM 增强提取 ──────────────────────────────────────────────────

LLM_SYSTEM = """你是一个专门解析中文教育资讯网页的助手。
用户会给你一段网页HTML文本或者页面摘要，以及学校名称和网址。
请从中提取所有与"特长生招生、竞赛、升学政策、科技特长生"相关的资讯条目，
返回严格的 JSON 数组，每个元素格式如下（所有字段均为字符串）：
{
  "title": "资讯标题",
  "category": "竞赛|招生|升学|考试|资讯 之一",
  "date": "YYYY-MM-DD",
  "summary": "一两句话摘要",
  "importance": "high|medium"
}
如果找不到相关内容，返回空数组 []。只返回 JSON，不要其他内容。"""

def llm_extract(raw_content: str, school: str, url: str,
                source: str, school_level: str = "",
                tags: list = None) -> list[dict]:
    """调用 DeepSeek API 从原始 HTML / 文本中提取结构化招生信息"""
    if _llm_client is None:
        return []
    # 截断过长内容（避免超出 token 限制）
    content = raw_content[:6000] if raw_content else ""
    if not content.strip():
        # 若连页面都没拿到，让 LLM 凭已知信息总结
        content = f"关于{school}的特长生招生和竞赛相关信息（{CURRENT_YEAR}年）"
    prompt = f"学校：{school}\n网址：{url}\n\n网页内容（HTML节选）：\n{content}"
    try:
        response = _llm_client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": LLM_SYSTEM},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        raw = response.choices[0].message.content.strip()
        # 提取 JSON 数组部分
        m = re.search(r"\[.*\]", raw, re.DOTALL)
        items_raw = json.loads(m.group(0)) if m else []
        items = []
        for it in items_raw:
            if not it.get("title"):
                continue
            items.append(make_item(
                title=it["title"],
                url=url,
                source=source,
                pub_date=it.get("date") or str(date.today()),
                summary=it.get("summary", ""),
                school=school,
                school_level=school_level,
                tags=tags or [school, "LLM提取"],
                importance=it.get("importance", "medium"),
            ))
        log.info(f"  [LLM] 从 {school} 提取到 {len(items)} 条")
        return items
    except Exception as e:
        log.warning(f"  [LLM] 调用失败: {e}")
        return []

def static_or_llm(url: str, school: str, source: str,
                   school_level: str = "", tags: list = None,
                   static_fn=None) -> list[dict]:
    """先静态爬取；若结果不足则调用 LLM 增强"""
    raw_html = safe_get(url)
    static_items = []
    if raw_html and static_fn:
        static_items = static_fn(raw_html, url)
    if static_items:
        log.info(f"  [静态] {school}: {len(static_items)} 条")
        return static_items
    # 静态失败 → LLM
    log.info(f"  [静态] {school}: 0 条，尝试 LLM 增强...")
    return llm_extract(raw_html or "", school, url, source, school_level, tags)

# ──── 数据源爬取器 ──────────────────────────────────────────────────

def scrape_noi_cn() -> list[dict]:
    """爬取 NOI 官网公告列表"""
    items = []
    html = safe_get("https://www.noi.cn/")
    if not html:
        return items
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True)[:60]:
        title = a.get_text(strip=True)
        href = a["href"]
        if len(title) < 8:
            continue
        if not any(k in title for k in ["公告", "通知", "公示", "选拔", "报名", "成绩", "NOI", "NOIP", "CSP", "名单"]):
            continue
        full_url = href if href.startswith("http") else "https://www.noi.cn" + href
        content_html = safe_get(full_url)
        pub_date = extract_date(content_html or "") or str(date.today())
        items.append(make_item(
            title=title, url=full_url, source="NOI官网",
            pub_date=pub_date,
            tags=["NOI", "信息学", "官方"],
            ai_recommended="安徽" in title or "合肥" in title or "NOI" in title,
        ))
    return items


def scrape_jyj_hefei() -> list[dict]:
    """爬取合肥市教育局通知公告"""
    items = []
    base = "https://jyj.hefei.gov.cn"
    urls = [
        f"{base}/zwgk/xxgkml/tzcsjzyjytzgg/",
        f"{base}/zwgk/xxgkml/bszn/",
        f"{base}/zwgk/xxgkml/zfxxgkml/zs/",
    ]
    for list_url in urls:
        html = safe_get(list_url)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        for a in soup.find_all("a", href=True)[:50]:
            title = a.get_text(strip=True)
            href = a["href"]
            if len(title) < 6:
                continue
            if not any(k in title for k in ["招生", "高考", "特长", "竞赛", "自主", "科技",
                                              "奥赛", "通知", "公告", "计划", "特殊"]):
                continue
            full_url = href if href.startswith("http") else base + href
            pub_date = extract_date(title) or str(date.today())
            items.append(make_item(
                title=title, url=full_url, source="合肥市教育局",
                pub_date=pub_date, region="合肥",
                tags=["合肥", "教育局", "官方通知"],
                ai_recommended=any(k in title for k in ["特长生", "自主招生", "竞赛"]),
            ))
    return items


def scrape_ahep_edu() -> list[dict]:
    """爬取安徽省教育厅通知公告"""
    items = []
    base = "https://www.ahedu.gov.cn"
    urls = [
        f"{base}/xwzx/tzgg/",
        f"{base}/sjfb/",
    ]
    for list_url in urls:
        html = safe_get(list_url)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        for a in soup.find_all("a", href=True)[:50]:
            title = a.get_text(strip=True)
            href = a["href"]
            if len(title) < 6:
                continue
            if not any(k in title for k in ["招生", "特长", "竞赛", "高考", "中考",
                                              "通知", "自主", "科技", "强基"]):
                continue
            full_url = href if href.startswith("http") else base + href
            pub_date = extract_date(title) or str(date.today())
            items.append(make_item(
                title=title, url=full_url, source="安徽省教育厅",
                pub_date=pub_date, region="安徽",
                tags=["安徽", "教育厅", "政策"],
            ))
    return items


# ──── 合肥重点高中专项爬虫 ──────────────────────────────────────────

def _parse_school_news(html: str, base_url: str, school: str,
                        source: str, school_level: str,
                        kws: list, tags: list) -> list[dict]:
    """通用学校新闻列表解析"""
    soup = BeautifulSoup(html, "html.parser")
    items = []
    seen = set()
    for a in soup.find_all("a", href=True):
        title = (a.get("title") or a.get_text()).strip()
        if not title or len(title) < 8:
            continue
        if not any(k in title for k in kws):
            continue
        href = a["href"]
        if href in seen or href == "#":
            continue
        seen.add(href)
        full_url = href if href.startswith("http") else base_url.rstrip("/") + "/" + href.lstrip("/")
        pub_date = extract_date(title) or str(date.today())
        items.append(make_item(
            title=title, url=full_url, source=source,
            pub_date=pub_date, school=school,
            school_level=school_level,
            region="合肥",
            tags=tags,
            ai_recommended=True,
        ))
    return items


SCHOOL_KEYWORDS = ["特长生", "招生", "竞赛", "奥赛", "信息学", "获奖", "NOI",
                   "NOIP", "CSP", "科技", "强基", "自主", "计划", "通知", "公告"]


def scrape_hefei_no1() -> list[dict]:
    """合肥第一中学"""
    school = "合肥一中"
    url = "http://www.hfyz.com.cn/news/"
    def _static(html, url): return _parse_school_news(
        html, "http://www.hfyz.com.cn", school, school, "高中", SCHOOL_KEYWORDS,
        ["合肥一中", "特长生", "竞赛"])
    return static_or_llm(url, school, school, "高中",
                         ["合肥一中", "特长生", "竞赛"], _static)


def scrape_hefei_168() -> list[dict]:
    """合肥一六八中学"""
    school = "合肥一六八中学"
    url = "http://www.hf168.com/news/"
    def _static(html, url): return _parse_school_news(
        html, "http://www.hf168.com", school, school, "高中", SCHOOL_KEYWORDS,
        ["一六八", "特长生", "信息学"])
    return static_or_llm(url, school, school, "高中",
                         ["一六八", "特长生", "信息学"], _static)


def scrape_hefei_no6() -> list[dict]:
    """合肥第六中学"""
    school = "合肥六中"
    url = "http://www.hf6z.cn/news/"
    def _static(html, url): return _parse_school_news(
        html, "http://www.hf6z.cn", school, school, "高中", SCHOOL_KEYWORDS,
        ["合肥六中", "特长生", "竞赛"])
    return static_or_llm(url, school, school, "高中",
                         ["合肥六中", "特长生"], _static)


def scrape_hefei_no45() -> list[dict]:
    """合肥四十五中（含初中部）"""
    school = "合肥四十五中"
    url = "http://www.hf45z.com/news/"
    def _static(html, url): return _parse_school_news(
        html, "http://www.hf45z.com", school, school, "初中", SCHOOL_KEYWORDS,
        ["四十五中", "45中", "特长生"])
    return static_or_llm(url, school, school, "初中",
                         ["四十五中", "特长生", "科技竞赛"], _static)


def scrape_hefei_no8() -> list[dict]:
    """合肥八中（以信息学为特色）"""
    school = "合肥八中"
    # 合肥八中正式域名
    url = "http://www.hf8z.cn/news/"
    def _static(html, url): return _parse_school_news(
        html, "http://www.hf8z.cn", school, school, "高中", SCHOOL_KEYWORDS,
        ["合肥八中", "信息学", "特长生", "竞赛"])
    return static_or_llm(url, school, school, "高中",
                         ["合肥八中", "信息学", "特长生"], _static)


def scrape_hefei_renai() -> list[dict]:
    """合肥市市区各重点初中（LLM 生成模式）- 直接使用 LLM 汇总已知信息"""
    school = "合肥市重点初中"
    prompt_url = "https://jyj.hefei.gov.cn/zs/"
    html = safe_get(prompt_url)
    return static_or_llm(
        prompt_url, school, "合肥市教育局", "初中",
        ["初中", "特长生", "科技"],
        lambda h, u: _parse_school_news(
            h, "https://jyj.hefei.gov.cn", school,
            "合肥市教育局", "初中", SCHOOL_KEYWORDS, ["初中", "特长生"])
    )


def scrape_kjtcsw() -> list[dict]:
    """科技特长生网信息学板块"""
    items = []
    for page in range(1, 5):
        url = "http://www.kjtcsw.com/xinxixueaosai/dongtai/" if page == 1 else \
              f"http://www.kjtcsw.com/xinxixueaosai/dongtai/index_{page}.html"
        html = safe_get(url)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        seen = set()
        for a in soup.find_all("a", href=True):
            href = a["href"]
            title = (a.get("title") or a.get_text()).strip()
            if not title or len(title) < 6:
                continue
            if ".html" not in href or "xinxixueaosai" not in href:
                continue
            full_url = "http://www.kjtcsw.com" + href if not href.startswith("http") else href
            if full_url in seen:
                continue
            seen.add(full_url)
            content_html = safe_get(full_url)
            pub_date = extract_date(content_html or "") if content_html else str(date.today())
            items.append(make_item(
                title=title, url=full_url, source="科技特长生网",
                pub_date=pub_date or str(date.today()),
                tags=["信息学奥赛", "省动态"],
                ai_recommended=is_anhui_relevant(title),
            ))
            time.sleep(0.3)
    return items


def scrape_gaokao_chsi() -> list[dict]:
    """阳光高考平台强基/综评信息"""
    items = []
    urls = [
        "https://gaokao.chsi.com.cn/zsjh/lqzc/",
        "https://gaokao.chsi.com.cn/zszx/",
    ]
    for url in urls:
        html = safe_get(url)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        for a in soup.find_all("a", href=True)[:40]:
            title = a.get_text(strip=True)
            href = a["href"]
            if len(title) < 6:
                continue
            if not any(k in title for k in ["强基", "综合评价", "自主", "竞赛", "特长", "高考"]):
                continue
            full_url = href if href.startswith("http") else "https://gaokao.chsi.com.cn" + href
            pub_date = extract_date(title) or str(date.today())
            items.append(make_item(
                title=title, url=full_url, source="阳光高考平台",
                pub_date=pub_date,
                tags=["强基计划", "综合评价", "升学"],
                ai_recommended=any(k in title for k in ["强基", "综评", "科技"]),
            ))
    return items


def scrape_zhongkao_hefei() -> list[dict]:
    """中考网合肥频道 - 特长生/重点高中招生"""
    items = []
    urls = [
        "https://hefei.zhongkao.com/e/15/",
        "https://hefei.zhongkao.com/e/20/",
    ]
    for url in urls:
        html = safe_get(url)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        for a in soup.find_all("a", href=True)[:40]:
            title = a.get_text(strip=True)
            href = a["href"]
            if len(title) < 8:
                continue
            if not any(k in title for k in ["特长生", "招生", "录取", "分数", "重点"]):
                continue
            full_url = href if href.startswith("http") else "https://hefei.zhongkao.com" + href
            pub_date = extract_date(title) or str(date.today())
            items.append(make_item(
                title=title, url=full_url, source="中考网合肥",
                pub_date=pub_date, region="合肥",
                tags=["中考", "合肥", "招生"],
                ai_recommended=any(k in title for k in ["特长生", "信息学", "科技"]),
            ))
    return items


def scrape_ahnu_edu() -> list[dict]:
    """安徽师范大学附属中学信息学资讯"""
    items = []
    html = safe_get("https://ahnu.edu.cn/")
    if not html:
        return items
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True)[:50]:
        title = a.get_text(strip=True)
        href = a["href"]
        if len(title) < 6:
            continue
        if not any(k in title for k in ["竞赛", "奥赛", "NOIP", "CSP", "NOI", "信息学", "获奖", "特长"]):
            continue
        full_url = href if href.startswith("http") else "https://ahnu.edu.cn" + href
        items.append(make_item(
            title=title, url=full_url, source="安师大附中",
            pub_date=extract_date(title) or str(date.today()),
            school="安师大附中", school_level="高中",
            region="安徽",
            tags=["安师大附中", "信息学", "竞赛"],
            ai_recommended=True,
        ))
    return items


# ──── 主流程 ─────────────────────────────────────────────────────────

def run_crawl():
    log.info("=" * 60)
    log.info("爬虫 V2 启动...")
    all_items: list[dict] = []

    scrapers = [
        ("NOI官网",       scrape_noi_cn),
        ("合肥教育局",     scrape_jyj_hefei),
        ("安徽省教育厅",   scrape_ahep_edu),
        ("合肥一中",       scrape_hefei_no1),
        ("合肥一六八",     scrape_hefei_168),
        ("合肥六中",       scrape_hefei_no6),
        ("合肥八中",       scrape_hefei_no8),
        ("合肥四十五中",   scrape_hefei_no45),
        ("合肥重点初中",   scrape_hefei_renai),
        ("科技特长生网",   scrape_kjtcsw),
        ("阳光高考",       scrape_gaokao_chsi),
        ("中考网合肥",     scrape_zhongkao_hefei),
        ("安师大附中",     scrape_ahnu_edu),
    ]

    for name, fn in scrapers:
        try:
            log.info(f"正在爬取: {name}")
            items = fn()
            log.info(f"  → 获取 {len(items)} 条")
            all_items.extend(items)
        except Exception as e:
            log.error(f"  × {name} 爬取失败: {e}")
        time.sleep(1)

    # 去重（按 sourceUrl）
    seen_urls: set[str] = set()
    deduped = []
    for it in all_items:
        url = it.get("sourceUrl", "")
        if url and url not in seen_urls:
            seen_urls.add(url)
            deduped.append(it)
        elif not url:
            deduped.append(it)

    log.info(f"去重后共 {len(deduped)} 条，准备写入后端...")

    if not deduped:
        log.info("无新数据，跳过写入。")
        return

    try:
        resp = requests.post(
            API_URL,
            json=deduped,
            headers={
                "Content-Type": "application/json",
                "X-Crawler-Key": API_KEY,
            },
            timeout=60,
        )
        if resp.status_code == 200:
            result = resp.json()
            log.info(f"写入成功！新增: {result.get('imported')}，跳过重复: {result.get('skipped')}")
            if result.get("errors"):
                for err in result["errors"]:
                    log.warning(f"  错误: {err}")
        else:
            log.error(f"API 返回错误: {resp.status_code} — {resp.text[:200]}")
    except Exception as e:
        log.error(f"无法连接到后端 API: {e}")

    log.info("爬虫完成。")


def main():
    parser = argparse.ArgumentParser(description="升学资讯定时爬虫 V2")
    parser.add_argument("--once", action="store_true", help="执行一次后退出（供 Spring Boot 调用）")
    parser.add_argument("--llm-key", type=str, default="",
                        help="DeepSeek API Key（也可设置环境变量 DEEPSEEK_API_KEY）")
    args = parser.parse_args()

    # 初始化 LLM（优先命令行参数，其次环境变量）
    llm_key = args.llm_key or os.environ.get("DEEPSEEK_API_KEY", "")
    if llm_key:
        init_llm(llm_key)
    else:
        log.info("未提供 LLM Key，跳过 DeepSeek 增强（静态爬虫仍正常运行）")

    run_crawl()


if __name__ == "__main__":
    main()
