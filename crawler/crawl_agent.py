#!/usr/bin/env python3
"""
智能体爬虫 — 安徽/合肥升学资讯采集系统 (Agent Edition)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
架构：DeepSeek Function Calling 驱动的 ReAct 智能体
工具：search_baidu / fetch_page / report_items
特点：无硬编码 URL，智能体自主搜索、判断、提取、上报

依赖：pip install requests beautifulsoup4 openai
用法：python crawl_agent.py --llm-key sk-xxx [--dry-run]
"""

import os, re, sys, json, time, logging, argparse, random

# 强制终端输出使用 UTF-8 编码，防止 Windows 终端乱码
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

import requests
from bs4 import BeautifulSoup
from datetime import date
from typing import Optional
from openai import OpenAI

# ──── 配置 ─────────────────────────────────────────────────────
BACKEND_URL = "http://localhost:8080/api/exam-info/batch-import"
CRAWLER_KEY = "crawler-secret-2025"
LOG_FILE    = "agent_crawler.log"
MAX_AGENT_STEPS = 20          # 每个主题最多执行步骤数
MAX_FETCH_CHARS = 8000        # 页面内容最大字符数（节省 token）
REQUEST_DELAY   = (1.5, 3.0)  # 请求间隔随机范围（秒）

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(),
              logging.FileHandler(LOG_FILE, encoding="utf-8")]
)
log = logging.getLogger("agent")

# ──── 搜索主题（智能体的"任务清单"）──────────────────────────────
SEARCH_MISSIONS = [
    "合肥市 科技特长生 招生简章 2025 2026",
    "合肥一中 信息学奥赛 特长生招生 录取",
    "合肥一六八中学 特长生 招生计划",
    "合肥六中 合肥八中 特长生 竞赛招生",
    "合肥四十五中 初中 特长生招生",
    "安徽省 科技特长生 政策 通知 2025 2026",
    "NOIP CSP 安徽 2025 获奖名单",
    "合肥市重点高中 信息学竞赛 自主招生",
    "安徽省教育厅 特长生 通知公告",
    "合肥中考 科技特长生 录取分数线",
    "强基计划 安徽 2026 招生简章",
]

BAIDU_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    # 明确排除 br（brotli），requests 不支持 brotli 解压
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Referer": "https://www.baidu.com/",
}

# ──── 工具函数 ────────────────────────────────────────────────────

def _sleep():
    time.sleep(random.uniform(*REQUEST_DELAY))

def _parse_baidu_results(html_bytes: bytes, num: int) -> list[dict]:
    """解析百度搜索结果页"""
    results = []
    try:
        # 尝试多种编码
        for enc in ("utf-8", "gb18030"):
            try:
                html = html_bytes.decode(enc); break
            except: pass
        else:
            html = html_bytes.decode("utf-8", errors="replace")

        soup = BeautifulSoup(html, "html.parser")
        for item in soup.select(".result.c-container, .result"):
            title_el  = item.select_one("h3 a, .t a")
            snippet_el = item.select_one(".c-abstract, .c-span-last, .content-right_8Zs40")
            if not title_el:
                continue
            title   = title_el.get_text(strip=True)
            href    = title_el.get("href", "")
            snippet = snippet_el.get_text(strip=True) if snippet_el else ""
            if not href or not title or len(title) < 4:
                continue
            results.append({"title": title[:120], "url": href, "snippet": snippet[:200]})
    except Exception as e:
        log.warning(f"百度结果解析异常: {e}")
    return results[:num]

def _parse_bing_results(html_bytes: bytes, num: int) -> list[dict]:
    """解析必应搜索结果页（兜底）"""
    results = []
    try:
        html = html_bytes.decode("utf-8", errors="replace")
        soup = BeautifulSoup(html, "html.parser")
        for li in soup.select("li.b_algo"):
            h2 = li.select_one("h2 a")
            p  = li.select_one("p, .b_caption p")
            if not h2: continue
            results.append({
                "title":   h2.get_text(strip=True)[:120],
                "url":     h2.get("href", ""),
                "snippet": p.get_text(strip=True)[:200] if p else "",
            })
    except Exception as e:
        log.warning(f"必应结果解析异常: {e}")
    return results[:num]

