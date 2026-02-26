import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, ExternalLink, Calendar, Award, BookOpen, Rss, Search, TrendingUp,
    Target, Cpu, Sparkles, Trophy, Code2, Globe, Shield, Zap,
    GraduationCap, Flame, ArrowUpRight, SortDesc, SortAsc, X
} from 'lucide-react';
import informaticsData from '../data/informaticsData.json';

const INTRO_STATS = [
    { label: 'CSP 参赛人数', value: '30万+', icon: <GraduationCap size={22} />, color: 'text-indigo-200' },
    { label: 'NOIP 省级选拔', value: '31 省市', icon: <Globe size={22} />, color: 'text-blue-200' },
    { label: '清北强基认可', value: '100%', icon: <Trophy size={22} />, color: 'text-amber-200' },
    { label: '含金量权威排名', value: 'T0 殿堂', icon: <Flame size={22} />, color: 'text-rose-200' },
];

const COURSE_ROADMAP = [
    { stage: 'CSP-J 普及组', desc: '入门级认证，考察基础算法与数据结构。省一等奖是顶尖初中的起步门槛。', color: 'bg-sky-100 text-sky-700', badge: '必打基础' },
    { stage: 'CSP-S 提高组', desc: '进阶级认证，考察复杂算法。省一等奖可直接被顶尖高中提前签约锁定。', color: 'bg-indigo-100 text-indigo-700', badge: '硬核敲门砖' },
    { stage: 'NOIP 全国联赛', desc: '各省选拔赛，省队资格是参加全国决赛 NOI 的唯一渠道，含金量 T0。', color: 'bg-purple-100 text-purple-700', badge: '省级精英' },
    { stage: 'NOI 全国竞赛', desc: '最高级别赛事，全国百强金/银/铜牌是清北+港校直通敲门砖，无可替代。', color: 'bg-rose-100 text-rose-700', badge: '顶级殿堂' },
];

const themeMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400', pill: 'bg-blue-100 text-blue-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400', pill: 'bg-amber-100 text-amber-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400', pill: 'bg-emerald-100 text-emerald-700' },
};

