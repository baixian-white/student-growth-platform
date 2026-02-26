import { Link } from 'react-router-dom';
import { Home, ArrowLeft, BookOpen, Target, CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, Search, TrendingUp, Cpu, Landmark, Clock, Award, MessageCircle, ExternalLink, Microscope, BookType, GraduationCap, Globe, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// 最新强基计划官方新闻动态数据源
const newsData = [
    { title: "浙江大学2025年强基计划招生选拔测试通知", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202506/20250610/2293385421.html", date: "2025-06-10" },
    { title: "今年“强基计划”有哪些新动向", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202505/20250508/2293380077.html", date: "2025-05-08" },
    { title: "吉林大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250424/2293379491.html", date: "2025-04-24" },
    { title: "北京大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250423/2293378252.html", date: "2025-04-23" },
    { title: "清华大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250423/2293378246.html", date: "2025-04-23" },
    { title: "同济大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250422/2293377060.html", date: "2025-04-22" },
    { title: "南京大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250422/2293377058.html", date: "2025-04-22" },
    { title: "上海交通大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250422/2293377051.html", date: "2025-04-22" },
    { title: "浙江大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250422/2293377050.html", date: "2025-04-22" },
    { title: "中国科学技术大学2025年强基计划招生简章", link: "https://gaokao.chsi.com.cn/gkxx/qjjh/202504/20250422/2293377041.html", date: "2025-04-22" }
];
const universityList = [
    {
        level: 'C9联盟 (9所)',
        schools: [
            { name: '清华大学', code: '10003' },
            { name: '北京大学', code: '10001' },
            { name: '复旦大学', code: '10246' },
            { name: '上海交通大学', code: '10248' },
            { name: '南京大学', code: '10284' },
            { name: '浙江大学', code: '10335' },
            { name: '中国科学技术大学', code: '10358' },
            { name: '哈尔滨工业大学', code: '10213' },
            { name: '西安交通大学', code: '10698' }
        ]
    },
    {
        level: '其他985/211重点高校 (30所)',
        schools: [
            { name: '中国人民大学', code: '10002' },
            { name: '北京航空航天大学', code: '10006' },
            { name: '北京理工大学', code: '10007' },
            { name: '中国农业大学', code: '10019' },
            { name: '北京师范大学', code: '10027' },
            { name: '中央民族大学', code: '10052' },
            { name: '南开大学', code: '10055' },
            { name: '天津大学', code: '10056' },
            { name: '大连理工大学', code: '10141' },
            { name: '东北大学', code: '10145' },
            { name: '吉林大学', code: '10183' },
            { name: '同济大学', code: '10247' },
            { name: '华东师范大学', code: '10269' },
            { name: '东南大学', code: '10286' },
            { name: '厦门大学', code: '10384' },
            { name: '山东大学', code: '10422' },
            { name: '中国海洋大学', code: '10423' },
            { name: '武汉大学', code: '10486' },
            { name: '华中科技大学', code: '10487' },
            { name: '湖南大学', code: '10532' },
            { name: '中南大学', code: '10533' },
            { name: '中山大学', code: '10558' },
            { name: '华南理工大学', code: '10561' },
            { name: '四川大学', code: '10610' },
            { name: '重庆大学', code: '10611' },
            { name: '电子科技大学', code: '10614' },
            { name: '西北工业大学', code: '10699' },
            { name: '西北农林科技大学', code: '10712' },
            { name: '兰州大学', code: '10730' },
            { name: '国防科技大学', code: '91002' }
        ]
    }
];

const timelineData = [
    { grade: '高一至高二', focus: '夯实基础 / 锚定选修', details: '确认是否对基础学科有真正兴趣。理科倾向需尽早接触竞赛，文科倾向需多读经典原著。做好新高考选科的战略决策。' },
    { grade: '高三 3-4月', focus: '简章发布 / 政策研读', details: '39所高校陆续发布“强基计划招生简章”。此时需要立刻研读目标高校的招生专业名单及入围条件红线。' },
    { grade: '高三 4月', focus: '阳光高考平台系统报名', details: '考生需在指定时间内登录阳光高考网“强基报名系统”完成志愿填报（依据官方要求，通常每位考生只能限报1所高校）。' },
    { grade: '高三 6月', focus: '参加全国统一高考', details: '强基并非完全脱离高考。无论通过何种途径（含破格银牌选手），所有考生都必须参加高考，录取中高考成绩依然占据绝对核心的85%权重。' },
    { grade: '高考后(6月下旬)', focus: '确认校测与入围', details: '高考出分前需在线确认是否继续参加校测。省考院提供高考成绩后，高校按计划数的3-6倍划定极高的入围分数线，并公布入围名单。' },
    { grade: '7月初', focus: '高校独立校考', details: '入围考生与破格考生分别参加高校自己组织的笔试、面试及体育测试。' },
    { grade: '7月5日前', focus: '折算成绩与终选提档', details: '按高考裸分85% + 校测成绩15%合并计算综合排名并择优录取。被强基录取后直接锁档，不再参加后续各批次投档。' }
];

const faqs = [
    { q: '强基计划录取后可以转专业吗？', a: '绝大多数情况下不可以。教育部明确规定，强基计划录取考生入学后原则上不得转到相关学科之外的专业就读，强基也是有淘汰分流机制的。' },
    { q: '没有竞赛奖项能报强基计划吗？', a: '完全可以。绝大比例的招生名额其实是给第一类考生（凭借高考成绩优异入围）的。只要你的高考分数足够高（一般要求过省重点线且校排名靠前），依然有极大希望入选。' },
    { q: '强基计划和综合评价可以同时报吗？', a: '报名阶段一般不冲突，都可以报。但是！强基计划是在提前批之前录取的，一旦强基被录取，后面的综合评价、提前批、普通批次全都会失效（被锁档）。' }
];

export default function StrongBasePlan() {
    const [openFaq, setOpenFaq] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 顶部导航栏 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                    <Target size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">强基计划全解析</h1>
                            </div>

                            {/* 系统内导航切换 */}
                            <div className="ml-8 flex bg-gray-100 p-1 rounded-xl">
                                <Link to="/exam-info" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </Link>
                                <Link to="/exam-analysis" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} />信息分析
                                    </div>
                                </Link>
                                <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-indigo-700 shadow-sm border border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} />强基计划
                                    </div>
                                </div>
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

            <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
                {/* 1. Header 简介区 */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 text-left">
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                            基础学科招生改革试点
                        </span>
                        <h2 className="text-4xl font-extrabold mb-4 leading-tight">什么是“强基计划”？</h2>
                        <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
                            主要选拔培养有志于服务国家重大战略需求且综合素质优秀或基础学科拔尖的学生。重点在数学、物理、化学、生物及历史、哲学、古文字学等相关专业招生。
                        </p>
                    </div>

                    {/* 三大机制小卡片提取（融入官方特权） */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm text-left shadow-inner">
                            <h4 className="font-bold flex items-center gap-2 mb-2"><BookOpen size={16} />官方特色化培养</h4>
                            <p className="text-xs text-indigo-100 opacity-95 leading-relaxed">单独编班并配备一流师资与学习条件；实行双向选择的导师制、小班化等模式。</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm text-left shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h4 className="font-bold flex items-center gap-2 mb-2 text-yellow-300"><GraduationCap size={16} />直博保研专属金牌</h4>
                            <p className="text-xs text-indigo-100 opacity-95 leading-relaxed">畅通人才成长通道。在<strong className="text-white font-bold">免推研究生(保研)、直博优先、公派出国留学、高阶奖学金</strong>等维度予以官方政策倾斜保障。</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-sm text-left shadow-inner">
                            <h4 className="font-bold flex items-center gap-2 mb-2"><ShieldAlert size={16} />动态流转考核机制</h4>
                            <p className="text-xs text-indigo-100 opacity-95 leading-relaxed">设置科学的多阶段考核关卡。如果无法适应高强度基础学科，会被无情分流转至普通相关专业就读。</p>
                        </div>
                    </div>
                </div>

                {/* 1.5 聚焦国家重大战略领域的专业群 */}
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-left">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Microscope size={24} /></div>
                        <h3 className="text-2xl font-bold text-gray-900">官方锁定的核心招生专业版图</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 transition-colors hover:bg-indigo-50">
                            <h4 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4">
                                <Microscope size={18} className="text-indigo-600" />
                                基础理学与医学类
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['数学', '物理', '化学', '生物', '力学', '基础医学', '育种'].map(m => (
                                    <span key={m} className="px-3 py-1.5 bg-white border border-indigo-100 text-indigo-700 rounded-lg text-sm font-medium shadow-sm">{m}</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 transition-colors hover:bg-emerald-50">
                            <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-4">
                                <Cpu size={18} className="text-emerald-600" />
                                卡脖子紧缺工科类
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['高端芯片与软件', '智能科技', '新材料', '先进制造', '国家安全'].map(m => (
                                    <span key={m} className="px-3 py-1.5 bg-white border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium shadow-sm">{m}</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 transition-colors hover:bg-amber-50">
                            <h4 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-4">
                                <BookType size={18} className="text-amber-600" />
                                顶尖人文社科类
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['历史', '哲学', '古文字学'].map(m => (
                                    <span key={m} className="px-3 py-1.5 bg-white border border-amber-100 text-amber-700 rounded-lg text-sm font-medium shadow-sm">{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 39所试点高校及入围条件双列板块 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    {/* 左侧：高校名单 */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Landmark size={24} /></div>
                            <h3 className="text-xl font-bold text-gray-900">39 所顶尖试点高校</h3>
                        </div>
                        <div className="space-y-6">
                            {universityList.map((group, i) => (
                                <div key={i}>
                                    <h4 className="text-sm font-bold text-gray-500 mb-3">{group.level}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {group.schools.map((school) => (
                                            <div key={school.code} className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-gray-800 rounded-full cursor-default select-none group">
                                                <img
                                                    src={`https://t3.chei.com.cn/common/xh/${school.code}.jpg`}
                                                    alt={school.name}
                                                    className="w-7 h-7 rounded-full border border-gray-100 bg-white group-hover:scale-105 transition-transform"
                                                    loading="lazy"
                                                />
                                                <span className="text-sm font-medium">{school.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 右侧：报考与入围条件直击 */}
                    <div className="bg-white flex flex-col rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Award size={24} /></div>
                            <h3 className="text-xl font-bold text-gray-900">入围与录取核心揭秘</h3>
                        </div>
                        <div className="space-y-6 flex-grow">
                            <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-indigo-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">1</span>
                                    凭高考成绩入围 (绝大多数人)
                                </h4>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <strong className="text-gray-800">入围门槛：</strong>不依赖任何竞赛。完全看高考裸分，根据高校当年的招生计划按 <strong className="text-indigo-600">3-6倍的比例</strong> 划定入围分数线（门槛往往极高，超一本级线几十分）。
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <strong className="text-gray-800">关键算法：</strong>最终录取按照综合成绩排名计算，其中 <strong className="text-indigo-600">高考裸分占85%</strong>，大学自行组织的<strong className="text-indigo-600">校内笔试和面试占15%</strong>。
                                    </p>
                                    <a href="https://bm.chsi.com.cn/jcxkzs/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors mt-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                                        阳光高考：全国强基计划官方报名入口 <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-rose-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-xs">2</span>
                                    凭竞赛奖项破格入围 (顶尖学霸)
                                </h4>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <strong className="text-gray-800">入围门槛：</strong>需在五大学科奥林匹克竞赛（数、理、化、生、信）中获得 <strong className="text-rose-600">全国决赛二等奖(银牌)及以上</strong>。高考成绩只要达到本省第一批次控制线（一本线）即可避开统考筛出，直接“破格入围”校测。
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <strong className="text-gray-800">避坑提醒：</strong>破格只管入围不管录取！入围后依然需要和其他顶尖高手争夺“85%+15%”里那15%的地狱难度校测成绩，压力极大。
                                    </p>
                                    <a href="https://www.noi.cn/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-800 transition-colors mt-2 bg-rose-50 px-3 py-1.5 rounded-full">
                                        了解五大奥赛之一：全国信息学奥赛(NOI) <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-amber-500 p-5 rounded-r-xl">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-amber-100 text-amber-700 flex items-center justify-center text-xs">3</span>
                                    校测考核与录取红线 (一锤定音)
                                </h4>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <strong className="text-gray-800">校测内容：</strong>包括笔试、面试和<strong className="text-amber-600">体育测试</strong>。多数高校规定体测虽不计入总分，但<strong className="text-amber-600">具有一票否决权</strong>（或者不合格则降级评优）。
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        <strong className="text-gray-800">志愿锁档限制：</strong>强基计划为提前批的最前排面录。一旦被强基计划正式录取，考生的个人档案将<strong className="text-amber-600">直接锁档锁死</strong>，不能再参加后续各批次（本一批等）的任何录取。如果不去就只能重读。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. 备考时间轴规划 */}
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-left">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock size={24} /></div>
                        <h3 className="text-2xl font-bold text-gray-900">高中三年备战时间轴</h3>
                        <span className="ml-auto text-sm text-gray-400 font-medium hidden sm:block">提前规划 · 步步为营</span>
                    </div>
                    <div className="relative pl-8 sm:pl-32 py-4 space-y-12 before:absolute before:inset-0 before:left-[39px] sm:before:left-[120px] before:w-0.5 before:bg-gray-100">
                        {timelineData.map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute -left-[36px] sm:-left-[116px] w-[90px] text-right hidden sm:block">
                                    <span className={`text-sm font-bold ${index > 2 ? 'text-indigo-600' : 'text-gray-400'}`}>{item.grade}</span>
                                </div>
                                <div className={`absolute -left-[11px] w-6 h-6 rounded-full border-4 border-white ${index > 2 ? 'bg-indigo-600 ring-2 ring-indigo-100' : 'bg-gray-300'} z-10 transition-colors`}></div>
                                <div className="sm:hidden mb-2">
                                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{item.grade}</span>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                    <h4 className={`text-lg font-bold mb-2 ${index > 2 ? 'text-indigo-900' : 'text-gray-800'}`}>{item.focus}</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. 高频 Q&A 手风琴 */}
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-left">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg"><MessageCircle size={24} /></div>
                        <h3 className="text-2xl font-bold text-gray-900">家长必读：高频 Q&A</h3>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`border ${openFaq === index ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-100 bg-white'} rounded-2xl overflow-hidden transition-all duration-300`}>
                                <button
                                    className="w-full text-left px-6 py-5 focus:outline-none flex justify-between items-center"
                                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                >
                                    <span className="font-bold text-gray-900 pr-8">{faq.q}</span>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${openFaq === index ? 'bg-indigo-600 text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-sm text-gray-600 leading-relaxed border-t border-indigo-100 pt-4 mt-1">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. 阳光高考官方新闻动态 */}
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-left">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Globe size={24} /></div>
                            <h3 className="text-2xl font-bold text-gray-900">官方报考资讯台</h3>
                        </div>
                        <a href="https://gaokao.chsi.com.cn/gkxx/qjjh" target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
                            查看更多官方动态 <ArrowRight size={14} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {newsData.map((news, idx) => (
                            <a
                                key={idx}
                                href={news.link}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm transition-all text-left"
                            >
                                <div className="mt-0.5 p-1.5 bg-gray-50 rounded-md group-hover:bg-white text-gray-400 group-hover:text-indigo-500 transition-colors">
                                    <Globe size={14} />
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <h5 className="text-[15px] font-semibold text-gray-800 group-hover:text-indigo-700 truncate transition-colors mb-1.5">
                                        {news.title}
                                    </h5>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        <span>发布时间: {news.date}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
