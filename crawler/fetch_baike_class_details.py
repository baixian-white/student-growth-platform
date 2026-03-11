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


def build_manual_items() -> list[dict]:
    # 人工补录权威信息：当用户明确提供官方实施办法原文时，直接纳入详情数据源。
    return [
        {
            "slug": "manual-hf1z-2025-guofangjiaoyu",
            "title": "国防教育班",
            "entryTitle": "合肥一中2025年国防教育班招生实施办法",
            "subtitle": "合肥一中瑶海校区国防教育班2025年招生实施办法",
            "summary": (
                "为贯彻落实教育部、中央军委训练管理部有关文件精神，合肥一中在陆军兵种大学支持下，"
                "于瑶海校区举办国防教育班。2025年国防教育班纳入市区普通高中提前批次招生，"
                "面向合肥市区招生50人。"
            ),
            "baseInfo": {
                "办班学校": "合肥一中（瑶海校区）",
                "支持单位": "陆军兵种大学（原中国人民解放军陆军炮兵防空兵学院）",
                "招生年度": "2025年",
                "招生计划": "市区提前批次，面向合肥市区招生50人",
                "报名时间": "6月17日-18日",
                "咨询电话": "62911001、62911025、62912070",
            },
            "policySections": [
                {
                    "title": "一、办班目标",
                    "paragraphs": [
                        "探索国防特色教育示范学校建设新模式，加强国防教育课程体系建设，创新学校国防教育有效形式，营造合肥一中国防教育的浓厚氛围。",
                        "为军队院校培养后备人才奠定基础，带动提高全市学校国防教育水平。",
                    ],
                },
                {
                    "title": "二、招生原则",
                    "paragraphs": [
                        "1.公开、公平、公正原则。",
                        "2.学校自主原则。",
                        "3.考生自愿原则。",
                        "4.择优录取原则。",
                    ],
                },
                {
                    "title": "三、招生计划",
                    "paragraphs": [
                        "2025年国防教育班纳入市区普通高中提前批次招生，面向合肥市区招生50人。",
                    ],
                },
                {
                    "title": "四、报名资格",
                    "paragraphs": [
                        "1.合肥市区报名参加2025年中考的应届初中毕业生。",
                        "2.遵守法纪法规和社会公德，全面发展，品行端正，素质优秀。",
                        "3.热爱军事，有报考军队院校的意愿。",
                        "4.身体健康，无传染性疾病、精神类疾病和器质性病变，具备良好的心理品质。体型匀称，无色盲、色弱、斜视。无口吃、纹身、刺字、残疾等。",
                        "5.中考体育考试成绩达57分及以上。",
                    ],
                },
                {
                    "title": "五、报名程序",
                    "paragraphs": [
                        "具备报名资格考生，于6月17-18日凭中考准考证到初中学校办理报名手续，逾期不再办理。",
                        "初中学校进行初审并推荐，通过初审的考生须填报国防教育班推荐表，推荐名单在校内公示不少于3天。",
                        "各报名点将国防教育班推荐表通过高拍仪拍照上传至中考网上报名系统。",
                    ],
                },
                {
                    "title": "六、志愿填报",
                    "paragraphs": [
                        "通过初审推荐的考生，可填报市区普通高中招生提前批次国防教育班志愿。",
                        "具备多种报考资格的考生，只能填报一个提前批次志愿，不得兼报，否则视为无效。",
                    ],
                },
                {
                    "title": "七、录取",
                    "paragraphs": [
                        "合肥市教育考试院按照招生计划数，依据考生志愿按初中学业水平考试成绩从高到低预录取50人。",
                        "总分相同依次按：综合素质评价等级、文化课考试等级、体育和理科实验操作等级、文化课考试总分、语文数学外语及外语口语总分排序。",
                        "取得预录取资格的考生须在规定时间和指定地点与合肥一中签订《入学协议书》，正式录取。如有缺额不再递补。",
                        "录取到国防教育班的考生，综合素质评价结果须达到普通高中录取要求，初中学业水平考试成绩须达到市区普通高中录取最低分数线。",
                    ],
                },
                {
                    "title": "八、工作保障",
                    "paragraphs": [
                        "1.组织领导：成立国防教育班招生工作领导小组和工作专班，严格执行招生程序，确保公正公平、公开透明。",
                        "2.课程设置：开设国家普通高中课程和国防教育课程。录取学生必须服从学校统一管理，按要求参加军事教育教学活动。国防教育班单独编班、学籍单独建立，不得转入本校普通班。",
                        "3.培养模式：由合肥一中和陆军兵种大学联合培养。普通高中课程由合肥一中教师实施，国防教育课程由陆军兵种大学教官实施。陆军兵种大学提供军事教学师资、课程、训练保障器材、训练服装，并配合开展国防教育相关活动。",
                        "招生相关信息以合肥一中校园网发布为准。",
                    ],
                },
            ],
            "source": {
                "name": "合肥一中2025年国防教育班招生实施办法",
                "url": "http://www.hfyz.net/xwgk/tzgg/294631.html",
                "api": None,
                "matchedQuery": "国防教育班",
                "scope": "manual",
                "lemmaId": None,
                "fetchedAt": datetime.now(timezone.utc).isoformat(),
                "matchScore": 100,
            },
        }
    ]


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
    crawled_items = []
    missing = []

    for title in titles:
        result = crawl_one_title(title)
        if result:
            crawled_items.append(result)
            print(f"[OK] {title} -> {result['source']['url']}")
        else:
            missing.append(title)
            print(f"[MISS] {title}")

    item_map = {item["title"]: item for item in crawled_items}
    for manual in build_manual_items():
        item_map[manual["title"]] = manual
        if manual["title"] in missing:
            missing.remove(manual["title"])

    ordered_items = [item_map[title] for title in titles if title in item_map]
    extra_items = [item for title, item in item_map.items() if title not in titles]
    items = ordered_items + extra_items

    index_by_title = {item["title"]: item["slug"] for item in items}

    payload = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceName": "百度百科开放接口 + 人工补录权威数据",
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
