const EXAM_INFO_CACHE_KEY = 'student-growth-platform.exam-info.first-page';
const EXAM_INFO_CACHE_LIMIT = 20;

export function readExamInfoCache() {
    if (typeof window === 'undefined') {
        return { items: [], updatedAt: null };
    }

    try {
        const raw = window.localStorage.getItem(EXAM_INFO_CACHE_KEY);
        if (!raw) {
            return { items: [], updatedAt: null };
        }

        const parsed = JSON.parse(raw);
        const items = Array.isArray(parsed?.items) ? parsed.items : [];
        const updatedAt = typeof parsed?.updatedAt === 'string' ? parsed.updatedAt : null;

        return { items, updatedAt };
    } catch {
        return { items: [], updatedAt: null };
    }
}

export function writeExamInfoCache(items, updatedAt = new Date()) {
    if (typeof window === 'undefined') {
        return;
    }

    const normalizedItems = Array.isArray(items)
        ? items.slice(0, EXAM_INFO_CACHE_LIMIT)
        : [];

    try {
        window.localStorage.setItem(
            EXAM_INFO_CACHE_KEY,
            JSON.stringify({
                items: normalizedItems,
                updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
            })
        );
    } catch {
        // Ignore storage write errors and keep the page usable.
    }
}

export function filterExamInfoItems(items, keyword = '', category = '全部') {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return (Array.isArray(items) ? items : []).filter((item) => {
        const matchCategory = category === '全部' || !category || item.category === category;
        const searchableText = [
            item.title,
            item.summary,
            item.source,
            item.category,
            item.region,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        const matchKeyword = !normalizedKeyword || searchableText.includes(normalizedKeyword);
        return matchCategory && matchKeyword;
    });
}