def search_baidu(query: str, num: int = 8) -> list[dict]:
    """搜索（百度优先，必应兜底）"""
    # ── 百度 ──────────────────────────────────────────────────────
    try:
        url = f"https://www.baidu.com/s?wd={requests.utils.quote(query)}&rn={num}"
        resp = requests.get(url, headers=BAIDU_HEADERS, timeout=15)
        results = _parse_baidu_results(resp.content, num)
        if results:
            log.info(f"  [百度] '{query}' → {len(results)} 条")
            _sleep()
            return results
    except Exception as e:
        log.warning(f"  [百度] 请求失败: {e}")

    # ── 必应（兜底） ───────────────────────────────────────────────
    try:
        bing_url = f"https://cn.bing.com/search?q={requests.utils.quote(query)}&count={num}"
        bing_headers = {**BAIDU_HEADERS, "Referer": "https://cn.bing.com/"}
        resp = requests.get(bing_url, headers=bing_headers, timeout=15)
        results = _parse_bing_results(resp.content, num)
        if results:
            log.info(f"  [必应] '{query}' → {len(results)} 条")
            _sleep()
            return results
    except Exception as e:
        log.warning(f"  [必应] 请求失败: {e}")

    log.warning(f"  [搜索] '{query}' 两个引擎均无结果")
    _sleep()
    return []

# --------- 引入 Playwright 支持动态页面 (选装) ---------
try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_ENABLED = True
except ImportError:
    PLAYWRIGHT_ENABLED = False


def fetch_page(url: str, timeout: int = 15) -> str:
    """获取指定网页内容并清理噪音的 HTML"""
    html = ""
    if PLAYWRIGHT_ENABLED:
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.goto(url, timeout=timeout * 1000, wait_until="domcontentloaded")
                # 可选：等待几秒让动态内容加载
                page.wait_for_timeout(2000)
                html = page.content()
                browser.close()
        except Exception as e:
            return f"[ERROR] 动态抓取失败: {str(e)}"
    else:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        try:
            resp = requests.get(url, headers=headers, timeout=timeout, verify=False)
            resp.raise_for_status()
            resp.encoding = resp.apparent_encoding
            html = resp.text
        except Exception as e:
            return f"[ERROR] 抓取失败: {str(e)}"

    soup = BeautifulSoup(html, "html.parser")
    # 移除脚本、样式、导航
    for tag in soup(["script", "style", "nav", "header", "footer", "aside"]):
        tag.decompose()
    text = soup.get_text(separator="\n", strip=True)
    # 压缩空行
    text = re.sub(r"\n{3,}", "\n\n", text)
    _sleep()
    return text[:MAX_FETCH_CHARS]

# ──── DeepSeek Function Calling 工具定义 ─────────────────────────

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_baidu",
            "description": (
                "在百度搜索引擎中搜索，获取相关网页列表。"
                "适合寻找合肥/安徽地区教育政策、招生信息、竞赛资讯的入口页面。"
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "搜索关键词，用中文，加上年份效果更好"
                    },
                    "num": {
                        "type": "integer",
                        "description": "返回结果数量，默认 8，最多 10",
                        "default": 8
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "fetch_page",
            "description": (
                "抓取指定网页的文本内容。"
                "在 search_baidu 找到有价值的 URL 后，用此工具获取详细内容，"
                "以便提取结构化招生/竞赛信息。"
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "要抓取的网页 URL"
                    }
                },
                "required": ["url"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "report_items",
            "description": (
                "上报从网页中提取到的招生/竞赛资讯条目。"
                "当你已经从页面内容中提取到结构化信息后，调用此工具保存结果。"
                "至少提取到 1 条有效信息后才能调用。"
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "description": "提取到的资讯条目列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title":       {"type": "string", "description": "资讯标题"},
                                "category":    {"type": "string", "description": "分类：竞赛/招生/升学/考试/资讯"},
                                "date":        {"type": "string", "description": "发布日期 YYYY-MM-DD（若无则用今天）"},
                                "summary":     {"type": "string", "description": "一两句话摘要"},
                                "source":      {"type": "string", "description": "来源名称，如'合肥市教育局'"},
                                "source_url":  {"type": "string", "description": "原文 URL"},
                                "school":      {"type": "string", "description": "相关学校名（无则留空）"},
                                "school_level":{"type": "string", "description": "高中/初中/（留空）"},
                                "region":      {"type": "string", "description": "合肥/安徽/全国"},
                                "importance":  {"type": "string", "description": "high/medium"}
                            },
                            "required": ["title", "category", "summary", "source", "source_url"]
                        }
                    }
                },
                "required": ["items"]
            }
        }
    }
]