export default function InformaticsOlympiad() {
    const { provincialDynamics, awardWinners, consulting } = informaticsData;
    const [activeTab, setActiveTab] = useState('provincial');
    const [query, setQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' newest first, 'asc' oldest first

    const tabs = [
        { id: 'provincial', label: '各省动态', icon: <Rss size={16} />, count: provincialDynamics.length, theme: 'blue' },
        { id: 'winners', label: '获奖名单', icon: <Award size={16} />, count: awardWinners.length, theme: 'amber' },
        { id: 'consulting', label: '信奥资讯', icon: <BookOpen size={16} />, count: consulting.length, theme: 'emerald' },
    ];

    const baseData = useMemo(() => {
        if (activeTab === 'provincial') return provincialDynamics;
        if (activeTab === 'winners') return awardWinners;
        return consulting;
    }, [activeTab]);

    const displayItems = useMemo(() => {
        let items = [...baseData];
        // Keyword filter
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            items = items.filter(item => item.title.toLowerCase().includes(q));
        }
        // Sort by date
        items.sort((a, b) => {
            const da = a.date || '0000-00-00';
            const db = b.date || '0000-00-00';
            return sortOrder === 'desc' ? db.localeCompare(da) : da.localeCompare(db);
        });
        return items;
    }, [baseData, query, sortOrder]);

    const activeSchema = tabs.find(t => t.id === activeTab);
    const cTheme = themeMap[activeSchema.theme];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans">
            {/* 顶部导航栏 */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
                                    <Sparkles size={20} />
                                </div>
                                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">信息学奥赛平台</h1>
                            </div>
                            <div className="ml-8 hidden lg:flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 shadow-inner">
                                <Link to="/exam-info" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2"><Search size={16} />信息查询</div>
                                </Link>
                                <Link to="/exam-analysis" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2"><TrendingUp size={16} />信息分析</div>
                                </Link>
                                <Link to="/strong-base" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2"><Target size={16} />强基计划</div>
                                </Link>
                                <Link to="/tech-specialty" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2"><Cpu size={16} />科技特长生</div>
                                </Link>
                                <Link to="/whitelist-competitions" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-indigo-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2"><Award size={16} />白名单赛事</div>
                                </Link>
                                <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-indigo-600 shadow-sm border border-slate-200 transition-all">
                                    <div className="flex items-center gap-2"><BookOpen size={16} />信息学奥赛</div>
                                </div>
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-transparent rounded-xl transition-all text-slate-600 hover:text-slate-900 flex-shrink-0 group shadow-sm">
                            <Home size={18} className="group-hover:text-indigo-600 transition-colors" />
                            <span className="text-sm font-medium">首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

                {/* ===== Hero 区 ===== */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-10 md:p-14 shadow-2xl text-white">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "32px 32px" }}></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6 backdrop-blur-sm">
                            <Zap size={14} className="text-yellow-300" /> NOI 全景数据平台 | 实时更新
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
                            全国信息学奥赛<br className="hidden md:block" />权威数据情报站
                        </h2>
                        <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl mb-10 font-medium">
                            收录各省选拔动态 · 历年获奖白名单 · 竞赛规则全解析。信奥是升学含金量最高的科创赛道，一枚省奖 = 顶尖高中签约保障。
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {INTRO_STATS.map((s, i) => (
                                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-3">
                                    <div className={s.color}>{s.icon}</div>
                                    <div className="text-3xl font-extrabold text-white">{s.value}</div>
                                    <div className="text-sm text-indigo-100 font-medium">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== 赛制路线图 ===== */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <Shield size={22} className="text-indigo-500" />
                        <h2 className="text-2xl font-extrabold text-slate-900">信奥赛制路线图</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {COURSE_ROADMAP.map((step, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold text-slate-400">STEP {String(i + 1).padStart(2, '0')}</span>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${step.color}`}>{step.badge}</span>
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 mb-3">{step.stage}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== 资讯横条列表区 ===== */}
                <div>
                    {/* 标题 + 标签栏 */}
                    <div className="flex items-center gap-4 mb-5 flex-wrap">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Code2 size={22} className="text-indigo-500 flex-shrink-0" />
                            <h2 className="text-2xl font-extrabold text-slate-900">竞赛情报中心</h2>
                        </div>
                        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 gap-1 flex-wrap">
                            {tabs.map(tab => {
                                const isActive = activeTab === tab.id;
                                const tColor = themeMap[tab.theme];
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setQuery(''); }}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 whitespace-nowrap outline-none ${isActive ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                    >
                                        <span className={isActive ? tColor.text : 'text-slate-400'}>{tab.icon}</span>
                                        {tab.label}
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? tColor.pill : 'bg-slate-200/60 text-slate-400'}`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 搜索 + 排序栏 */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="relative flex-1 min-w-48">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder={`搜索${activeSchema.label}标题关键词…`}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all shadow-sm"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm whitespace-nowrap"
                        >
                            {sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
                            {sortOrder === 'desc' ? '最新在前' : '最早在前'}
                        </button>
                        {query && (
                            <div className="flex items-center px-3 py-2 text-sm text-slate-500 bg-slate-100 rounded-xl">
                                找到 <span className="font-bold text-indigo-600 mx-1">{displayItems.length}</span> 条结果
                            </div>
                        )}
                    </div>

                    {/* 横条列表 */}
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
                        {displayItems.length === 0 && (
                            <div className="text-center py-16 text-slate-400 text-sm">
                                {query ? `未找到包含「${query}」的结果` : '该分类下暂无数据'}
                            </div>
                        )}
                        {displayItems.map((item, idx) => {
                            const isInternalRoute = activeTab === 'provincial' || activeTab === 'consulting';
                            const routePrefix = activeTab === 'provincial' ? 'provincial' : 'consulting';
                            // Find original index in source array for routing
                            const baseArr = activeTab === 'provincial' ? provincialDynamics : activeTab === 'winners' ? awardWinners : consulting;
                            const origIdx = baseArr.findIndex(x => x.url === item.url);

                            const RowContent = () => (
                                <>
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        <span className={`flex-shrink-0 w-2 h-2 rounded-full ${cTheme.dot}`}></span>
                                        <p className="flex-1 min-w-0 text-slate-800 font-semibold text-sm md:text-base leading-snug truncate group-hover:text-indigo-700 transition-colors">
                                            {item.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        {item.date ? (
                                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                                <Calendar size={13} />{item.date}
                                            </div>
                                        ) : (
                                            <span className="hidden sm:block text-xs text-slate-300">—</span>
                                        )}
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cTheme.pill}`}>
                                            {activeSchema.label}
                                        </span>
                                        <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                                            <ArrowUpRight size={18} />
                                        </span>
                                    </div>
                                </>
                            );

                            const rowClasses = "group flex items-center justify-between gap-6 px-6 py-4 hover:bg-indigo-50/50 transition-colors duration-150 cursor-pointer";

                            return isInternalRoute ? (
                                <Link key={idx} to={`/informatics-article/${routePrefix}/${origIdx}`} className={rowClasses}>
                                    <RowContent />
                                </Link>
                            ) : (
                                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className={rowClasses}>
                                    <RowContent />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* ===== 底部资源卡 ===== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { href: 'https://www.noi.cn/', label: 'NOI 官网', sub: '全国青少年信息学奥林匹克', icon: <Globe size={24} />, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 group-hover:text-indigo-700', border: 'hover:border-indigo-200', ext: 'group-hover:text-indigo-400' },
                        { href: 'https://www.cspro.org/', label: 'CSP 认证官网', sub: 'CCF 软件能力认证报名入口', icon: <Code2 size={24} />, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100 group-hover:text-blue-700', border: 'hover:border-blue-200', ext: 'group-hover:text-blue-400' },
                        { href: 'https://www.ccf.org.cn/', label: 'CCF 中国计算机学会', sub: '竞赛主办机构官网', icon: <Trophy size={24} />, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 group-hover:text-amber-700', border: 'hover:border-amber-200', ext: 'group-hover:text-amber-400' },
                    ].map((r, i) => (
                        <a key={i} href={r.href} target="_blank" rel="noopener noreferrer" className={`group bg-white border border-slate-200 ${r.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 flex items-center gap-5`}>
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors ${r.color}`}>{r.icon}</div>
                            <div>
                                <div className="font-bold text-slate-900 transition-colors">{r.label}</div>
                                <div className="text-sm text-slate-400 mt-1">{r.sub}</div>
                            </div>
                            <ExternalLink size={16} className={`ml-auto text-slate-300 transition-colors flex-shrink-0 ${r.ext}`} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
