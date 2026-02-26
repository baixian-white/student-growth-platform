#!/usr/bin/env python3
"""
定时爬虫 — 安徽/合肥地区升学资讯汇聚系统
爬取目标：科技特长生、强基计划、信息学奥赛相关官方资讯
数据写入：Spring Boot 后端 /api/exam-info/batch-import

使用方法：
  pip install requests beautifulsoup4 schedule
  python crawl_exam_news.py             # 持续运行，每日 02:00 触发
  python crawl_exam_news.py --once      # 立即执行一次后退出
"""

import re
import sys
import time
import json
import logging
import argparse
import requests
from datetime import datetime, date
from typing import Optional
from bs4 import BeautifulSoup

try:
    import schedule
except ImportError:
    schedule = None

# ──── 配置 ────────────────────────────────────────────────────────
API_URL   = "http://localhost:8080/api/exam-info/batch-import"
API_KEY   = "crawler-secret-2025"
LOG_FILE  = "crawler.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler(LOG_FILE, encoding="utf-8")]
)
log = logging.getLogger("crawler")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9",
}

# ──── 爬取函数 ─────────────────────────────────────────────────────

def smart_decode(raw: bytes) -> str:
    for enc in ("utf-8", "gb18030", "gbk"):
        try:
            return raw.decode(enc)
        except Exception:
            pass
    return raw.decode("utf-8", errors="replace")

def safe_get(url: str, timeout: int = 10) -> Optional[str]:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout)
        return smart_decode(resp.content)
    except Exception as e:
        log.warning(f"GET failed: {url} — {e}")
        return None

def extract_date(text: str) -> Optional[str]:
    """从文本中提取第一个日期（格式 YYYY-MM-DD 或 YYYY年MM月DD日）"""
    patterns = [
        r"(\d{4})-(\d{2})-(\d{2})",
        r"(\d{4})年(\d{1,2})月(\d{1,2})日",
        r"(\d{4})\.(\d{2})\.(\d{2})",
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

def classify_category(title: str, summary: str = "") -> str:
    text = title + " " + summary
    if any(k in text for k in ["奥赛", "竞赛", "NOIP", "CSP", "NOI", "联赛", "竞争"]):
        return "竞赛"
    if any(k in text for k in ["强基", "综合评价", "国测"]):
        return "升学"
    if any(k in text for k in ["特长生", "科技类", "自主招生"]):
        return "招生"
    if any(k in text for k in ["高考", "考试", "认证", "测试"]):
        return "考试"
    if any(k in text for k in ["招生", "简章", "录取"]):
        return "招生"
    return "资讯"

def classify_region(title: str, summary: str = "") -> str:
    text = title + " " + summary
    hefei_kws = ["合肥", "庐阳", "蜀山", "包河", "瑶海", "滨湖"]
    anhui_kws = ["安徽", "芜湖", "蚌埠", "淮南", "阜阳", "宿州", "六安", "马鞍山"]
    if any(k in text for k in hefei_kws):
        return "合肥"
    if any(k in text for k in anhui_kws):
        return "安徽"
    return "全国"

def classify_importance(title: str) -> str:
    high_kws = ["公告", "通知", "省队", "一等奖", "强基", "招生简章", "报名", "截止", "政策"]
    if any(k in title for k in high_kws):
        return "high"
    return "medium"

def is_anhui_relevant(title: str, summary: str = "") -> bool:
    text = title + " " + summary
    keywords = [
        "安徽", "合肥", "芜湖", "蚌埠", "淮南", "阜阳", "宿州", "六安",
        "马鞍山", "铜陵", "安庆", "黄山", "亳州", "宣城", "滁州", "池州",
        "淮北", "科技特长生", "信息学奥赛", "NOIP", "CSP", "强基计划",
        "特长生", "竞赛", "NOI"
    ]
    return any(k in text for k in keywords)


# ──── 数据源爬取器 ─────────────────────────────────────────────────

def scrape_noi_cn() -> list[dict]:
    """爬取 NOI 官网公告列表"""
    items = []
    html = safe_get("https://www.noi.cn/")
    if not html:
        return items
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True)[:60]:
        title = a.get_text(strip=True)
        href  = a["href"]
        if len(title) < 8:
            continue
        if not any(k in title for k in ["公告", "通知", "公示", "选拔", "报名", "成绩", "NOI", "NOIP", "CSP", "名单"]):
            continue
        full_url = href if href.startswith("http") else "https://www.noi.cn" + href
        content_html = safe_get(full_url)
        pub_date = extract_date(content_html or "") or str(date.today())
        items.append({
            "title": title,
            "category": classify_category(title),
            "date": pub_date,
            "source": "NOI官网",
            "summary": title,
            "link": full_url,
            "sourceUrl": full_url,
            "region": classify_region(title),
            "importance": classify_importance(title),
            "aiRecommended": "安徽" in title or "合肥" in title or "NOI" in title,
            "tags": json.dumps(["NOI", "信息学", "官方"], ensure_ascii=False),
        })
    return items


