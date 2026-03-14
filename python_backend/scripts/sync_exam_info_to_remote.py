import argparse
import math
import sqlite3
import sys
from pathlib import Path

import requests


def load_local_items(db_path: Path) -> list[dict]:
    query = """
        SELECT
            title,
            category,
            date,
            source,
            summary,
            link,
            source_url,
            region,
            importance,
            ai_recommended,
            tags,
            school,
            school_level,
            admission_year
        FROM exam_info
        ORDER BY id ASC
    """

    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(query).fetchall()

    items = []
    for row in rows:
        items.append(
            {
                "title": row["title"],
                "category": row["category"],
                "date": row["date"],
                "source": row["source"],
                "summary": row["summary"],
                "link": row["link"],
                "sourceUrl": row["source_url"],
                "region": row["region"],
                "importance": row["importance"],
                "aiRecommended": bool(row["ai_recommended"]) if row["ai_recommended"] is not None else False,
                "tags": row["tags"],
                "school": row["school"],
                "schoolLevel": row["school_level"],
                "admissionYear": row["admission_year"],
            }
        )
    return items


def chunked(items: list[dict], batch_size: int):
    for index in range(0, len(items), batch_size):
        yield index // batch_size + 1, items[index:index + batch_size]


def sync_items(items: list[dict], api_url: str, batch_size: int, timeout: int, verify_ssl: bool):
    session = requests.Session()
    total_imported = 0
    total_skipped = 0
    total_batches = max(1, math.ceil(len(items) / batch_size)) if items else 0

    for batch_no, batch in chunked(items, batch_size):
        response = session.post(api_url, json=batch, timeout=timeout, verify=verify_ssl)
        response.raise_for_status()
        payload = response.json()
        imported = int(payload.get("imported", 0))
        skipped = int(payload.get("skipped", len(batch) - imported))
        total_imported += imported
        total_skipped += skipped
        print(f"[{batch_no}/{total_batches}] imported={imported} skipped={skipped}")

    return total_imported, total_skipped


def main():
    parser = argparse.ArgumentParser(description="Sync local SQLite exam_info data to a remote backend API.")
    parser.add_argument(
        "--db",
        default=str(Path(__file__).resolve().parents[1] / "education.db"),
        help="Path to the local SQLite database file.",
    )
    parser.add_argument(
        "--api-url",
        required=True,
        help="Remote batch import endpoint, for example https://your-domain/api/exam-info/batch-import",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=200,
        help="Number of rows to send per request.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30,
        help="HTTP timeout in seconds for each batch.",
    )
    parser.add_argument(
        "--insecure",
        action="store_true",
        help="Skip SSL certificate verification for self-signed HTTPS endpoints.",
    )
    args = parser.parse_args()

    db_path = Path(args.db).resolve()
    if not db_path.exists():
        print(f"Database file not found: {db_path}", file=sys.stderr)
        sys.exit(1)

    items = load_local_items(db_path)
    if not items:
        print("No rows found in local exam_info table.")
        return

    print(f"Loaded {len(items)} local rows from {db_path}")
    imported, skipped = sync_items(
        items=items,
        api_url=args.api_url,
        batch_size=args.batch_size,
        timeout=args.timeout,
        verify_ssl=not args.insecure,
    )
    print(f"Done. imported={imported} skipped={skipped}")


if __name__ == "__main__":
    main()
