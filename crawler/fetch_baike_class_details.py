import html
import json
import random
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

import requests


TYPE_OF_CLASS_FILE = Path("frontend/src/pages/TypeOfClass.jsx")
OUTPUT_FILE = Path("frontend/src/data/classTypeDetails.json")

API_TEMPLATE = (
    "https://baike.baidu.com/api/openapi/BaikeLemmaCardApi"
    "?scope={scope}&format=json&appid=379020&bk_key={query}&bk_length=1200"
)

# 对于班型词条，先试基础词，再试加学校上下文词。
SCHOOL_CONTEXTS = ["合肥", "合肥一中", "合肥九中"]

EDU_HINTS = ("班", "学校", "中学", "高中", "大学", "教育", "招生", "培养", "学生")
BAD_HINTS = ("网络用语", "歌曲", "电影", "电视剧", "动漫", "游戏")


def clean_html(raw: str) -> str:
    if not raw:
        return ""
    text = re.sub(r"<sup[^>]*>.*?</sup>", "", raw, flags=re.I | re.S)
    text = re.sub(r"<a[^>]*>", "", text, flags=re.I | re.S)
    text = text.replace("</a>", "")
    text = re.sub(r"<[^>]+>", "", text, flags=re.I | re.S)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def get_class_titles() -> list[str]:
    text = TYPE_OF_CLASS_FILE.read_text(encoding="utf-8")
    titles = re.findall(r"title:\s*'([^']+)'", text)
    unique = []
    for title in titles:
        if title not in unique:
            unique.append(title)
    return unique


def build_queries(title: str) -> list[str]:
    variants = [title]
    variants.extend([f"{ctx}{title}" for ctx in SCHOOL_CONTEXTS])
    seen = set()
    ordered = []
    for query in variants:
        if query not in seen:
            seen.add(query)
            ordered.append(query)
    return ordered


def fetch_payload(query: str, scope: int) -> dict:
    api_url = API_TEMPLATE.format(scope=scope, query=quote(query))
    response = requests.get(api_url, timeout=12)
    response.raise_for_status()
    payload = response.json()
    payload["_apiUrl"] = api_url
    return payload


def score_payload(target_title: str, query: str, payload: dict) -> int:
    if payload.get("errno"):
        return -1000

    entry_title = clean_html(payload.get("title", "") or "")
    entry_key = clean_html(payload.get("key", "") or "")
    desc = clean_html(payload.get("desc", "") or "")
    summary = clean_html(payload.get("abstract", "") or "")
    merged = " ".join([entry_title, entry_key, desc, summary])

    if not merged:
        return -900

    # 基础对应性：词条标题/关键字里至少要有该班型名称
    if target_title not in (entry_title + entry_key + merged):
        return -700

    if any(bad in merged for bad in BAD_HINTS):
        return -500

    if len(summary) < 30 and len(desc) < 12:
        return -400

    score = 0
    if entry_title == target_title or entry_key == target_title:
        score += 35
    elif target_title in entry_title or target_title in entry_key:
        score += 25
    else:
        score += 10

    if any(hint in merged for hint in EDU_HINTS):
        score += 15

    if "合肥" in merged:
        score += 20

    if payload.get("card"):
        score += 10

    if query != target_title:
        score -= 2

    return score


def normalize_payload(target_title: str, query: str, scope: int, payload: dict, score: int) -> dict:
    entry_title = clean_html(payload.get("title", "") or target_title)
    entry_key = clean_html(payload.get("key", "") or target_title)
    summary = clean_html(payload.get("abstract", "") or "")
    subtitle = clean_html(payload.get("desc", "") or "")

    base_info = {}
    for item in payload.get("card", []):
        name = item.get("name")
        value = clean_html(" ".join(item.get("value", [])))
        if name and value:
            base_info[name] = value

    lemma_id = payload.get("newLemmaId")
    source_title = entry_key or entry_title or target_title
    source_url = (
        f"https://baike.baidu.com/item/{quote(source_title)}/{lemma_id}"
        if lemma_id
        else f"https://baike.baidu.com/item/{quote(source_title)}"
    )

    return {
        "slug": f"lemma-{lemma_id}" if lemma_id else f"title-{quote(target_title)}",
        "title": target_title,
        "entryTitle": entry_title,
        "subtitle": subtitle,
        "summary": summary,
        "baseInfo": base_info,
        "source": {
            "name": f"百度百科：{source_title}",
            "url": source_url,
            "api": payload.get("_apiUrl"),
            "matchedQuery": query,
            "scope": scope,
            "lemmaId": lemma_id,
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
            "matchScore": score,
        },
    }


def crawl_one_title(title: str) -> dict | None:
    best_payload = None
    best_meta = None
    best_score = -1000

    for query in build_queries(title):
        for scope in (2, 103):
            # 每个 query/scope 尝试 2 次，降低接口抖动导致的漏抓
            for _ in range(2):
                try:
                    payload = fetch_payload(query, scope)
                except Exception:
                    continue

                score = score_payload(title, query, payload)
                if score > best_score:
                    best_score = score
                    best_payload = payload
                    best_meta = (query, scope)

                # 分数足够高就直接收敛，避免无意义请求
                if score >= 70:
                    break
                time.sleep(0.08 + random.random() * 0.08)

            if best_score >= 70:
                break
        if best_score >= 70:
            break

    # 只保留“有明确文本”的真实条目；分数偏低或空结果不展示
    if not best_payload or not best_meta or best_score < 50:
        return None

    query, scope = best_meta
    return normalize_payload(title, query, scope, best_payload, best_score)


def main() -> None:
    titles = get_class_titles()
    items = []
    missing = []

    for title in titles:
        result = crawl_one_title(title)
        if result:
            items.append(result)
            print(f"[OK] {title} -> {result['source']['url']}")
        else:
            missing.append(title)
            print(f"[MISS] {title}")

    index_by_title = {item["title"]: item["slug"] for item in items}

    payload = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceName": "百度百科开放接口",
        "items": items,
        "indexByTitle": index_by_title,
        "missingTitles": missing,
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nSaved {len(items)} items to: {OUTPUT_FILE}")
    if missing:
        print(f"Missing ({len(missing)}): {', '.join(missing)}")


if __name__ == "__main__":
    main()
