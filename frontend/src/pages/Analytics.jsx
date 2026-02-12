import React, { useState, useMemo } from 'react';
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

// --- 模拟数据 ---
const studentsData = [
    { id: 1, name: '张伟', studentId: '2024001', math: 85, chinese: 92, english: 78, science: 88, status: '进步', attendance: '98%', phone: '138****1234', email: 'zhangwei@example.com', parentName: '张父', parentPhone: '139****5678', class: '高三一班', enrollDate: '2021-09-01' },
    { id: 2, name: '李芳', studentId: '2024002', math: 92, chinese: 88, english: 95, science: 90, status: '优秀', attendance: '100%', phone: '138****2345', email: 'lifang@example.com', parentName: '李父', parentPhone: '139****6789', class: '高三一班', enrollDate: '2021-09-01' },
    { id: 3, name: '王勇', studentId: '2024003', math: 70, chinese: 75, english: 65, science: 72, status: '待提升', attendance: '92%', phone: '138****3456', email: 'wangyong@example.com', parentName: '王父', parentPhone: '139****7890', class: '高三一班', enrollDate: '2021-09-01' },
    { id: 4, name: '赵静', studentId: '2024004', math: 95, chinese: 96, english: 91, science: 94, status: '优秀', attendance: '99%', phone: '138****4567', email: 'zhaojing@example.com', parentName: '赵父', parentPhone: '139****8901', class: '高三一班', enrollDate: '2021-09-01' },
    { id: 5, name: '陈强', studentId: '2024005', math: 60, chinese: 68, english: 72, science: 65, status: '预警', attendance: '85%', phone: '138****5678', email: 'chenqiang@example.com', parentName: '陈父', parentPhone: '139****9012', class: '高三一班', enrollDate: '2021-09-01' },
    { id: 6, name: '刘洋', studentId: '2024006', math: 82, chinese: 80, english: 85, science: 81, status: '稳定', attendance: '96%', phone: '138****6789', email: 'liuyang@example.com', parentName: '刘父', parentPhone: '139****0123', class: '高三一班', enrollDate: '2021-09-01' },
];

const coursesData = [
    { id: 1, title: '高等数学微积分基础', type: 'video', category: '数学', size: '256 MB', uploadDate: '2024-01-15', downloads: 128, thumbnail: '📐' },
    { id: 2, title: '古诗词鉴赏技巧', type: 'document', category: '语文', size: '12 MB', uploadDate: '2024-01-18', downloads: 95, thumbnail: '📖' },
    { id: 3, title: '英语语法专项练习', type: 'quiz', category: '英语', size: '5 MB', uploadDate: '2024-01-20', downloads: 156, thumbnail: '✏️' },
    { id: 4, title: '物理力学课件', type: 'presentation', category: '物理', size: '45 MB', uploadDate: '2024-01-22', downloads: 87, thumbnail: '🔬' },
    { id: 5, title: '化学实验操作视频', type: 'video', category: '化学', size: '512 MB', uploadDate: '2024-01-25', downloads: 142, thumbnail: '🧪' },
    { id: 6, title: '生物细胞结构图解', type: 'document', category: '生物', size: '18 MB', uploadDate: '2024-01-28', downloads: 76, thumbnail: '🧬' },
];

const scoreDistribution = [
    { name: '90-100分', value: 2, fill: '#10B981' },
    { name: '80-89分', value: 2, fill: '#3B82F6' },
    { name: '70-79分', value: 1, fill: '#F59E0B' },
    { name: '60-69分', value: 1, fill: '#EF4444' },
];

const monthlyTrend = [
    { month: '9月', avg: 78 },
    { month: '10月', avg: 82 },
    { month: '11月', avg: 80 },
    { month: '12月', avg: 85 },
    { month: '1月', avg: 88 },
];