SYSTEM_PROMPT = """你是一个专业的教育资讯采集智能体，专门收集安徽省（尤其是合肥市）的升学资讯。

你的任务：
1. 搜索并收集有关"科技特长生、特长生招生、合肥重点高中/初中招生计划、信息学奥赛、强基计划"的最新资讯
2. 重点关注：合肥一中、合肥一六八、合肥六中、合肥八中、合肥四十五中等重点学校
3. 关注信息时效性（2024-2026年的信息优先）
4. 每次搜索后，选择最相关的1-3个页面深入抓取
5. 从页面中提取结构化信息后，调用 report_items 上报
6. 避免重复抓取同一网站的不相关内容

工作流程：search_baidu → 判断哪些 URL 值得抓 → fetch_page → 提取信息 → report_items

注意：
- 只提取真实存在的具体资讯，不要编造内容
- 如果页面内容与主题无关，直接跳过，搜索其他关键词
- 一个主题最多执行 8-10 步，然后调用 report_items 结束
"""

# ──── 智能体执行器 ────────────────────────────────────────────────

class CrawlerAgent:
    def __init__(self, llm_key: str, existing_urls: set = None):
        self.client = OpenAI(
            api_key=llm_key,
            base_url="https://api.deepseek.com"
        )
        self.collected: list[dict] = []
        self.existing_urls = existing_urls or set()

    def _call_tool(self, name: str, args: dict) -> str:
        if name == "search_baidu":
            results = search_baidu(args["query"], args.get("num", 8))
            if not results:
                return "未找到相关搜索结果，请尝试其他关键词。"
            lines = [f"{i+1}. [{r['title']}]({r['url']})\n   {r['snippet']}"
                     for i, r in enumerate(results)]
            log.info(f"  [百度] '{args['query']}' → {len(results)} 条结果")
            return "\n".join(lines)

        elif name == "fetch_page":
            url = args["url"]
            if url in self.existing_urls:
                log.info(f"  [跳过] 本地已存在该网页: {url[:60]}")
                return "[ERROR] 该网页已存在于我们数据库中，请跳过此网页，尝试从搜索结果中抓取其他新的网页内容。"
                
            log.info(f"  [抓取] {url[:80]}")
            content = fetch_page(url)
            if content.startswith("[ERROR]"):
                log.warning(f"  {content}")
                return content
            log.info(f"  [抓取] 成功，{len(content)} 字符")
            return content

        elif name == "report_items":
            raw_items = args.get("items", [])
            today = str(date.today())
            for it in raw_items:
                item = {
                    "title":       it.get("title", "").strip(),
                    "category":    it.get("category", "资讯"),
                    "date":        it.get("date") or today,
                    "source":      it.get("source", "网络"),
                    "summary":     it.get("summary", ""),
                    "link":        it.get("source_url", ""),
                    "sourceUrl":   it.get("source_url", ""),
                    "region":      it.get("region", "合肥"),
                    "importance":  it.get("importance", "medium"),
                    "aiRecommended": True,
                    "tags":        json.dumps(["智能体采集", it.get("school", "")], ensure_ascii=False),
                    "school":      it.get("school", ""),
                    "schoolLevel": it.get("school_level", ""),
                    "admissionYear": int(re.search(r"202\d", it.get("date") or today).group())
                                     if re.search(r"202\d", it.get("date") or today) else date.today().year,
                }
                if item["title"] and item["sourceUrl"]:
                    self.collected.append(item)
            log.info(f"  [上报] +{len(raw_items)} 条，累计 {len(self.collected)} 条")
            return f"已记录 {len(raw_items)} 条信息。"

        return f"未知工具: {name}"

    def run_mission(self, mission: str):
        """针对一个搜索主题运行智能体"""
        log.info(f"\n{'='*55}")
        log.info(f"主题: {mission}")
        messages = [
            {"role": "system",  "content": SYSTEM_PROMPT},
            {"role": "user",
             "content": f"请搜索并收集以下主题的最新资讯：\n{mission}"}
        ]
        steps = 0
        while steps < MAX_AGENT_STEPS:
            steps += 1
            try:
                resp = self.client.chat.completions.create(
                    model="deepseek-chat",
                    messages=messages,
                    tools=TOOLS,
                    tool_choice="auto",
                    temperature=0.1,
                    max_tokens=2000,
                )
            except Exception as e:
                log.error(f"  [LLM] API 调用失败: {e}")
                break

            msg = resp.choices[0].message

            # 没有工具调用 = 智能体完成
            if not msg.tool_calls:
                log.info(f"  [智能体] 完成（步骤 {steps}）")
                break

            # 执行工具调用
            messages.append(msg)
            tool_results = []
            reported = False
            for tc in msg.tool_calls:
                fn_name = tc.function.name
                fn_args = json.loads(tc.function.arguments)
                result  = self._call_tool(fn_name, fn_args)
                tool_results.append({
                    "role":         "tool",
                    "tool_call_id": tc.id,
                    "content":      result,
                })
                if fn_name == "report_items":
                    reported = True

            messages.extend(tool_results)

            # 上报后结束当前主题
            if reported:
                break

        log.info(f"主题完成，累计 {len(self.collected)} 条")

    def run_all(self, max_workers=3, topic_done_callback=None):
        """并发执行所有搜索主题"""
        import concurrent.futures
        log.info(f"智能体爬虫启动，共 {len(SEARCH_MISSIONS)} 个主题，并发数: {max_workers}")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_mission = {executor.submit(self.run_mission, mission): mission for mission in SEARCH_MISSIONS}
            for future in concurrent.futures.as_completed(future_to_mission):
                mission = future_to_mission[future]
                try:
                    future.result()
                    if topic_done_callback:
                        topic_done_callback(mission, self.collected)
                except Exception as e:
                    log.error(f"主题 '{mission}' 执行异常: {e}")
        return self.collected

