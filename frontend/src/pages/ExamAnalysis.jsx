import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, Search, TrendingUp, Target, Cpu, BookOpen, Award,
    BrainCircuit, Activity, Database, Sparkles, Navigation,
    ChevronRight, ExternalLink, Zap, BarChart2, PieChart as PieChartIcon, Lightbulb,
    Radar as RadarIcon, ScrollText
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// --- 数据模拟 (Mock Big Data) ---

// 面板综合分数
const AIGlobalScore = 88;
const coreTags = ["数据结构天赋", "物理直觉强", "越级赛事抗压"];

// 目标院校/高中引力雷达图数据
const radarData = [
    { subject: '逻辑推理', student: 95, targetMaster: 90, targetNormal: 80 },
    { subject: '数学推导', student: 92, targetMaster: 95, targetNormal: 85 },
    { subject: '算法代码', student: 88, targetMaster: 85, targetNormal: 70 },
    { subject: '自然科学', student: 85, targetMaster: 90, targetNormal: 80 },
    { subject: '人文素养', student: 75, targetMaster: 85, targetNormal: 80 },
    { subject: '英语思维', student: 82, targetMaster: 85, targetNormal: 75 },
];

// 升学路径时序趋势 (纵轴: 录取/成功人次或率)
const pathwaysTrend = [
    { year: '2021', 统招独木桥: 85, 强基计划: 10, 科技特长生: 5 },
    { year: '2022', 统招独木桥: 82, 强基计划: 12, 科技特长生: 6 },
    { year: '2023', 统招独木桥: 78, 强基计划: 15, 科技特长生: 7 },
    { year: '2024', 统招独木桥: 72, 强基计划: 20, 科技特长生: 8 },
    { year: '2025(预)', 统招独木桥: 65, 强基计划: 25, 科技特长生: 10 },
];

// 概率分布图 (学生全省大盘占位站位概率模拟)
const distributionData = [
    { range: 'Top 1% (清北复交)', probability: 15 },
    { range: 'Top 5% (顶级全能)', probability: 45 },
    { range: 'Top 15% (重点一本)', probability: 30 },
    { range: 'Top 30% (普本及以上)', probability: 8 },
    { range: '其他', probability: 2 },
];
const COLORS = ['#8b5cf6', '#6366f1', '#0ea5e9', '#10b981', '#94a3b8'];

// 各阶段 AI 时间轴及证据树
const stageIntelligence = {
    '小升初': {
        summary: '挖掘信奥潜质，抢占初中理科实验班入口',
        timeline: [
            { time: '当前学期', title: '少儿编程向C++信息学规范过渡', type: 'learning' },
            { time: '五年级暑假', title: '参加本地CSP-J/S入门组集训', type: 'action' },
            { time: '六年级上', title: '冲刺白名单赛事省级一等奖', type: 'action' },
        ],
        evidence: [
            { source: '2024合肥教育局', detail: '多所初中名校保留信息学特长生直升通道' },
            { source: '历年录取大盘', detail: '90% 信奥省一选手最终去向为市重点头部高中' }
        ]
    },
    '初升高': {
        summary: '稳固总分基本盘，借力“科技特长生”政策降分红利',
        timeline: [
            { time: '初二下学期', title: '突破CSP-J拿一等奖，奠定特长生白名单资格', type: 'action' },
            { time: '初三上学期', title: '参加 NOI 省级选拔（弱省有机会直接进队）', type: 'action' },
            { time: '初三下学期', title: '锁定合肥一中/一六八科技特长生降分协议', type: 'goal' },
        ],
        evidence: [
            { source: '一中特长招生简章', detail: 'CSP-J/S 一等奖或省赛前50名，中考降分幅度达15-25分' },
            { source: '大数据挖掘', detail: '对比裸分统考，走特长生路径被一中录取的胜率提升 340%' }
        ]
    },
    '高升大': {
        summary: '精准狙击“强基计划”与综合评价，破局高考内卷',
        timeline: [
            { time: '高一/高二', title: '冲刺信奥省一/国铜，作为顶尖名校强基敲门砖', type: 'action' },
            { time: '高三3月', title: '密集研究并报名清北复交/中科大强基简章', type: 'learning' },
            { time: '高三校考', title: '应对强基计划笔试（难度对标竞赛）', type: 'goal' },
        ],
        evidence: [
            { source: '阳光高考平台', detail: '39所双一流高校破格入围条件，奥赛银牌及以上有巨大优势' },
            { source: '校友去向追踪', detail: '具备算法竞赛经历的学生，被中科大少班/强基录取比例极高' }
        ]
    }
};

