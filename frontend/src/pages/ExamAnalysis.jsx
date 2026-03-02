import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
    PieChart, Pie
} from 'recharts';
import {
    Info, Calendar, Award, BookOpen, School, TrendingUp, Users, Target, ChevronRight,
    Search, Filter, MapPin, Star, ShieldCheck, Zap, AlertCircle, Home, Cpu
} from 'lucide-react';

const App = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // 模拟数据：近三年合肥市区中考录取分数线（2023-2025为实际，2026为新总分下的预测）
    // 注意：2026年总分降为730，所以分数值会相应下降
    const scoreData = [
        { year: '2023', score: 585, total: 750, label: '750分制' },
        { year: '2024', score: 602, total: 750, label: '750分制' },
        { year: '2025', score: 618, total: 750, label: '750分制' },
        { year: '2026 (预)', score: 595, total: 730, label: '730分新制' },
    ];

    // 2026合肥中考新分值结构 (总分730分)
    const subjectData = [
        { name: '语文', value: 120, color: '#f87171' },
        { name: '数学', value: 120, color: '#60a5fa' },
        { name: '英语', value: 120, color: '#fbbf24' }, // 120分（含听力口语30分）
        { name: '物理', value: 70, color: '#34d399' },
        { name: '化学', value: 40, color: '#a78bfa' },
        { name: '道德与法治', value: 60, color: '#f472b6' },
        { name: '历史', value: 60, color: '#fb923c' },
        { name: '体育', value: 70, color: '#2dd4bf' }, // 提升至70分
        { name: '实验/信息', value: 30, color: '#94a3b8' }, // 实验20分+信息10分
        { name: '地生(8年级已考)', value: 40, color: '#64748b' } // 部分算法计入总分
    ];

    // 特长生分类数据 - 2026最新政策
    const specialtyTypes = [
        {
            type: '体育特长生',
            icon: <Target className="w-5 h-5 text-blue-500" />,
            items: ['田径', '三大球', '武术', '游泳', '霹雳舞'],
            policy: '专业课须达标，中考文化课要求下调，录取比例约占招生计划3-5%',
            schools: ['合肥一中(滨湖)', '合肥三中', '合肥七中', '庐阳高中']
        },
        {
            type: '艺术特长生',
            icon: <Star className="w-5 h-5 text-purple-500" />,
            items: ['声乐', '器乐', '舞蹈', '美术', '数字艺术'],
            policy: '综合分录取模式：(文化分×0.4 + 专业分×0.6) × 2',
            schools: ['合肥六中', '合肥八中', '二中', '十一中']
        },
        {
            type: '科技创新/强基',
            icon: <Zap className="w-5 h-5 text-yellow-500" />,
            items: ['信奥(C++)', '机器人', '创新大赛', '强基班'],
            policy: '重点高中自主招生主战场，对省级赛事奖项有刚性需求',
            schools: ['合肥一中(瑶海)', '合肥十中', '科大附中', '168中学']
        }
    ];

    // 2026 关键时间轴
    const timeline = [
        { month: '3月', event: '体育抽测项目公布 & 信息技术考试', status: '进行中' },
        { month: '4月', event: '理科实验操作考试 & 体育正式考', status: '准备中' },
        { month: '5月', event: '特长生/自主招生报名测试', status: '关键期' },
        { month: '6月14-16日', event: '2026年全省统一文化课考试', status: '决战' },
        { month: '7月初', event: '新分值制成绩发布', status: '待开启' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* 顶部导航 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-3 self-start md:self-auto">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                    <TrendingUp size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-wide whitespace-nowrap">信息分析</h1>
                            </div>

                            {/* 系统内导航切换 */}
                            <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl w-full md:w-auto justify-center md:justify-start">
                                <Link to="/exam-info" className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </Link>
                                <div className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium bg-white text-red-600 shadow-sm border border-gray-200 transition-all flex items-center gap-2 whitespace-nowrap">
                                    <TrendingUp size={16} />信息分析
                                </div>
                                <Link to="/strong-base" className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} />强基计划
                                    </div>
                                </Link>
                                <Link to="/tech-specialty" className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={16} />科技特长生
                                    </div>
                                </Link>
                                <Link to="/whitelist-competitions" className="px-3 md:px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} />白名单赛事
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 font-medium whitespace-nowrap self-end md:self-auto hidden md:flex">
                            <Home size={18} />
                            <span className="text-sm">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 页面专属子标题与模块切换 */}
            <div className="bg-white border-b border-slate-200 mb-6">
                <div className="max-w-7xl mx-auto px-6 h-16 flex flex-col sm:flex-row items-center justify-between gap-2 py-2 sm:py-0">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-bold tracking-tight text-slate-800">2026合肥升学<span className="text-red-600">战略看板</span></h2>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
                        {['overview', 'policy', 'specialty', 'competitions', 'schools'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                    }`}
                            >
                                {tab === 'overview' && '2026概览'}
                                {tab === 'policy' && '730新政'}
                                {tab === 'specialty' && '自主招生'}
                                {tab === 'competitions' && '白名单赛事'}
                                {tab === 'schools' && '高中竞争力'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">

                {/* 顶部动态播报 - 2026实战状态 */}
                <div className="bg-amber-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 animate-bounce" />
                        <p className="font-medium text-sm lg:text-base">
                            <strong>实时动态：</strong> 2026年合肥中考报名已结束，市区考生规模创历史新高，预计普高线较去年将有波动。
                        </p>
                    </div>
                    <div className="hidden md:block text-xs font-mono bg-black/10 px-3 py-1 rounded">
                        距文化课中考：105天
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 核心指标 */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="bg-red-100 p-2 rounded-lg"><Users className="w-5 h-5 text-red-600" /></div>
                                        <span className="text-slate-500 text-sm">2026参考人数</span>
                                    </div>
                                    <div className="text-2xl font-bold">约 9.8 万</div>
                                    <div className="text-red-500 text-xs mt-1 font-medium">↑ 压力值：极高</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="bg-blue-100 p-2 rounded-lg"><School className="w-5 h-5 text-blue-600" /></div>
                                        <span className="text-slate-500 text-sm">指标到校分配</span>
                                    </div>
                                    <div className="text-2xl font-bold">85%</div>
                                    <div className="text-slate-400 text-xs mt-1">校内竞争成为主流</div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="bg-green-100 p-2 rounded-lg"><Zap className="w-5 h-5 text-green-600" /></div>
                                        <span className="text-slate-500 text-sm">综合录取率</span>
                                    </div>
                                    <div className="text-2xl font-bold">约 84%</div>
                                    <div className="text-slate-400 text-xs mt-1">含职教高考实验班</div>
                                </div>
                            </div>

                            {/* 图表展示区 - 线条变化体现分值变革 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
                                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-red-500" />
                                    合肥中考投档线趋势图 (2023-2026)
                                </h3>
                                <p className="text-xs text-slate-400 mb-6">注：2026年因总分从750降至730，曲线呈现名义下降，实际竞争难度增加</p>
                                <ResponsiveContainer width="100%" height="75%">
                                    <LineChart data={scoreData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="year" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" domain={[550, 650]} />
                                        <Tooltip
                                            formatter={(value, name, props) => [`${value}分`, `录取线 (${props.payload.label})`]}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#ef4444"
                                            strokeWidth={4}
                                            dot={{ r: 6, fill: '#ef4444' }}
                                            activeDot={{ r: 8 }}
                                            name="市区普高最低线"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 侧边2026实战历 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-red-500" /> 2026 考试进程
                            </h3>
                            <div className="space-y-6">
                                {timeline.map((item, idx) => (
                                    <div key={idx} className="relative pl-8 border-l-2 border-slate-100 pb-1 last:pb-0">
                                        <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.status === '进行中' ? 'bg-red-600 animate-pulse scale-125' :
                                            item.status === '决战' ? 'bg-black' : 'bg-slate-300'
                                            }`}></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">{item.month}</p>
                                                <p className="font-semibold text-sm">{item.event}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.status === '进行中' ? 'bg-red-100 text-red-600' :
                                                item.status === '关键期' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100">
                                <h4 className="text-xs font-bold text-red-800 uppercase mb-3 flex items-center gap-1">
                                    <Info className="w-3 h-3" /> 2026 备考警示
                                </h4>
                                <ul className="text-xs space-y-2 text-red-700">
                                    <li>• 英语口语正式入分，需加强人机对话练习。</li>
                                    <li>• 历史政治改为闭卷(拟)，分值各降至60分。</li>
                                    <li>• 信息技术10分不可忽视，多为上机操作。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'policy' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" /> 730分制构成图 (2026版)
                            </h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={subjectData}
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {subjectData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                                {subjectData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between text-xs border-b border-slate-50 pb-1">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-slate-600">{item.name}</span>
                                        </div>
                                        <span className="font-mono font-bold">{item.value}分</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" /> 2026 录取机制深度分析
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                                        <h4 className="font-bold text-sm">一六八联招均衡派位</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        2026年依然保留一中、六中、八中联合招生机制。考生填报一个志愿代码，由电脑派位决定去向。分差缩小的背景下，进入联招线的博弈难度在提升。
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                        <h4 className="font-bold text-sm">强基班与特色班</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        针对2026届学生，合肥多所高中开设了“强基实验班”。这些班级通常在提前批次或校内选拔产生，是冲刺顶尖大学的最佳路径。
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                                        <h4 className="font-bold text-sm">职教高考直通车</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        新增“中本贯通”名额，550分以上学生可选择优质中专直升本科，是2026年升学的重要保底选项。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'specialty' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {specialtyTypes.map((category) => (
                            <div key={category.type} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-red-200 transition-all">
                                <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                    <h3 className="font-bold text-sm flex items-center gap-2">
                                        {category.icon} {category.type}
                                    </h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {category.items.map(item => (
                                            <span key={item} className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg text-xs leading-relaxed border-l-4 border-red-500">
                                        <strong className="block text-slate-800 mb-1 italic text-[11px]">2026录取风向：</strong>
                                        <span className="text-slate-600">{category.policy}</span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">目标院校推荐</span>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {category.schools.map(s => (
                                                <div key={s} className="text-[11px] text-slate-700 bg-slate-100 p-1 rounded text-center">
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'competitions' && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-700">
                                <Award className="w-6 h-6 text-red-500" /> 2026 赛事加分项与白名单
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">已更新至26年版</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: 'CSP-J/S 信息学认证', impact: '自主招生敲门砖', tag: '信奥', color: 'red' },
                                { name: '全国青少年创客大赛', impact: '科技特长生核心', tag: '科创', color: 'blue' },
                                { name: '合肥市青少年机器人赛', impact: '本市特长认同度高', tag: '机器人', color: 'amber' },
                                { name: '“希望杯”数学建模', impact: '理科班选拔参考', tag: '数学', color: 'slate' },
                                { name: '安徽省青少年航模赛', impact: '十中海航实验班利好', tag: '航空', color: 'sky' },
                                { name: '“白名单”文学奖项', impact: '文科特色班参考', tag: '文学', color: 'green' },
                                { name: '青少年人工智能创新', impact: '新兴热门特长', tag: 'AI', color: 'purple' },
                                { name: '市长奖推荐项目', impact: '荣誉加持极大', tag: '综合', color: 'pink' },
                            ].map((c, i) => (
                                <div key={i} className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all group border-t-4"
                                    style={{ borderTopColor: `var(--tw-color-${c.color}-500)` }}>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{c.tag}</span>
                                    <h4 className="font-bold text-sm my-1 group-hover:text-red-600">{c.name}</h4>
                                    <p className="text-[10px] text-slate-500 mt-2">{c.impact}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'schools' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <h3 className="text-lg font-bold mb-4">2026 合肥高中“新总分”竞争力预测</h3>
                        <div className="overflow-x-auto">
                            <table className="w-100 min-w-[800px] text-sm text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-400">
                                        <th className="pb-3 font-medium">学校</th>
                                        <th className="pb-3 font-medium">预估分数线(730制)</th>
                                        <th className="pb-3 font-medium">指标到校预测线</th>
                                        <th className="pb-3 font-medium">2026 核心看点</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        { name: '合一六八联招线', score: '675-685', target: '645-655', point: '电脑派位博弈期' },
                                        { name: '合肥168中学(单招)', score: '682+', target: '660+', point: '极高学术压力/清北基地' },
                                        { name: '合肥七中', score: '655+', target: '625+', point: '寄宿制管理标杆' },
                                        { name: '合肥十中', score: '650+', target: '620+', point: '海航、科创特色持续走强' },
                                        { name: '中科大附中', score: '670+', target: '不适用', point: '小班化/学术世家氛围' },
                                        { name: '合肥九中(新老校区)', score: '645+', target: '615+', point: '新校区硬件升级红利' },
                                    ].map((s, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="py-4 font-bold text-slate-800">{s.name}</td>
                                            <td className="py-4 text-red-600 font-bold font-mono text-lg">{s.score}</td>
                                            <td className="py-4 text-slate-500 font-mono">{s.target}</td>
                                            <td className="py-4 text-xs text-slate-500">{s.point}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 p-4 bg-slate-100 rounded text-[11px] text-slate-500 italic">
                            * 预估分仅供参考。2026年为新分值第一年，由于总分下调20分，以往的“分数直觉”需重塑。
                        </div>
                    </div>
                )}
            </main>

            {/* 页脚 */}
            <footer className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-400 text-xs border-t border-slate-200">
                <p>2026 合肥中考升学大数据分析看板 | 当前状态：实战备考期</p>
                <p className="mt-1">所有分值数据已根据2026年730分制改革方案重新校准</p>
            </footer>
        </div>
    );
};

export default App;