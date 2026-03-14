import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, Home, Search, Trophy, FileText, GraduationCap, Building2,
    Users, Calendar, Clock, Bookmark, Share2, TrendingUp,
    AlertCircle, Sparkles, Filter, ChevronRight, ExternalLink,
    Presentation, Grid, Target, Cpu, Award, RefreshCw, MapPin, Wifi, WifiOff,
    ChevronLeft
} from 'lucide-react';
import { filterExamInfoItems, readExamInfoCache, writeExamInfoCache } from '../utils/examInfoCache';

const API_BASE = '/api';

const pathwayData = {
    strongBase: {
        title: '强基计划',
        milestones: [
            { date: '3月底-4月', event: '各校发布简章并开启报名' },
            { date: '6月7-8日', event: '参加全国统一高考' },
            { date: '6月中旬', event: '确认参加学校考核' },
            { date: '6月底-7月初', event: '学校考核、录取名单公示' }
        ],
        matchScore: 88,
        advice: '该生建议重点关注清北及复交的数理方向简章，结合信奥竞赛成绩冲刺强基计划。'
    },
    techSpecial: {
        tracks: [
            { name: '信奥专项 (C++)', level: '省级一等奖候选', target: '重点高中理科实验班' },
            { name: '机器人/创客', level: '国家级参赛经历', target: '高校综合评价招生' },
            { name: '科创发明', level: '获得专利保护', target: '自主招生/特长加分' }
        ],
        advice: '由于该生在逻辑思维雷达图表现极佳，建议在高三上学期冲刺信奥省级联赛。'
    }
};

// ──── Helpers ─────────────────────────────────────────────────────
function parseTags(tagsStr) {
    if (!tagsStr) return [];
    try { return JSON.parse(tagsStr); }
    catch { return tagsStr.split(',').map(t => t.trim()); }
}