export default function ExamAnalysis() {
    const [activeStage, setActiveStage] = useState('初升高');
    const [processingCount, setProcessingCount] = useState(0);

    // 模拟数据加载
    useEffect(() => {
        const timer = setInterval(() => {
            setProcessingCount(prev => prev >= 15342 ? 15342 : prev + 319);
        }, 50);
        return () => clearInterval(timer);
    }, []);

    const currentInt = stageIntelligence[activeStage];

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            {/* 顶栏保持一致化 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
                                    <BrainCircuit size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">AI 升学规划</h1>
                            </div>
                            {/* 系统内导航切换 */}
                            <div className="ml-8 flex bg-gray-100 p-1 rounded-xl">
                                <Link to="/exam-info" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </Link>
                                <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-indigo-700 shadow-sm border border-gray-200 transition-all flex items-center gap-2">
                                    <BrainCircuit size={16} />AI 规划
                                </div>
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
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-medium">
                            <Home size={18} />
                            <span className="text-sm">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* 1. Header: AI Brain Command Center */}
                <div className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-sm border border-indigo-100 mb-8 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/50 backdrop-blur-xl">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-400 opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 p-24 bg-purple-400 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

                    {/* Left: AI Processing Status */}
                    <div className="flex-1 space-y-5 relative z-10 w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                            <Activity size={14} className="animate-pulse" />
                            AI 升学大模型引擎活跃中
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 font-serif tracking-tight">
                            基于海量招考数据的<br />专属 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">全局战斗蓝图</span>
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm w-fit">
                                <Database size={16} className="text-indigo-500" />
                                正在分析历史录取库:
                                <span className="text-indigo-700 font-bold tabular-nums">
                                    {processingCount.toLocaleString()} 条档案
                                </span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {coreTags.map(tag => (
                                    <div key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-gray-700">
                                        <Sparkles size={12} className="text-amber-500" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Global Match Score (Glassmorphism circle) */}
                    <div className="shrink-0 relative z-10">
                        <div className="w-48 h-48 rounded-full border-[6px] border-indigo-50 flex flex-col items-center justify-center relative bg-white/40 backdrop-blur-md shadow-xl shadow-indigo-100/50 ring-1 ring-white/60">
                            {/* Static ring mimic SVG */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="90" cy="90" r="84" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 max-[768px]:cx-1/2 max-[768px]:cy-1/2" />
                                <circle cx="90" cy="90" r="84" stroke="url(#gradient)" strokeWidth="6" fill="transparent" strokeDasharray="528" strokeDashoffset={528 - (528 * AIGlobalScore) / 100} className="transition-all duration-1000 ease-out max-[768px]:cx-1/2 max-[768px]:cy-1/2" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#c084fc" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="text-4xl font-extrabold text-gray-900 tabular-nums relative">{AIGlobalScore}<span className="text-2xl text-gray-400 absolute ml-1">%</span></span>
                            <span className="text-xs font-bold text-indigo-600 mt-1 uppercase tracking-widest relative">AI 胜算概率</span>
                        </div>
                    </div>
                </div>

                {/* 2. Interactive Stage Tabs */}
                <div className="flex gap-3 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex-wrap overflow-x-auto">
                    {['小升初', '初升高', '高升大'].map((stage) => (
                        <button
                            key={stage}
                            onClick={() => setActiveStage(stage)}
                            className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeStage === stage
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-[1.02]'
                                : 'bg-transparent text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {stage} 阶段演化部署
                        </button>
                    ))}
                </div>

                {/* 3. Stage Content Panel */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Top Row: Visualizations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Chart A: Target Gravity Radar */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><RadarIcon size={64} /></div>
                            <h3 className="font-extrabold text-gray-800 self-start mb-2 px-2">目标院校/高中引力雷达匹配</h3>
                            <p className="text-xs text-gray-400 self-start px-2 mb-6">解析你的当前多维能力与名校目标线的拟合度</p>
                            <div className="w-full h-80 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                        <PolarGrid stroke="#f3f4f6" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Legend wrapperStyle={{ paddingTop: 20, fontSize: 12, fontWeight: 600 }} />
                                        <Radar name="我的当前维面" dataKey="student" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.6} />
                                        <Radar name="目标(重点高中/强基)画像" dataKey="targetMaster" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Chart B: Distribution Simulator */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><PieChartIcon size={64} /></div>
                            <h3 className="font-extrabold text-gray-800 self-start mb-2 px-2">AI 宏观落位预测模拟器</h3>
                            <p className="text-xs text-gray-400 self-start px-2 mb-6">基于全省同届大盘数据计算出的竞争力分布</p>
                            <div className="w-full h-80 flex items-center justify-center relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={distributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={4}
                                            dataKey="probability"
                                            stroke="none"
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `${value}%`}
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontWeight: 600 }}
                                        />
                                        <Legend
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                            iconType="circle"
                                            wrapperStyle={{ fontSize: 12, fontWeight: 600, color: '#374151' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center text */}
                                <div className="absolute flex flex-col items-center justify-center pointer-events-none md:ml-[-110px]">
                                    <span className="text-3xl font-black text-gray-900">45%</span>
                                    <span className="text-xs font-bold text-gray-400">核心预测区间</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart C: Pathway Trend Line Chart */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={64} /></div>
                        <h3 className="font-extrabold text-gray-800 mb-2 px-2">升学路径红利收放时序分析 (近5年)</h3>
                        <p className="text-xs text-gray-400 px-2 mb-6">可视化佐证 AI 为何推荐跨维打击(如特长生/强基)而非卷裸分</p>
                        <div className="h-64 px-2 relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={pathwaysTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorDom" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorQIangji" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: 12 }} />
                                    <Area type="monotone" dataKey="统招独木桥" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorDom)" />
                                    <Area type="monotone" dataKey="强基计划" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorQIangji)" />
                                    <Area type="monotone" dataKey="科技特长生" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTech)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bottom Row: AI Actionable Blueprint & Live Policy Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Timeline Blueprint */}
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                                        <Navigation size={18} className="text-blue-400" />
                                        AI 战术级行动时间表
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1">{currentInt.summary}</p>
                                </div>
                            </div>
                            <div className="p-8 pb-10">
                                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {currentInt.timeline.map((step, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-6">
                                            {/* Status Dot */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white shadow shadow-indigo-200 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform hover:scale-110">
                                                {step.type === 'action' ? <Zap size={16} /> : step.type === 'goal' ? <Target size={16} /> : <BookOpen size={16} />}
                                            </div>
                                            {/* Content Card */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-500 text-[10px] font-black tracking-wider uppercase">{step.time}</span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-800">{step.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Live Crawled Intelligence Sidefeed */}
                        <div className="bg-gradient-to-b from-indigo-50 to-white rounded-3xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 blur-sm"><Database size={100} /></div>
                            <h3 className="font-extrabold text-indigo-900 mb-6 flex items-center gap-2 relative z-10">
                                <Search size={18} className="text-indigo-600" />
                                决策实证库溯源
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {currentInt.evidence.map((ev, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-sm hover:shadow transition-shadow">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                                                <ScrollText size={10} /> {ev.source}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed border-l-2 border-indigo-500 pl-3">
                                            "{ev.detail}"
                                        </p>
                                    </div>
                                ))}

                                <div className="mt-8 pt-4 border-t border-indigo-100">
                                    <div className="flex items-center gap-2 text-indigo-400 text-xs mb-2">
                                        <Lightbulb size={14} />
                                        <span>AI 洞察</span>
                                    </div>
                                    <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                                        大数据显示，裸分赛道竞争烈度年均上升11%，而基础学科/科创相关的降分通道则在不断拓宽。以上时间轴已经为您规划了阻力最小的高收益升学路径。
                                    </p>
                                </div>
                                <button className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                    生成可打印报告 <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