def scrape_jyj_hefei() -> list[dict]:
    """爬取合肥市教育局通知公告"""
    items = []
    base = "https://jyj.hefei.gov.cn"
    urls = [
        f"{base}/zwgk/xxgkml/tzcsjzyjytzgg/",
        f"{base}/zwgk/xxgkml/bszn/",
    ]
    for list_url in urls:
        html = safe_get(list_url)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        for a in soup.find_all("a", href=True)[:40]:
            title = a.get_text(strip=True)
            href  = a["href"]
            if len(title) < 6:
                continue
            if not any(k in title for k in ["招生", "高考", "特长", "竞赛", "自主", "科技", "奥赛", "通知", "公告", "计划"]):
                continue
            full_url = href if href.startswith("http") else base + href
            pub_date = extract_date(title) or str(date.today())
            items.append({
                "title": title,
                "category": classify_category(title),
                "date": pub_date,
                "source": "合肥市教育局",
                "summary": title,
                "link": full_url,
                "sourceUrl": full_url,
                "region": "合肥",
                "importance": classify_importance(title),
                "aiRecommended": any(k in title for k in ["特长生", "自主招生", "竞赛"]),
                "tags": json.dumps(["合肥", "教育局", "官方通知"], ensure_ascii=False),
            })
    return items


def scrape_kjtcsw() -> list[dict]:
    """爬取科技特长生网（kjtcsw.com）信息学板块"""
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
            href  = a["href"]
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
            if not pub_date:
                pub_date = str(date.today())
            items.append({
                "title": title,
                "category": classify_category(title),
                "date": pub_date,
                "source": "科技特长生网",
                "summary": title,
                "link": full_url,
                "sourceUrl": full_url,
                "region": classify_region(title),
                "importance": classify_importance(title),
                "aiRecommended": is_anhui_relevant(title),
                "tags": json.dumps(["信息学奥赛", "省动态"], ensure_ascii=False),
            })
            time.sleep(0.3)
    return items


def scrape_ahnu_edu() -> list[dict]:
    """爬取安徽师范大学附属中学信息学资讯"""
    items = []
    html = safe_get("https://ahnu.edu.cn/")
    if not html:
        return items
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True)[:50]:
        title = a.get_text(strip=True)
        href  = a["href"]
        if len(title) < 6:
            continue
        if not any(k in title for k in ["竞赛", "奥赛", "NOIP", "CSP", "NOI", "信息学", "获奖", "特长"]):
            continue
        full_url = href if href.startswith("http") else "https://ahnu.edu.cn" + href
        pub_date = extract_date(title) or str(date.today())
        items.append({
            "title": title,
            "category": classify_category(title),
            "date": pub_date,
            "source": "安师大附中",
            "summary": title,
            "link": full_url,
            "sourceUrl": full_url,
            "region": "安徽",
            "importance": classify_importance(title),
            "aiRecommended": True,
            "tags": json.dumps(["安师大附中", "信息学", "竞赛"], ensure_ascii=False),
        })
    return items


def scrape_gaokao_chsi() -> list[dict]:
    """爬取阳光高考平台强基/综评信息"""
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
            href  = a["href"]
            if len(title) < 6:
                continue
            if not any(k in title for k in ["强基", "综合评价", "自主", "竞赛", "特长", "高考"]):
                continue
            full_url = href if href.startswith("http") else "https://gaokao.chsi.com.cn" + href
            pub_date = extract_date(title) or str(date.today())
            items.append({
                "title": title,
                "category": classify_category(title),
                "date": pub_date,
                "source": "阳光高考平台",
                "summary": title,
                "link": full_url,
                "sourceUrl": full_url,
                "region": classify_region(title),
                "importance": classify_importance(title),
                "aiRecommended": any(k in title for k in ["强基", "综评", "科技"]),
                "tags": json.dumps(["强基计划", "综合评价", "升学"], ensure_ascii=False),
            })
    return items


# ──── 主流程 ──────────────────────────────────────────────────────

def run_crawl():
    log.info("=" * 60)
    log.info("爬虫启动...")
    all_items = []

    scrapers = [
        ("NOI官网", scrape_noi_cn),
        ("合肥教育局", scrape_jyj_hefei),
        ("科技特长生网", scrape_kjtcsw),
        ("安师大附中", scrape_ahnu_edu),
        ("阳光高考", scrape_gaokao_chsi),
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

    # 去重（本地按 sourceUrl）
    seen_urls = set()
    deduped = []
    for it in all_items:
        url = it.get("sourceUrl", "")
        if url and url not in seen_urls:
            seen_urls.add(url)
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
            timeout=30,
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
    parser = argparse.ArgumentParser(description="升学资讯定时爬虫")
    parser.add_argument("--once", action="store_true", help="只执行一次后退出")
    args = parser.parse_args()

    if args.once:
        run_crawl()
        return

    if schedule is None:
        log.error("schedule 未安装，请运行: pip install schedule")
        sys.exit(1)

    log.info("定时爬虫启动，每日 02:00 自动触发（使用 --once 立即执行一次）")
    schedule.every().day.at("02:00").do(run_crawl)

    # 启动时先执行一次
    run_crawl()

    while True:
        schedule.run_pending()
        time.sleep(60)


if __name__ == "__main__":
    main()