function getCategoryColor(cat) {
    const m = {
        '竞赛': 'bg-purple-100 text-purple-700 border-purple-200',
        '考试': 'bg-blue-100 text-blue-700 border-blue-200',
        '升学': 'bg-green-100 text-green-700 border-green-200',
        '院校': 'bg-orange-100 text-orange-700 border-orange-200',
        '招生': 'bg-red-100 text-red-700 border-red-200',
        '资讯': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return m[cat] || 'bg-gray-100 text-gray-700 border-gray-200';
}

function getRegionColor(region) {
    const m = {
        '合肥': 'bg-emerald-100 text-emerald-700',
        '安徽': 'bg-teal-100 text-teal-700',
        '全国': 'bg-blue-100 text-blue-700',
    };
    return m[region] || 'bg-gray-100 text-gray-700';
}

function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ──── Main Component ───────────────────────────────────────────────
export default function ExamInfo() {
    const initialCache = readExamInfoCache();
    const [articles, setArticles] = useState(initialCache.items);
    const [loading, setLoading] = useState(true);
    const [backendOnline, setBackendOnline] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(initialCache.updatedAt ? new Date(initialCache.updatedAt) : null);
    const [hasCachedArticles, setHasCachedArticles] = useState(initialCache.items.length > 0);

    // 关键词搜索
    const [searchTerm, setSearchTerm] = useState('');

    // 分页
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const PAGE_SIZE = 20;

    const applyCachedArticles = useCallback((keyword = searchTerm) => {
        const cached = readExamInfoCache();
        const filtered = filterExamInfoItems(cached.items, keyword);
        setArticles(filtered);
        setTotalPages(1);
        setTotalElements(filtered.length);
        setHasCachedArticles(cached.items.length > 0);
        setLastUpdated(cached.updatedAt ? new Date(cached.updatedAt) : null);
    }, [searchTerm]);

    const fetchData = useCallback(async (page = currentPage) => {
        setLoading(true);
        const params = new URLSearchParams({ page, size: PAGE_SIZE });
        if (searchTerm) params.set('keyword', searchTerm);

        try {
            const resp = await fetch(`${API_BASE}/exam-info/page?${params}`,
                { signal: AbortSignal.timeout(5000) });
            if (!resp.ok) throw new Error('资讯接口请求失败');

            const data = await resp.json();
            if (!Array.isArray(data?.content)) {
                throw new Error('资讯接口返回格式异常');
            }

            const fetchedAt = new Date();
            setArticles(data.content);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
            setBackendOnline(true);
            setLastUpdated(fetchedAt);

            if (page === 0 && !searchTerm) {
                writeExamInfoCache(data.content, fetchedAt);
                setHasCachedArticles(data.content.length > 0);
            }
        } catch {
            setBackendOnline(false);
            applyCachedArticles(searchTerm);
        } finally {
            setLoading(false);
        }
    }, [applyCachedArticles, currentPage, searchTerm]);

    // 筛选条件变化时重置到第 0 页
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    useEffect(() => { fetchData(currentPage); }, [fetchData, currentPage]);

    const urgentItems = articles.filter(item => {
        if (!item.deadline) return false;
        const d = daysUntil(item.deadline);
        return d !== null && d >= 0 && d <= 30;
    }).slice(0, 4);

    const aiItems = articles.filter(item => item.aiRecommended).slice(0, 3);

    const handlePageChange = (newPage) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── 顶部导航 ── */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                                    <GraduationCap size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">升学政策咨询库</h1>
                            </div>

                            <div className="flex w-full lg:w-auto overflow-x-auto scrollbar-hide bg-gray-100 p-1 rounded-xl lg:ml-8 [&>*]:shrink-0">
                                <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-indigo-700 shadow-sm border border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </div>
                                <Link to="/exam-analysis" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} />信息分析
                                    </div>
                                </Link>
                                <Link to="/type-of-class" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Grid size={16} />班型分析
                                    </div>
                                </Link>
                                <Link to="/strong-base" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} />强基计划
                                    </div>
                                </Link>
                                <Link to="/tech-specialty" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={16} />科技特长生
                                    </div>
                                </Link>
                                <Link to="/whitelist-competitions" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} />白名单赛事
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <Link to="/platform" className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                            <Home size={18} />
                            <span className="text-sm font-medium">返回平台</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── 状态栏 ── */}
            <div className={`px-4 sm:px-6 py-2 text-xs ${backendOnline ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-amber-50 border-b border-amber-100'}`}>
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-2 sm:items-center">
                        {backendOnline
                            ? <><Wifi size={12} className="text-emerald-600" /><span className="text-emerald-700">数据实时加载自后端 · 自动更新</span></>
                            : <><WifiOff size={12} className="text-amber-600" /><span className="text-amber-700">{hasCachedArticles ? '后端离线' : '后端离线，暂无可用缓存，请先连接后端加载资讯数据'}</span></>
                        }
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {lastUpdated && <span className="text-gray-400">最后更新: {lastUpdated.toLocaleTimeString('zh-CN')}</span>}
                        <button onClick={() => fetchData(currentPage)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />刷新
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
                    {/* ── 主内容区 ── */}
                    <div className="flex-1 min-w-0">
                        {/* 关键词搜索 */}
                        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
                            <div className="relative max-w-xl">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="输入关键词搜索资讯..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 结果统计 */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                            <p className="text-sm text-gray-500">
                                共 <span className="font-bold text-gray-900">{backendOnline ? totalElements : articles.length}</span> 条资讯
                            </p>
                            <div className="flex items-center gap-2">
                                {!backendOnline && (
                                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">{hasCachedArticles ? '缓存显示' : '暂无缓存数据'}</span>
                                )}
                                {backendOnline && totalPages > 1 && (
                                    <span className="text-xs text-gray-400">第 {currentPage + 1} / {totalPages} 页</span>
                                )}
                            </div>
                        </div>

                        {/* 文章列表 */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                                    </div>
                                ))}
                            </div>
                        ) : articles.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p>{backendOnline ? '暂无相关资讯' : '暂无已缓存资讯，请先连接后端加载数据'}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {articles.map((item, idx) => {
                                    const tags = parseTags(item.tags);
                                    const deadlineDays = daysUntil(item.deadline);
                                    return (
                                        <a key={item.id || idx}
                                            href={item.link && item.link !== '#' ? item.link : undefined}
                                            target={item.link && item.link !== '#' ? "_blank" : undefined}
                                            rel="noreferrer"
                                            className="block bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                                {/* 序号 */}
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                    {currentPage * PAGE_SIZE + idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {/* 标签行 */}
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getCategoryColor(item.category)}`}>
                                                            {item.category}
                                                        </span>
                                                        {item.region && (
                                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium flex items-center gap-1 ${getRegionColor(item.region)}`}>
                                                                <MapPin size={10} />{item.region}
                                                            </span>
                                                        )}
                                                        {item.school && (
                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1">
                                                                <Building2 size={10} />{item.school}
                                                            </span>
                                                        )}
                                                        {item.schoolLevel && (
                                                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-lg text-xs">
                                                                {item.schoolLevel}
                                                            </span>
                                                        )}
                                                        {item.aiRecommended && (
                                                            <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-xs font-medium">
                                                                <Sparkles size={10} />AI推荐
                                                            </span>
                                                        )}
                                                        {item.importance === 'high' && (
                                                            <AlertCircle size={14} className="text-red-500" />
                                                        )}
                                                    </div>

                                                    <h3 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-2 text-left group-hover:text-blue-700 transition-colors">
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mb-3 line-clamp-2 text-left leading-relaxed">
                                                        {item.summary || item.contentSummary}
                                                    </p>

                                                    {/* 标签 */}
                                                    {tags.length > 0 && (
                                                        <div className="flex gap-1.5 flex-wrap mb-3">
                                                            {tags.slice(0, 4).map(tag => (
                                                                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">#{tag}</span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* 底部元数据 */}
                                                    <div className="flex flex-col gap-3 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={12} />{item.date}
                                                            </span>
                                                            <span>{item.source}</span>
                                                            {item.deadline && deadlineDays !== null && deadlineDays >= 0 && (
                                                                <span className="flex items-center gap-1 text-red-600 font-semibold">
                                                                    <Clock size={12} />
                                                                    {deadlineDays === 0 ? '今日截止' : `${deadlineDays}天后截止`}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="收藏">
                                                                <Bookmark size={14} />
                                                            </button>
                                                            {item.link && item.link !== '#' && (
                                                                <div className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-gray-400 group-hover:text-blue-500" title="查看原文">
                                                                    <ExternalLink size={14} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── 分页导航 ── */}
                        {backendOnline && totalPages > 1 && !loading && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
                                    <ChevronLeft size={16} />上一页
                                </button>

                                {/* 页码按钮 */}
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 7) {
                                        pageNum = i;
                                    } else if (currentPage <= 3) {
                                        pageNum = i < 5 ? i : i === 5 ? '...' : totalPages - 1;
                                    } else if (currentPage >= totalPages - 4) {
                                        pageNum = i === 0 ? 0 : i === 1 ? '...' : totalPages - (7 - i);
                                    } else {
                                        const offset = [-3, -2, -1, 0, 1, 2, 3];
                                        const p = currentPage + offset[i];
                                        if (p < 0 || p >= totalPages) return null;
                                        pageNum = p;
                                    }
                                    if (pageNum === '...') {
                                        return <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>;
                                    }
                                    return (
                                        <button key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                                                }`}>
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
                                    下一页<ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── 右侧边栏 ── */}
                    <div className="w-full xl:w-72 xl:shrink-0 space-y-5">
                        {/* AI 推荐 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-purple-600" size={18} />
                                <h3 className="font-bold text-gray-900 text-sm">AI 智能推荐</h3>
                            </div>
                            <div className="space-y-2.5">
                                {aiItems.map((item, i) => {
                                    const hasLink = item.link && item.link !== '#';
                                    const cardClassName = 'block w-full text-left bg-white rounded-xl p-3 hover:shadow-sm transition-shadow cursor-pointer';

                                    if (hasLink) {
                                        return (
                                            <a
                                                key={item.id || i}
                                                href={item.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={cardClassName}
                                            >
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                        {item.category}
                                                    </span>
                                                    {item.region && (
                                                        <span className={`px-1.5 py-0.5 rounded text-xs ${getRegionColor(item.region)}`}>
                                                            {item.region}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</p>
                                                <p className="text-xs text-gray-400">{item.date}</p>
                                            </a>
                                        );
                                    }

                                    return (
                                        <button
                                            key={item.id || i}
                                            type="button"
                                            onClick={() => setSearchTerm(item.title)}
                                            className={cardClassName}
                                        >
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                                {item.region && (
                                                    <span className={`px-1.5 py-0.5 rounded text-xs ${getRegionColor(item.region)}`}>
                                                        {item.region}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</p>
                                            <p className="text-xs text-gray-400">{item.date}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 即将截止 */}
                        {urgentItems.length > 0 && (
                            <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle className="text-red-600" size={18} />
                                    <h3 className="font-bold text-gray-900 text-sm">即将截止</h3>
                                </div>
                                <div className="space-y-3">
                                    {urgentItems.map((item, i) => {
                                        const d = daysUntil(item.deadline);
                                        const hasLink = item.link && item.link !== '#';
                                        return (
                                            hasLink ? (
                                                <a
                                                    key={item.id || i}
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block border-l-4 border-red-500 pl-3 py-1.5 hover:bg-red-50/60 rounded-r-lg transition-colors"
                                                >
                                                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</p>
                                                    <p className="text-xs text-red-600 font-bold">
                                                        {d === 0 ? '今日截止' : `截止 ${item.deadline}（${d}天）`}
                                                    </p>
                                                </a>
                                            ) : (
                                                <button
                                                    key={item.id || i}
                                                    type="button"
                                                    onClick={() => setSearchTerm(item.title)}
                                                    className="block w-full text-left border-l-4 border-red-500 pl-3 py-1.5 hover:bg-red-50/60 rounded-r-lg transition-colors"
                                                >
                                                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</p>
                                                    <p className="text-xs text-red-600 font-bold">
                                                        {d === 0 ? '今日截止' : `截止 ${item.deadline}（${d}天）`}
                                                    </p>
                                                </button>
                                            )
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 强基计划专栏 */}
                        <Link to="/strong-base" className="block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-indigo-600 p-4 text-white">
                                <h4 className="font-bold text-sm mb-0.5">强基计划专栏</h4>
                                <p className="text-indigo-200 text-xs">39所顶尖大学基础学科试点</p>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-indigo-600 flex items-center justify-center font-bold text-indigo-600 text-sm bg-white shrink-0">
                                        {pathwayData.strongBase.matchScore}%
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-indigo-900">综合匹配指数</p>
                                        <p className="text-xs text-indigo-600">建议主攻数学/物理方向</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {pathwayData.strongBase.milestones.map((ms, i) => (
                                        <div key={i} className="flex gap-2 text-xs">
                                            <span className="text-indigo-500 font-bold shrink-0">{ms.date}</span>
                                            <span className="text-gray-500">{ms.event}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Link>

                        {/* 科技特长生专栏 */}
                        <Link to="/tech-specialty" className="block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-emerald-600 p-4 text-white">
                                <h4 className="font-bold text-sm mb-0.5">科技特长生专栏</h4>
                                <p className="text-emerald-200 text-xs">信奥/编程/创客专项计划</p>
                            </div>
                            <div className="p-4 space-y-2">
                                {pathwayData.techSpecial.tracks.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                                        <div>
                                            <p className="font-bold text-gray-800">{t.name}</p>
                                            <p className="text-emerald-600">{t.level}</p>
                                        </div>
                                        <p className="text-gray-400 text-right">{t.target}</p>
                                    </div>
                                ))}
                            </div>
                        </Link>

                        {/* 快速筛选标签 */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-3 text-sm">快速筛选</h3>
                            <div className="flex flex-wrap gap-2">
                                {['强基计划', '信息学', '安徽', '合肥', '特长生', '招生', 'NOI', 'CSP'].map(tag => (
                                    <button key={tag}
                                        onClick={() => setSearchTerm(tag)}
                                        className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 rounded-lg text-xs cursor-pointer transition-colors">
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