# ──── 写入后端 ────────────────────────────────────────────────────

def submit_to_backend(items: list[dict]) -> bool:
    if not items:
        log.info("无数据可提交")
        return True
    # 按 sourceUrl 去重
    seen, deduped = set(), []
    for it in items:
        url = it.get("sourceUrl", "")
        if url and url in seen:
            continue
        seen.add(url)
        deduped.append(it)
    log.info(f"去重后 {len(deduped)} 条，提交后端...")
    try:
        resp = requests.post(
            BACKEND_URL,
            json=deduped,
            headers={"Content-Type": "application/json",
                     "X-Crawler-Key": CRAWLER_KEY},
            timeout=60,
        )
        if resp.status_code == 200:
            r = resp.json()
            log.info(f"写入成功！新增: {r.get('imported')}，跳过: {r.get('skipped')}")
            return True
        else:
            log.error(f"后端返回错误: {resp.status_code} — {resp.text[:200]}")
    except Exception as e:
        log.error(f"无法连接后端: {e}")
    return False

# ──── 入口 ────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="智能体爬虫 — 安徽升学资讯")
    parser.add_argument("--llm-key", type=str, default="",
                        help="DeepSeek API Key（或设置 DEEPSEEK_API_KEY 环境变量）")
    parser.add_argument("--dry-run", action="store_true",
                        help="只运行智能体，不提交后端")
    parser.add_argument("--mission", type=str, default="",
                        help="只运行指定的单个主题（调试用）")
    args = parser.parse_args()

    llm_key = args.llm_key or os.environ.get("DEEPSEEK_API_KEY", "")
    if not llm_key:
        log.error("未提供 DeepSeek API Key！请用 --llm-key 或设置 DEEPSEEK_API_KEY 环境变量")
        sys.exit(1)

    agent = CrawlerAgent(llm_key)

    if args.mission:
        # 单主题调试
        agent.run_mission(args.mission)
    else:
        agent.run_all()

    log.info(f"\n{'='*55}")
    log.info(f"智能体完成，共采集 {len(agent.collected)} 条有效信息")

    if args.dry_run:
        log.info("--dry-run 模式，不提交后端。以下为采集内容预览：")
        for i, it in enumerate(agent.collected[:5], 1):
            log.info(f"  {i}. [{it.get('category')}] {it.get('title')[:60]}")
        if len(agent.collected) > 5:
            log.info(f"  ... 共 {len(agent.collected)} 条")
    else:
        submit_to_backend(agent.collected)

if __name__ == "__main__":
    main()
