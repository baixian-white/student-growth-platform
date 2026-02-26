import { Link } from 'react-router-dom';
import { Home, LineChart as LineChartIcon, PieChart as PieChartIcon, BarChart2, GraduationCap, Search, TrendingUp, Award, BookOpen, Calendar, Grid, Presentation, Target, Cpu } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// 模拟分析数据
const trendData = [
    { year: '2021', 本科率: 75, 一本率: 35, 强基计划: 8 },
    { year: '2022', 本科率: 77, 一本率: 38, 强基计划: 12 },
    { year: '2023', 本科率: 79, 一本率: 42, 强基计划: 16 },
    { year: '2024', 本科率: 82, 一本率: 45, 强基计划: 22 },
    { year: '2025', 本科率: 86, 一本率: 50, 强基计划: 28 },
];

const subjectDistribution = [
    { name: '数学与应用数学', value: 35 },
    { name: '物理学', value: 30 },
    { name: '化学与生物', value: 20 },
    { name: '历史与哲学', value: 15 },
];

const scoreData = [
    { name: '理科', 重点线: 520, 普通线: 430 },
    { name: '文科', 重点线: 535, 普通线: 450 },
    { name: '新高考(物理类)', 重点线: 510, 普通线: 415 },
    { name: '新高考(历史类)', 重点线: 525, 普通线: 440 },
];

const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B'];

const pathwayData = {
    strongBase: {
        title: '强基计划 (基础学科招生改革试点)',
        universities: ['清华大学', '北京大学', '复旦大学', '南京大学', '浙江大学', '上海交通大学', '中国科学技术大学'],
        milestones: [
            { date: '3月底-4月', event: '各校发布简章并开启报名' },
            { date: '6月7-8日', event: '参加全国统一高考' },
            { date: '6月中旬', event: '确认参加学校考核' },
            { date: '6月底-7月初', event: '学校考核、录取名单公示' }
        ],
        matchScore: 88,
        potentialSubjects: ['数学', '物理'],
        advice: '该生在逻辑思维与数学计算上具有显著优势，契合强基计划对基础科研人才的选拔标准。建议重点关注清北及复交的数理方向简章。'
    },
    techSpecial: {
        title: '科技特长生计划 (科创与智赛专项)',
        tracks: [
            { name: '信奥专项 (C++)', level: '省级一等奖候选', target: '重点高中理科实验班' },
            { name: '机器人/创客', level: '国家级参赛经历', target: '高校综合评价招生' },
            { name: '科创发明', level: '获得专利保护', target: '自主招生/特长加分' }
        ],
        advice: '由于该生在逻辑思维雷达图表现极佳，建议在高三上学期冲刺信奥省级联赛，作为名校敲门砖。'
    }
};

export default function ExamAnalysis() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航栏 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                    <LineChartIcon size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">升学信息分析</h1>
                            </div>
                            {/* 系统内导航切换 */}
                            <div className="ml-8 flex bg-gray-100 p-1 rounded-xl">
                                <Link to="/exam-info" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </Link>
                                <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-indigo-700 shadow-sm border border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <LineChartIcon size={16} />信息分析
                                    </div>
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
                                <Link to="/informatics-olympiad" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} />信息学奥赛
                                    </div>
                                </Link>
                                <Link to="/whitelist-competitions" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} />白名单赛事
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                            <Home size={18} />
                            <span className="text-sm font-medium">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* 概览数据卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">预测本科上线率</h3>
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">88.5<span className="text-lg text-gray-400 font-normal">%</span></p>
                        <p className="text-sm text-green-600 flex items-center gap-1 font-medium">
                            <span>↑ 增加 2.5%</span> <span className="text-gray-400 font-normal ml-2">相比去年</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">强基计划关注度</h3>
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                <Award size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">极高</p>
                        <p className="text-sm text-purple-600 flex items-center gap-1 font-medium">
                            <span>核心战略</span> <span className="text-gray-400 font-normal ml-2">基础学科拔尖</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 font-medium">推荐特长专业库</h3>
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <BookOpen size={20} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-2">32<span className="text-lg text-gray-400 font-normal"> 个方向</span></p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            覆盖理、工、文、哲多维度
                        </p>
                    </div>
                </div>

                {/* 图表分析区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* 升学率历年趋势 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <LineChartIcon className="text-indigo-600" size={20} />
                            历年重点升学率趋势分析
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorYiben" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorStrong" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="一本率" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorYiben)" />
                                    <Area type="monotone" dataKey="强基计划" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorStrong)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 强基计划专业分布 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <PieChartIcon className="text-cyan-600" size={20} />
                            强基计划优势学科录取预测占比
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subjectDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {subjectDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `${value}%`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 近三年分数线对比分析 */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BarChart2 className="text-amber-500" size={20} />
                            各科类批次控制分数线模拟分析
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} domain={[0, 750]} dx={-10} />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="重点线" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="普通线" fill="#93C5FD" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 专项升学通路分析 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* 强基计划专栏 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-bold mb-1">强基计划专栏</h4>
                                <p className="text-indigo-100 text-xs text-left">聚焦 39 所顶尖大学基础学科试点</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                                <GraduationCap size={24} />
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="bg-indigo-50 rounded-xl p-4 flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin-slow flex items-center justify-center font-bold text-indigo-600 text-xl bg-white">
                                    {pathwayData.strongBase.matchScore}%
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-indigo-900">综合匹配指数极高</p>
                                    <p className="text-xs text-indigo-600">该生建议主攻: {pathwayData.strongBase.potentialSubjects.join('、')}</p>
                                </div>
                            </div>

                            <div className="text-left">
                                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-600" />
                                    政策关键节点
                                </h5>
                                <div className="space-y-3 relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                                    {pathwayData.strongBase.milestones.map((ms, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-indigo-600"></div>
                                            <p className="text-xs font-bold text-indigo-600">{ms.date}</p>
                                            <p className="text-xs text-gray-500">{ms.event}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 text-left">
                                <h5 className="font-bold text-gray-800 mb-2">AI 规划建议</h5>
                                <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-indigo-200 pl-3">
                                    "{pathwayData.strongBase.advice}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 科技特长生计划 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-emerald-600 p-6 text-white flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-bold mb-1">科技特长生专栏</h4>
                                <p className="text-emerald-100 text-xs text-left">信奥/编程/创客/科创专项计划</p>
                            </div>
                            <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                                <Presentation size={24} />
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="text-left">
                                <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Grid size={16} className="text-emerald-600" />
                                    专项能力档案
                                </h5>
                                <div className="space-y-3">
                                    {pathwayData.techSpecial.tracks.map((track, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-gray-800">{track.name}</p>
                                                <p className="text-xs text-emerald-600 font-medium">当前能级: {track.level}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">建议目标</p>
                                                <p className="text-xs font-bold text-gray-700">{track.target}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-left">
                                <div className="flex gap-3 mb-3">
                                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><TrendingUp size={18} /></div>
                                    <h5 className="font-bold text-emerald-900">专项提分路线图</h5>
                                </div>
                                <p className="text-xs text-emerald-800 leading-relaxed">
                                    {pathwayData.techSpecial.advice}
                                </p>
                                <button className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
                                    咨询专业科创指导老师
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
