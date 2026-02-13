import React, { useState, useMemo, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
    LayoutDashboard, Users, BookOpen, BarChart3, Settings,
    Search, Bell, TrendingUp, GraduationCap, AlertCircle,
    MoreVertical, Download, Plus, Edit, Trash2, Upload,
    FileText, Video, FileQuestion, Presentation, Mail,
    Phone, Calendar, Save, X, Filter, Grid, List, Home
} from 'lucide-react';

// --- 模拟数据(保留用于图表等非学生数据) ---

const coursesData = [
    { id: 1, title: '高等数学微积分基础', type: 'video', category: '数学', size: '256 MB', uploadDate: '2024-01-15', downloads: 128, thumbnail: '📐' },
    { id: 2, title: '古诗词鉴赏技巧', type: 'document', category: '语文', size: '12 MB', uploadDate: '2024-01-18', downloads: 95, thumbnail: '📖' },
    { id: 3, title: '英语语法专项练习', type: 'quiz', category: '英语', size: '5 MB', uploadDate: '2024-01-20', downloads: 156, thumbnail: '✏️' },
    { id: 4, title: '物理力学课件', type: 'presentation', category: '物理', size: '45 MB', uploadDate: '2024-01-22', downloads: 87, thumbnail: '🔬' },
    { id: 5, title: '化学实验操作视频', type: 'video', category: '化学', size: '512 MB', uploadDate: '2024-01-25', downloads: 142, thumbnail: '🧪' },
    { id: 6, title: '生物细胞结构图解', type: 'document', category: '生物', size: '18 MB', uploadDate: '2024-01-28', downloads: 76, thumbnail: '🧬' },
];

const subjectComparisonData = [
    { name: '数学', score: 92, avg: 78, fill: '#4f46e5' },
    { name: '语文', score: 88, avg: 82, fill: '#6366f1' },
    { name: '英语', score: 95, avg: 85, fill: '#f59e0b' },
    { name: '理综', score: 265, avg: 240, fill: '#10b981' },
];

const personalTrend = [
    { month: '9月', score: 78 },
    { month: '10月', score: 82 },
    { month: '11月', score: 80 },
    { month: '12月', score: 85 },
    { month: '1月', score: 88 },
];

const subjectAvg = [
    { subject: '数学', score: 81 },
    { subject: '语文', score: 83 },
    { subject: '英语', score: 81 },
    { subject: '理综', score: 82 },
];

const weaknessesData = [
    { id: 1, subject: '数学', point: '导数与极值综合题', degree: '高危', color: 'text-rose-600', bgColor: 'bg-rose-50', advice: '导数在大题中容易在分类讨论环节丢分，建议加强对“含参分类”逻辑的梳理。' },
    { id: 2, subject: '数学', point: '数列求和典型模版', degree: '预警', color: 'text-amber-600', bgColor: 'bg-amber-50', advice: '“错位相减法”计算准确率偏低，需强化基础运算的熟练度。' },
    { id: 3, subject: '语文', point: '现代文“作用题”', degree: '预警', color: 'text-amber-600', bgColor: 'bg-amber-50', advice: '需整理答题套路并背诵常考关键词，如“承上启下”、“铺垫”等。' },
    { id: 4, subject: '英语', point: '长对话细节捕捉', degree: '待提升', color: 'text-blue-600', bgColor: 'bg-blue-50', advice: '坚持每日精听 1 篇 BBC 6 Minute English，重点关注转折词后的信息。' },
];


