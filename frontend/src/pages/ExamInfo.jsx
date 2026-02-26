import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, Home, Search, Trophy, FileText, GraduationCap, Building2,
    Users, Calendar, Clock, Bookmark, Share2, TrendingUp,
    AlertCircle, Sparkles, Filter, ChevronRight, ExternalLink,
    Presentation, Grid, Target, Cpu, Award, RefreshCw, MapPin, Wifi, WifiOff
} from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

// ──── Fallback data while backend is loading or unavailable ─────────
const FALLBACK_DATA = [
    {
        id: 'f1', title: 'NOIP 2025 安徽省获奖名单公布：安师大附中再登榜首',
        category: '竞赛', date: '2025-12-15', source: 'NOI官网',
        summary: '安师大附中共33名学生获奖，包括17名一等奖，连续第十七年蝉联省内信息学第一。',
        tags: '["NOI","信息学","安徽"]', importance: 'high', aiRecommended: true,
        link: 'https://www.noi.cn', region: '安徽'
    },
    {
        id: 'f2', title: 'CSP-J/S 2025 安徽省第二轮认证考点公布',
        category: '竞赛', date: '2025-11-01', source: 'NOI官网',
        summary: '第二轮认证于11月1日举行，考点分布合肥一中、合肥八中、芜湖一中、蚌埠二中四处。',
        tags: '["CSP","信息学","安徽"]', importance: 'high', aiRecommended: true,
        link: 'https://www.noi.cn', region: '安徽'
    },
    {
        id: 'f3', title: '合肥市2025年中考科技特长生录取分数线汇总',
        category: '招生', date: '2025-07-12', source: '合肥市教育局',
        summary: '合肥一中信息学方向降分约18-22分，合肥一六八NOIP三等奖即可报名审核。',
        tags: '["科技特长生","合肥","招生"]', importance: 'high', aiRecommended: true,
        link: '#', region: '合肥'
    },
    {
        id: 'f4', title: '强基计划2026年招生政策解读',
        category: '升学', date: '2026-02-05', source: '阳光高考平台',
        summary: '39所双一流高校继续实施强基计划，重点选拔培养基础学科拔尖且综合素质优秀的学生。',
        tags: '["强基计划","招生政策","双一流"]', importance: 'high', aiRecommended: true,
        link: '#', region: '全国'
    },
    {
        id: 'f5', title: 'NOI 2025 安徽省队选拔：3月在芜湖安师大附中举行',
        category: '竞赛', date: '2025-03-02', source: '安师大附中',
        summary: '省队选拔为两场各4.5小时笔试，综合得分=NOIP2024×30%+省选×70%，前5名入省队A队。',
        tags: '["NOI","省队","安徽"]', importance: 'high', aiRecommended: true,
        link: '#', region: '安徽'
    },
    {
        id: 'f6', title: '合肥四中、七中发布2025年信息学特长生招生简章',
        category: '招生', date: '2025-06-10', source: '学校官网',
        summary: '合肥四中录取线降12-18分，合肥七中计划招收信息学特长生2名，门槛为省级二等奖。',
        tags: '["科技特长生","合肥","招生简章"]', importance: 'medium', aiRecommended: false,
        link: '#', region: '合肥'
    },
];

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
        advice: '由于该生在逻辑思维雷达图表现极佳，建议在高三上学期冲刺信奥省级联赛，作为名校敲门砖。'
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
    const [articles, setArticles] = useState(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [backendOnline, setBackendOnline] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [activeCategory, setActiveCategory] = useState('全部');
    const [activeRegion, setActiveRegion] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['全部', '竞赛', '招生', '升学', '考试', '资讯'];
    const regions = ['全部', '合肥', '安徽', '全国'];

    const fetchData = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== '全部') params.set('category', activeCategory);
        if (activeRegion && activeRegion !== '全部') params.set('region', activeRegion);
        if (searchTerm) params.set('keyword', searchTerm);

        try {
            const resp = await fetch(`${API_BASE}/exam-info?${params}`, { signal: AbortSignal.timeout(4000) });
            if (resp.ok) {
                const data = await resp.json();
                if (data.length > 0) {
                    setArticles(data);
                    setBackendOnline(true);
                    setLastUpdated(new Date());
                } else {
                    setArticles(FALLBACK_DATA);
                    setBackendOnline(true);
                }
            }
        } catch {
            setBackendOnline(false);
            // Filter fallback data locally
            const filtered = FALLBACK_DATA.filter(item => {
                const matchCat = activeCategory === '全部' || item.category === activeCategory;
                const matchReg = activeRegion === '全部' || item.region === activeRegion;
                const matchSearch = !searchTerm || item.title.includes(searchTerm) || item.summary.includes(searchTerm);
                return matchCat && matchReg && matchSearch;
            });
            setArticles(filtered.length ? filtered : FALLBACK_DATA);
        } finally {
            setLoading(false);
        }
    }, [activeCategory, activeRegion, searchTerm]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const urgentItems = articles.filter(item => {
        if (!item.deadline) return false;
        const d = daysUntil(item.deadline);
        return d !== null && d >= 0 && d <= 30;
    }).slice(0, 4);

    const aiItems = articles.filter(item => item.aiRecommended).slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── 顶部导航 ── */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                                    <GraduationCap size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">升学信息查询</h1>
                            </div>
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="搜索竞赛、招生、升学资讯..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                            <div className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-indigo-700 shadow-sm border border-gray-200 flex items-center gap-1.5">
                                <Search size={14} />信息查询
                            </div>
                            <Link to="/exam-analysis" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all flex items-center gap-1.5">
                                <TrendingUp size={14} />信息分析
                            </Link>
                            <Link to="/strong-base" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all flex items-center gap-1.5">
                                <Target size={14} />强基计划
                            </Link>
                            <Link to="/tech-specialty" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all flex items-center gap-1.5">
                                <Cpu size={14} />科技特长生
                            </Link>
                            <Link to="/informatics-olympiad" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all flex items-center gap-1.5">
                                <BookOpen size={14} />信息学奥赛
                            </Link>
                            <Link to="/whitelist-competitions" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all flex items-center gap-1.5">
                                <Award size={14} />白名单赛事
                            </Link>
                        </div>

                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 shrink-0">
                            <Home size={18} />
                            <span className="text-sm font-medium">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── 状态栏 ── */}
            <div className={`px-6 py-2 flex items-center justify-between text-xs ${backendOnline ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-amber-50 border-b border-amber-100'}`}>
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {backendOnline
                            ? <><Wifi size={12} className="text-emerald-600" /><span className="text-emerald-700">数据实时加载自后端 · 定时爬虫每日自动更新</span></>
                            : <><WifiOff size={12} className="text-amber-600" /><span className="text-amber-700">后端离线，显示本地缓存数据。请启动 Spring Boot 后端（端口 8080）</span></>
                        }
                    </div>
                    <div className="flex items-center gap-3">
                        {lastUpdated && <span className="text-gray-400">最后更新: {lastUpdated.toLocaleTimeString('zh-CN')}</span>}
                        <button onClick={fetchData} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />刷新
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* ── 主内容区 ── */}
                    <div className="flex-1 min-w-0">
                        {/* 筛选栏 */}
                        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-2 font-medium">类别</p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {categories.map(cat => (
                                            <button key={cat} onClick={() => setActiveCategory(cat)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-l border-gray-100 pl-4">
                                    <p className="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1"><MapPin size={11} />地区</p>
                                    <div className="flex gap-1.5">
                                        {regions.map(r => (
                                            <button key={r} onClick={() => setActiveRegion(r)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${activeRegion === r ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 结果统计 */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">
                                共 <span className="font-bold text-gray-900">{articles.length}</span> 条资讯
                                {activeRegion !== '全部' && <span className="ml-1 text-emerald-600">（{activeRegion}地区）</span>}
                                {activeCategory !== '全部' && <span className="ml-1 text-blue-600">（{activeCategory}类）</span>}
                            </p>
                            {!backendOnline && (
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">显示本地数据</span>
                            )}
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
                                <p>暂无相关资讯</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {articles.map((item, idx) => {
                                    const tags = parseTags(item.tags);
                                    const deadlineDays = daysUntil(item.deadline);
                                    return (
                                        <div key={item.id || idx}
                                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                                            <div className="flex items-start gap-4">
                                                {/* 序号 */}
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                    {idx + 1}
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
                                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                                        <div className="flex items-center gap-3">
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
                                                                <a href={item.link} target="_blank" rel="noreferrer"
                                                                    className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors" title="查看原文">
                                                                    <ExternalLink size={14} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── 右侧边栏 ── */}
                    <div className="w-72 shrink-0 space-y-5">
                        {/* AI 推荐 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-purple-600" size={18} />
                                <h3 className="font-bold text-gray-900 text-sm">AI 智能推荐</h3>
                            </div>
                            <div className="space-y-2.5">
                                {aiItems.map((item, i) => (
                                    <div key={item.id || i} className="bg-white rounded-xl p-3 hover:shadow-sm transition-shadow cursor-pointer">
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
                                    </div>
                                ))}
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
                                        return (
                                            <div key={item.id || i} className="border-l-4 border-red-500 pl-3 py-1.5">
                                                <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</p>
                                                <p className="text-xs text-red-600 font-bold">
                                                    {d === 0 ? '今日截止' : `截止 ${item.deadline}（${d}天）`}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 强基计划专栏 */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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
                        </div>

                        {/* 科技特长生专栏 */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
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
                        </div>

                        {/* 热门标签 */}
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