const subjectAvg = [
    { subject: '数学', score: 81 },
    { subject: '语文', score: 83 },
    { subject: '英语', score: 81 },
    { subject: '理综', score: 82 },
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
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        return studentsData.filter(s => s.name.includes(searchTerm));
    }, [searchTerm]);

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
                        { id: 'dashboard', icon: LayoutDashboard, label: '概览看板' },
                        { id: 'students', icon: Users, label: '学生名单' },
                        { id: 'analysis', icon: BarChart3, label: '深度分析' },
                        { id: 'courses', icon: BookOpen, label: '课程资源' },
                        { id: 'settings', icon: Settings, label: '系统设置' },
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
                        <p className="text-xs text-indigo-200 mb-1">当前教师</p>
                        <p className="font-medium">陈老师 (高三一班)</p>
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
                            placeholder="搜索学生姓名或学号..."
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
                            陈
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* 统计卡片 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="班级总人数" value="45" icon={Users} color="bg-blue-500" />
                                <StatCard title="平均成绩" value="82.4" icon={TrendingUp} color="bg-indigo-500" trend={3.2} />
                                <StatCard title="平均出勤率" value="96.5%" icon={BookOpen} color="bg-emerald-500" />
                                <StatCard title="待关注学生" value="3" icon={AlertCircle} color="bg-rose-500" />
                            </div>

                            {/* 图表区域 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* 成绩趋势线图 */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-gray-800">班级成绩波动趋势</h4>
                                        <select className="text-xs bg-gray-50 border-gray-200 rounded-lg">
                                            <option>本学期</option>
                                            <option>全年</option>
                                        </select>
                                    </div>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={monthlyTrend}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                                <YAxis hide />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="avg"
                                                    stroke="#4f46e5"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, fill: '#4f46e5' }}
                                                    activeDot={{ r: 6 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* 成绩分布饼图 */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-6">成绩段分布情况</h4>
                                    <div className="h-64 flex">
                                        <ResponsiveContainer width="60%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={scoreDistribution}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {scoreDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex flex-col justify-center gap-3 w-40">
                                            {scoreDistribution.map((item) => (
                                                <div key={item.name} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                                    <span className="text-xs text-gray-500">{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 学生成绩快速预览表格 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800">近期测验表现</h4>
                                    <button className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                                        导出数据
                                        <Download size={14} />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">姓名</th>
                                                <th className="px-6 py-4 text-center">数学</th>
                                                <th className="px-6 py-4 text-center">语文</th>
                                                <th className="px-6 py-4 text-center">英语</th>
                                                <th className="px-6 py-4 text-center">出勤率</th>
                                                <th className="px-6 py-4">状态</th>
                                                <th className="px-6 py-4">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredStudents.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{student.name}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={student.math < 70 ? 'text-red-500 font-bold' : ''}>
                                                            {student.math}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">{student.chinese}</td>
                                                    <td className="px-6 py-4 text-center">{student.english}</td>
                                                    <td className="px-6 py-4 text-center text-gray-500">{student.attendance}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${student.status === '优秀'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : student.status === '预警'
                                                                    ? 'bg-rose-100 text-rose-700'
                                                                    : student.status === '待提升'
                                                                        ? 'bg-amber-100 text-amber-700'
                                                                        : 'bg-blue-100 text-blue-700'
                                                                }`}
                                                        >
                                                            {student.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="p-1 hover:bg-gray-200 rounded text-gray-400">
                                                            <MoreVertical size={16} />
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
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold">学科能力模型</h2>
                                    <p className="text-gray-500 mt-1">基于全班平均分的综合能力评估</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                                    <h4 className="font-bold text-gray-800 self-start mb-6">各科平均分分布</h4>
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
                                    <h4 className="font-bold text-gray-800 self-start mb-6">班级核心素养雷达图</h4>
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart
                                                cx="50%"
                                                cy="50%"
                                                outerRadius="80%"
                                                data={[
                                                    { subject: '逻辑思维', A: 85 },
                                                    { subject: '语言表达', A: 70 },
                                                    { subject: '外语素养', A: 90 },
                                                    { subject: '科学探究', A: 65 },
                                                    { subject: '计算能力', A: 80 },
                                                    { subject: '阅读理解', A: 75 },
                                                ]}
                                            >
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                <Radar name="能力值" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* AI 分析建议 */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h4 className="font-bold text-indigo-900">AI 学情深度诊断</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-800">
                                    <div className="bg-white bg-opacity-60 p-4 rounded-xl">
                                        <p className="font-bold mb-1">重点发现</p>
                                        <p>数学平均分连续两月呈下降趋势,建议本周增加对"圆锥曲线"章节的专项复习课。</p>
                                    </div>
                                    <div className="bg-white bg-opacity-60 p-4 rounded-xl">
                                        <p className="font-bold mb-1">培优建议</p>
                                        <p>李芳、赵静等同学英语表现卓越,可推荐参加下月的全国青少年口语竞赛。</p>
                                    </div>
                                    <div className="bg-white bg-opacity-60 p-4 rounded-xl">
                                        <p className="font-bold mb-1">补差方案</p>
                                        <p>王勇、陈强出勤率偏低且成绩波动较大,建议进行一次线上家访了解其家庭学习环境。</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 学生名单页面 */}
                    {activeTab === 'students' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">学生名单</h2>
                                    <p className="text-gray-500 mt-1">管理班级学生信息</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        <Upload size={18} />
                                        批量导入
                                    </button>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                        <Plus size={18} />
                                        添加学生
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">学号</th>
                                                <th className="px-6 py-4">姓名</th>
                                                <th className="px-6 py-4">联系电话</th>
                                                <th className="px-6 py-4">邮箱</th>
                                                <th className="px-6 py-4">家长姓名</th>
                                                <th className="px-6 py-4">家长电话</th>
                                                <th className="px-6 py-4">入学日期</th>
                                                <th className="px-6 py-4">状态</th>
                                                <th className="px-6 py-4">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {studentsData.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-sm">{student.studentId}</td>
                                                    <td className="px-6 py-4 font-medium">{student.name}</td>
                                                    <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{student.email}</td>
                                                    <td className="px-6 py-4">{student.parentName}</td>
                                                    <td className="px-6 py-4 text-gray-600">{student.parentPhone}</td>
                                                    <td className="px-6 py-4 text-gray-600">{student.enrollDate}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${student.status === '优秀' ? 'bg-emerald-100 text-emerald-700' :
                                                            student.status === '预警' ? 'bg-rose-100 text-rose-700' :
                                                                student.status === '待提升' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {student.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button className="p-1.5 hover:bg-indigo-50 rounded text-indigo-600" title="编辑">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="p-1.5 hover:bg-red-50 rounded text-red-600" title="删除">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 课程资源页面 */}
                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">课程资源</h2>
                                    <p className="text-gray-500 mt-1">管理教学资源和课件</p>
                                </div>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                    <Upload size={18} />
                                    上传资源
                                </button>
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
                                {/* 个人信息 */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <Users size={20} className="text-indigo-600" />
                                        个人信息
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">教师姓名</label>
                                            <input type="text" defaultValue="陈老师" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
                                            <input type="email" defaultValue="chen@school.edu.cn" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                                            <input type="tel" defaultValue="138****9999" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>

                                {/* 班级信息 */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <GraduationCap size={20} className="text-indigo-600" />
                                        班级信息
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">班级名称</label>
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
                                            导出学生数据
                                        </button>
                                        <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                                            <Download size={18} />
                                            导出成绩报告
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
            </main>
        </div>
    );
}