// --- 子组件 ---
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {trend && (
                    <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% 较上学期
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

export default function Analytics() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedSubject, setSelectedSubject] = useState('all'); // 'all', 'math', 'chinese', etc.
    const [dashboardTrendSubject, setDashboardTrendSubject] = useState('all'); // 看板趋势科目
    const [showWeaknessDetail, setShowWeaknessDetail] = useState(false); // 是否展开弱项详情
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 各学科深度数据 ---
    const subjectDetails = {
        math: {
            title: '数学深度分析',
            trend: [
                { month: '9月', score: 75 }, { month: '10月', score: 82 },
                { month: '11月', score: 78 }, { month: '12月', score: 88 },
                { month: '1月', score: 92 }
            ],
            mastery: [
                { name: '函数与导数', value: 95, color: '#4f46e5' },
                { name: '数列综合', value: 85, color: '#6366f1' },
                { name: '概率统计', value: 90, color: '#10b981' },
                { name: '压轴大题练习', value: 65, color: '#ef4444' },
            ],
            advice: '导数与不等式综合题是目前的薄弱环节，主要集中在含参分类讨论的严密性。建议加强逻辑闭环记录。'
        },
        chinese: {
            title: '语文深度分析',
            trend: [
                { month: '9月', score: 85 }, { month: '10月', score: 84 },
                { month: '11月', score: 82 }, { month: '12月', score: 88 },
                { month: '1月', score: 88 }
            ],
            mastery: [
                { name: '古诗词鉴赏', value: 92, color: '#4f46e5' },
                { name: '文言文阅读', value: 88, color: '#6366f1' },
                { name: '现代文阅读', value: 80, color: '#f59e0b' },
                { name: '作文表达', value: 85, color: '#10b981' },
            ],
            advice: '文言文断句和实词掌握较好，现代文阅读中“作用题”得分率偏低，建议总结答题模板。'
        },
        english: {
            title: '英语深度分析',
            trend: [
                { month: '9月', score: 82 }, { month: '10月', score: 85 },
                { month: '11月', score: 88 }, { month: '12月', score: 92 },
                { month: '1月', score: 95 }
            ],
            mastery: [
                { name: '词汇语法', value: 98, color: '#4f46e5' },
                { name: '听力理解', value: 82, color: '#f59e0b' },
                { name: '阅读写作', value: 92, color: '#6366f1' },
                { name: '口语表达', value: 88, color: '#10b981' },
            ],
            advice: '听力失分多为长对话细节捕捉，建议每日坚持 15 分钟新闻听写训练。'
        }
    };

    // 加载学生数据
    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await studentAPI.getAllStudents();
            setStudents(data);
        } catch (err) {
            setError('加载学生数据失败');
            console.error('加载学生数据错误:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = useMemo(() => {
        return students.filter(s => s.name && s.name.includes(searchTerm));
    }, [students, searchTerm]);

    // 动态看板趋势数据
    const currentTrendData = useMemo(() => {
        if (dashboardTrendSubject === 'all') return personalTrend;
        return subjectDetails[dashboardTrendSubject]?.trend || personalTrend;
    }, [dashboardTrendSubject]);

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* 侧边栏 */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <GraduationCap size={24} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-indigo-900">学情智析</span>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: '我的学情看板' },
                        { id: 'analysis', icon: BarChart3, label: '成长路径分析' },
                        { id: 'courses', icon: BookOpen, label: '我的学习资源' },
                        { id: 'settings', icon: Settings, label: '个人中心' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="bg-indigo-900 rounded-2xl p-4 text-white">
                        <p className="text-xs text-indigo-200 mb-1">当前身份</p>
                        <p className="font-medium">张同学 (高三一班)</p>
                    </div>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="flex-1 overflow-y-auto">
                {/* 顶部栏 */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="搜索我的成绩或资源..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                            <Home size={18} />
                            <span className="text-sm font-medium">返回首页</span>
                        </Link>
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">\n                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                            张
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* 统计卡片 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="全校综合排名" value="15" icon={Users} color="bg-blue-500" trend={-2} />
                                <StatCard title="个人总平均分" value="88.5" icon={TrendingUp} color="bg-indigo-500" trend={4.2} />
                                <StatCard title="出勤状态" value="100%" icon={BookOpen} color="bg-emerald-500" />
                                <div
                                    onClick={() => setShowWeaknessDetail(!showWeaknessDetail)}
                                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${showWeaknessDetail ? 'ring-2 ring-rose-500 ring-offset-2' : ''}`}
                                >
                                    <StatCard
                                        title="待突破弱项 (点击详情)"
                                        value="4个核心考点"
                                        icon={AlertCircle}
                                        color="bg-rose-500"
                                    />
                                </div>
                            </div>

                            {/* 弱项详情展开面板 */}
                            {showWeaknessDetail && (
                                <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 animate-in slide-in-from-top-4 duration-500">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                                                <TrendingUp size={20} />
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-lg">全科薄弱知识点诊断</h4>
                                        </div>
                                        <button
                                            onClick={() => setShowWeaknessDetail(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {weaknessesData.map(item => (
                                            <div key={item.id} className={`p-5 rounded-2xl border border-transparent ${item.bgColor} hover:border-gray-200 transition-all group`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${item.color} bg-white shadow-sm mb-2 inline-block`}>
                                                            {item.subject}
                                                        </span>
                                                        <h5 className="font-bold text-gray-900">{item.point}</h5>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white ${item.color} shadow-sm border border-gray-50`}>
                                                        {item.degree}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                                    {item.advice}
                                                </p>
                                                <button className="text-xs font-semibold text-gray-400 group-hover:text-indigo-600 flex items-center gap-1 transition-colors">
                                                    去复习相关资源 <TrendingUp size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 图表区域 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* 成绩趋势线图 */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-gray-800">
                                            我的成绩演变路径
                                            <span className="ml-2 text-xs font-normal text-gray-400">
                                                ({dashboardTrendSubject === 'all' ? '总分' : subjectDetails[dashboardTrendSubject].title})
                                            </span>
                                        </h4>
                                        <div className="flex gap-2">
                                            <select
                                                className="text-xs bg-gray-50 border-gray-200 rounded-lg px-2 py-1 outline-none ring-1 ring-gray-200"
                                                value={dashboardTrendSubject}
                                                onChange={(e) => setDashboardTrendSubject(e.target.value)}
                                            >
                                                <option value="all">总分趋势</option>
                                                <option value="math">数学</option>
                                                <option value="chinese">语文</option>
                                                <option value="english">英语</option>
                                            </select>
                                            <select className="text-xs bg-gray-50 border-gray-200 rounded-lg px-2 py-1 outline-none ring-1 ring-gray-200">
                                                <option>最近5个月</option>
                                                <option>全年</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={currentTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                                    domain={dashboardTrendSubject === 'all' ? [0, 100] : ['dataMin - 5', 'dataMax + 5']}
                                                />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    formatter={(value) => [`${value} 分`, dashboardTrendSubject === 'all' ? '总分' : '单科得分']}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="score"
                                                    name="得分"
                                                    stroke="#4f46e5"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* 成绩对比柱状图 */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-gray-800">各科成绩表现对比</h4>
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                                                <span className="text-gray-500">我的得分</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-300"></div>
                                                <span className="text-gray-500">班级平均</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={subjectComparisonData} barGap={8}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                                <Tooltip
                                                    cursor={{ fill: '#f8fafc' }}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Bar dataKey="score" name="我的得分" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
                                                <Bar dataKey="avg" name="班级平均" fill="#fcd34d" radius={[4, 4, 0, 0]} barSize={24} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* 学生成绩快速预览表格 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800">我的近期考试记录单</h4>
                                    <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                                        导出数据
                                        <Download size={14} />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">考试名称</th>
                                                <th className="px-6 py-4 text-center">数学</th>
                                                <th className="px-6 py-4 text-center">语文</th>
                                                <th className="px-6 py-4 text-center">英语</th>
                                                <th className="px-6 py-4 text-center">理综</th>
                                                <th className="px-6 py-4">总分排名</th>
                                                <th className="px-6 py-4">报告</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {[
                                                { id: 1, name: '期末模拟考', math: 92, chinese: 88, english: 95, science: 265, rank: '5/45', status: '优秀' },
                                                { id: 2, name: '12月月考', math: 85, chinese: 82, english: 90, science: 240, rank: '12/45', status: '良好' },
                                                { id: 3, name: '11月月考', math: 78, chinese: 85, english: 88, science: 235, rank: '18/45', status: '待提升' },
                                                { id: 4, name: '期中考试', math: 95, chinese: 80, english: 92, science: 270, rank: '3/45', status: '优秀' },
                                            ].map((record) => (
                                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{record.name}</td>
                                                    <td className="px-6 py-4 text-center">{record.math}</td>
                                                    <td className="px-6 py-4 text-center">{record.chinese}</td>
                                                    <td className="px-6 py-4 text-center">{record.english}</td>
                                                    <td className="px-6 py-4 text-center">{record.science}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-semibold text-indigo-600">{record.rank}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-indigo-600 hover:underline flex items-center gap-1 text-sm">
                                                            查看诊断
                                                            <FileText size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold">个人学情深度分析</h2>
                                    <p className="text-gray-500 mt-1">支持整体概览与单科专项维度切换</p>
                                </div>
                                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                                    {[
                                        { id: 'all', label: '整体概览' },
                                        { id: 'math', label: '数学' },
                                        { id: 'chinese', label: '语文' },
                                        { id: 'english', label: '英语' },
                                    ].map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={() => setSelectedSubject(sub.id)}
                                            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${selectedSubject === sub.id
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedSubject === 'all' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                                            <h4 className="font-bold text-gray-800 self-start mb-6">各科加权分对比</h4>
                                            <div className="h-80 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={subjectAvg}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                        <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                                                        <YAxis />
                                                        <Tooltip cursor={{ fill: '#f5f7ff' }} />
                                                        <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                                            <h4 className="font-bold text-gray-800 self-start mb-6">个人实力素养雷达</h4>
                                            <div className="h-80 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                        { subject: '逻辑思维', A: 85 },
                                                        { subject: '语言表达', A: 70 },
                                                        { subject: '外语素养', A: 90 },
                                                        { subject: '科学探究', A: 65 },
                                                        { subject: '计算能力', A: 80 },
                                                        { subject: '阅读理解', A: 75 },
                                                    ]}>
                                                        <PolarGrid stroke="#e2e8f0" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                        <Radar name="能力值" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-indigo-600 text-white rounded-lg"><TrendingUp size={20} /></div>
                                            <h4 className="font-bold text-indigo-900">AI 综合学情诊断</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-800">
                                            <div className="bg-white bg-opacity-60 p-4 rounded-xl">
                                                <p className="font-bold mb-1">各科均衡性</p>
                                                <p>目前呈现“理强文稳”趋势,数学表现一直维持在年级前 5%,语文阅读部分还有进一步挖掘潜力。</p>
                                            </div>
                                            <div className="bg-white bg-opacity-60 p-4 rounded-xl">
                                                <p className="font-bold mb-1">学习稳定性</p>
                                                <p>近三次大考总分标准差较小,说明学习节奏稳定,建议保持现有的错题复盘机制。</p>
                                            </div>
                                            <div className="bg-white bg-opacity-60 p-4 rounded-xl">
                                                <p className="font-bold mb-1">潜力学科</p>
                                                <p>英语在该生所有科目中提升斜率最陡,预计在下一次模考中排名有望进入全校前三。</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {/* 单科趋势 */}
                                        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                            <h4 className="font-bold text-gray-800 mb-6">{subjectDetails[selectedSubject].title} - 成绩走势</h4>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={subjectDetails[selectedSubject].trend}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                                                        <Tooltip />
                                                        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5, fill: '#4f46e5' }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        {/* 提分建议 */}
                                        <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col justify-center shadow-lg shadow-indigo-200">
                                            <div className="p-3 bg-white bg-opacity-20 rounded-xl w-fit mb-6">
                                                <Presentation size={24} />
                                            </div>
                                            <h4 className="text-xl font-bold mb-3">AI 提分锦囊</h4>
                                            <p className="text-indigo-100 text-sm leading-relaxed">
                                                {subjectDetails[selectedSubject].advice}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 知识点掌握度 */}
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-8">知识点专项掌握进度</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {subjectDetails[selectedSubject].mastery.map(item => (
                                                <div key={item.name} className="space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-sm font-medium text-gray-600">{item.name}</span>
                                                        <span className="text-xs font-bold text-gray-400">{item.value}%</span>
                                                    </div>
                                                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    {/* 课程资源页面 */}
                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">学习资源中心</h2>
                                    <p className="text-gray-500 mt-1">浏览并下载由老师分享的高质量教学资源</p>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {['全部', '数学', '语文', '英语', '物理', '化学', '生物'].map(cat => (
                                    <button key={cat} className={`px-4 py-2 rounded-xl transition-colors ${cat === '全部'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                                        }`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {coursesData.map((course) => (
                                    <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-4xl">{course.thumbnail}</div>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${course.type === 'video' ? 'bg-purple-100 text-purple-700' :
                                                course.type === 'document' ? 'bg-blue-100 text-blue-700' :
                                                    course.type === 'quiz' ? 'bg-green-100 text-green-700' :
                                                        'bg-orange-100 text-orange-700'
                                                }`}>
                                                {course.type === 'video' ? '视频' :
                                                    course.type === 'document' ? '文档' :
                                                        course.type === 'quiz' ? '习题' : '课件'}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <span>{course.size}</span>
                                            <span>•</span>
                                            <span>{course.downloads} 次下载</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{course.uploadDate}</span>
                                            <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                                                下载
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                        {/* 系统设置页面 */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold">系统设置</h2>
                                    <p className="text-gray-500 mt-1">配置个人和系统偏好</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* 个人档案 */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Users size={20} className="text-indigo-600" />
                                            个人档案
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">我的姓名</label>
                                                <input type="text" defaultValue="张同学" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">我的学号</label>
                                                <input type="text" defaultValue="20240900123" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
                                                <input type="email" defaultValue="zhang@stu-highschool.edu.cn" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 班级信息 */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <GraduationCap size={20} className="text-indigo-600" />
                                            学籍信息
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">所在班级</label>
                                                <input type="text" defaultValue="高三一班" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">学年</label>
                                                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                                    <option>2023-2024</option>
                                                    <option>2024-2025</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">学期</label>
                                                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                                    <option>第一学期</option>
                                                    <option>第二学期</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 通知设置 */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Bell size={20} className="text-indigo-600" />
                                            通知设置
                                        </h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">邮件通知</span>
                                                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">系统推送</span>
                                                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">每周报告</span>
                                                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                            </label>
                                            <label className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">成绩预警</span>
                                                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* 数据管理 */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Download size={20} className="text-indigo-600" />
                                            数据管理
                                        </h3>
                                        <div className="space-y-3">
                                            <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                                                <Download size={18} />
                                                导出我的学情数据
                                            </button>
                                            <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                                                <Download size={18} />
                                                导出个人成绩报告
                                            </button>
                                            <button className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                                <Trash2 size={18} />
                                                清空缓存数据
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        重置
                                    </button>
                                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                        <Save size={18} />
                                        保存设置
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
            </main >
        </div >
    );
}
