import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LineChart, Line
} from 'recharts';
import {
    GraduationCap,
    ClipboardCheck,
    Search,
    TrendingUp,
    BookOpen,
    ChevronRight,
    AlertCircle,
    Loader2,
    MapPin,
    Info,
    User,
    Heart,
    Target,
    ShieldCheck,
    Zap,
    Home,
    Brain,
    Calendar,
    Activity,
    UploadCloud,
    FileText,
    X,
    Award,
    Edit3,
    Cpu
} from 'lucide-react';

const App = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('mock'); // mock, policy, profile, preference

    // 适配“考前规划”视角的数据模型
    const [userData, setUserData] = useState({
        city: '合肥',
        district: '蜀山区',
        schoolType: '普通公办',
        identityType: '本地户籍',
        hasLocalEligibility: true, // 指标到校资格
        continuousEnrollment: 3, // 连续学籍时长(年)
        bonusCategories: [], // 加分项: 少数民族, 归侨, 军人子女等
        targetExamZone: '市区', // 回原籍考/本地考
        currentSchool: '合肥第四十五中学', // 当前就读学校
        currentCampus: '桐城路校区', // 当前就读校区

        // 2. 模拟考成绩 (考前视角)
        historicalScores: [
            { name: '初二期初', score: 590 },
            { name: '初二期末', score: 620 },
            { name: '初三一模', score: 650 },
            { name: '最新预估', score: 680 },
        ],
        mockScores: [
            { subject: '语文', score: 120, full: 150 },
            { subject: '数学', score: 140, full: 150 },
            { subject: '英语', score: 110, full: 120 },
            { subject: '物理', score: 65, full: 70 },
            { subject: '化学', score: 35, full: 40 },
            { subject: '道德与法治', score: 70, full: 80 },
            { subject: '历史', score: 60, full: 70 },
            { subject: '体育/实验', score: 68, full: 70 },
        ],
        examSessions: [
            {
                id: 1,
                name: '初三一模',
                files: [
                    { name: '2026合肥一模数学试卷及答题卡.pdf', size: '4.2 MB' },
                    { name: '全区排名成绩单.xlsx', size: '150 KB' }
                ]
            }
        ],
        scoreStability: '稳定', // 波动情况
        schoolRank: '前10%', // 校内排名

        // 3. 考前画像
        talents: [],
        awards: [
            { id: 1, name: 'NOI 省级一等奖证书.jpg', type: '信息学竞赛', grade: '初二', size: '2.1 MB' }
        ],

        // 4. 择校倾向
        targetSchools: [],
        accommodation: '住宿',
        acceptJointAdmission: true,
    });

    const [report, setReport] = useState(null);

    const generateReport = () => {
        setLoading(true);
        setTimeout(() => {
            // 简单模拟：如果上传了奖状，就一定概率触发特长生报告，否则默认走普通中考路线
            const isTalentRoute = userData.awards.length > 0 && Math.random() > 0.3; // 70% 概率出特长报告如果传了奖状

            if (isTalentRoute) {
                setReport({
                    type: 'talent',
                    title: '特长生/自招推荐路径',
                    badge: '⭐ 特长优势型',
                    range: { min: 610, max: 645 }, // 特长生文化课要求相对放宽，通常达到普高线或降降分标准即可
                    summary: `检测到您具备高价值【信息学竞赛/科技创新】类省级以上奖项。结合您当前稳定在 620 分上下的文化课成绩，强烈建议您本月开始准备【合肥一中/一六八中学】的科技特长生自主招生！这能将您的名校录取率跨跃式提升，部分校区对科技特长生可降 40-100 分录取。`,
                    milestones: [
                        { date: '4月中旬', event: '合肥市各校自主招生简章集中发布', action: '准备初中三年获奖原件与复印件备案' },
                        { date: '5月初', event: '特长生校考/面试报名', action: '跟综往年真题，准备机考或现场答辩项目' },
                        { date: '5月下旬', event: '中考冲刺与志愿模拟填报', action: '文化课稳住市排名前 15%，冲击裸分录取' }
                    ],
                    advice: [
                        { title: '自招突击', content: '一六八中学的特长生机考侧重算法基础与开源项目理解，建议近几周周末集中刷历年真题。', icon: <Target className="text-amber-500" /> },
                        { title: '文化课保底', content: '特长生预录取协议仍要求中考总分达到市区普高控制线以上（通常在560-590分之间），英语仍是您目前的重灾区，需稳住生命线。', icon: <Zap className="text-blue-500" /> },
                        { title: '政策准备', content: '检查户口本、学籍一致性，外地户口需留意合肥市中考异地随迁子女政策的时间节点。', icon: <ShieldCheck className="text-purple-500" /> }
                    ]
                });
            } else {
                setReport({
                    type: 'standard',
                    title: '统招/指标到校冲刺路径',
                    badge: '🎯 培优冲刺型',
                    range: { min: 720, max: 745 },
                    summary: `基于您上传的模考成绩单综合分析，您的文化基础非常扎实，中考预估在 720 ~ 745 分区间。${userData.hasLocalEligibility ? '目前您具备【指标到校】资格，在所在初中排名前 5%，锁定区内顶尖省示范的胜率极高。' : '非指标生，建议重点关注各校针对统招生的提前批次录取。'}`,
                    milestones: [
                        { date: '5月初', event: '理化实验及体育中考测试', action: '确保这两项拿下满分，这是省示范的刚性入场券' },
                        { date: '5月下旬', event: '全市二模统考与志愿模拟', action: '根据全区排名折算全市排名，精准定位一二梯队' },
                        { date: '6月中旬', event: '合肥市初中学业水平考试', action: '调整作息进入备考实战状态' }
                    ],
                    advice: [
                        { title: '稳住理科优势', content: '从您上传的近期答题卡来看，数学压轴题和物理大题得分率极高，这是您甩开梯队的底气。', icon: <ShieldCheck className="text-blue-500" /> },
                        { title: '死磕文体细节', content: '语文作文立意及道法开放性试题仍有10分左右的提升空间，建议近期背诵各类时政热点答题模板。', icon: <Zap className="text-yellow-500" /> },
                        { title: '考前心态调节', content: `大考在即，稳中有升。此时不宜再攻偏难怪题，回归课本基础错题本即可。`, icon: <Brain className="text-purple-500" /> }
                    ]
                });
            }
            setLoading(false);
            setStep(3);
        }, 2000);
    };

    const handleFileUpload = (sessionId, e) => {
        const uploadedFiles = Array.from(e.target.files).map(file => ({
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            type: file.type
        }));

        const newSessions = [...userData.examSessions];
        const idx = newSessions.findIndex(s => s.id === sessionId);
        newSessions[idx].files = [...newSessions[idx].files, ...uploadedFiles];
        setUserData({ ...userData, examSessions: newSessions });
        // 清空 input 值，允许重复传相同文件
        e.target.value = '';
    };

    const handleRemoveFile = (sessionId, fileIndex) => {
        const newSessions = [...userData.examSessions];
        const idx = newSessions.findIndex(s => s.id === sessionId);
        newSessions[idx].files = newSessions[idx].files.filter((_, fIdx) => fIdx !== fileIndex);
        setUserData({ ...userData, examSessions: newSessions });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
            {/* 顶部导航 */}
            <nav className="bg-white border-b border-red-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                            <div className="flex items-center gap-3 self-start md:self-auto min-w-max">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                    <GraduationCap size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-wide whitespace-nowrap">AI升学规划平台</h1>
                            </div>

                            {/* 本应用内的向导步骤导航 */}
                            <div className="flex bg-white p-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 gap-1 overflow-x-auto scrollbar-hide py-1 md:py-1 w-full md:w-auto">
                                {[1, 2, 3].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStep(s)}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${step === s ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/20' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`}
                                        disabled={loading || (s === 3 && !report)}
                                    >
                                        {s === 1 && <><Search size={16} />模考数据录入</>}
                                        {s === 2 && <><TrendingUp size={16} />AI路径测算</>}
                                        {s === 3 && <><Award size={16} />预估分析报告</>}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors text-gray-600 font-medium whitespace-nowrap self-end md:self-auto hidden md:flex">
                            <Home size={16} />
                            <span className="text-sm">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 md:p-10">

                {/* Header Subtitle Area */}
                <div className="mb-8">
                    <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-black mb-3 border border-red-100 uppercase tracking-widest">
                        <Calendar size={14} className="mr-2" /> Pre-Exam Planning / 考前规划版
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">安徽初升高考前模拟导航</h1>
                    <p className="text-slate-500 font-medium mt-2">利用平时模考排名，锁定中考理想目标</p>
                </div>

                {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Left Tabs */}
                        <div className="lg:col-span-3 space-y-2">
                            {[
                                { id: 'mock', label: '模考成绩/排名', icon: <TrendingUp size={18} /> },
                                { id: 'policy', label: '升学资格与政策优势', icon: <ShieldCheck size={18} /> },
                                { id: 'award', label: '获奖与特长证明', icon: <Award size={18} /> },
                                { id: 'preference', label: '预期目标校', icon: <Target size={18} /> },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-md text-red-600 border-l-4 border-red-600' : 'text-slate-500 hover:bg-slate-100'}`}
                                >
                                    <span className="mr-3">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}

                            <div className="mt-8">
                                <button onClick={() => setStep(2)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
                                    生成考前规划书 <ChevronRight size={18} className="ml-1" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-9 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-12 min-h-[550px]">
                            {activeTab === 'mock' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-2xl font-black text-slate-800">考试档案上传</h3>
                                        <button
                                            onClick={() => setUserData({ ...userData, examSessions: [...userData.examSessions, { id: Date.now(), name: '新增考试', files: [] }] })}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center"
                                        >
                                            + 新增考试记录
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">请为每次考试上传包含成绩单(Excel)、全区排名、试卷及答题卡(PDF/JPG)等文件。AI 将自动分析您的真实能力与丢分痛点。</p>

                                    <div className="space-y-6">
                                        {userData.examSessions.map(session => (
                                            <div key={session.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 relative group">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2 group/edit relative">
                                                        <input
                                                            type="text"
                                                            value={session.name}
                                                            onChange={(e) => {
                                                                const newSessions = [...userData.examSessions];
                                                                const idx = newSessions.findIndex(s => s.id === session.id);
                                                                newSessions[idx].name = e.target.value;
                                                                setUserData({ ...userData, examSessions: newSessions });
                                                            }}
                                                            className="font-black text-lg bg-transparent border-b-2 border-transparent focus:border-red-300 hover:border-slate-300 outline-none w-48 text-slate-800 transition-colors py-1"
                                                            title="点击修改考试名称"
                                                        />
                                                        <Edit3 size={14} className="text-slate-300 group-hover/edit:text-red-400 opacity-0 group-hover/edit:opacity-100 transition-all cursor-pointer pointer-events-none absolute -right-6" />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setUserData({ ...userData, examSessions: userData.examSessions.filter(s => s.id !== session.id) });
                                                        }}
                                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                                <label className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-red-400 hover:bg-white transition-all text-center cursor-pointer mb-4 block">
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(session.id, e)}
                                                        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                                                    />
                                                    <UploadCloud size={28} className="mx-auto text-slate-400 mb-2" />
                                                    <p className="font-bold text-slate-700 text-sm">点击或拖拽上传该次考试资料</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">支持 PDF, JPG, Excel 等格式</p>
                                                </label>
                                                {session.files.length > 0 && (
                                                    <div className="space-y-2 mt-4">
                                                        {session.files.map((file, fIdx) => (
                                                            <div key={fIdx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2 rounded-lg ${(file.name.endsWith('pdf') || file.name.endsWith('doc') || file.name.endsWith('docx')) ? 'bg-red-100 text-red-600' : (file.name.endsWith('xls') || file.name.endsWith('xlsx')) ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}><FileText size={14} /></div>
                                                                    <div>
                                                                        <div className="text-sm font-bold text-slate-700">{file.name}</div>
                                                                        <div className="text-xs text-slate-400">{file.size} · 核心数据已提取</div>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => handleRemoveFile(session.id, fIdx)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                        <div className="flex items-start gap-3">
                                            <Brain className="text-blue-500 shrink-0 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-bold text-blue-900 mb-1">AI 深度洞察</h4>
                                                <p className="text-xs text-blue-700 leading-relaxed">系统基于上传的试卷和排名数据，已精确评估您的知识盲区、当前校内大致排名（前10%）与成绩波动规律（稳定）。相关诊断已经同步至雷达图与抢分策略面板。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'policy' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <h3 className="text-2xl font-black text-slate-800">升学资格与政策优势分析</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* 户口与学籍状态 */}
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center"><MapPin size={18} className="mr-2 text-indigo-500" />户籍与考区判定</h4>
                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-slate-500 mb-2">当前就读学校</label>
                                                        <input
                                                            type="text"
                                                            value={userData.currentSchool}
                                                            onChange={(e) => setUserData({ ...userData, currentSchool: e.target.value })}
                                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-400"
                                                            placeholder="例如：合肥第四十五中"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-slate-500 mb-2">所属校区 (选填)</label>
                                                        <input
                                                            type="text"
                                                            value={userData.currentCampus}
                                                            onChange={(e) => setUserData({ ...userData, currentCampus: e.target.value })}
                                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-400"
                                                            placeholder="例如：桐城路校区"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-2">学籍所在区县 / 报考意向区县</label>
                                                    <div className="flex gap-2">
                                                        {['市区', '四县一市（回原籍）'].map(z => (
                                                            <button
                                                                key={z}
                                                                onClick={() => setUserData({ ...userData, targetExamZone: z })}
                                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${userData.targetExamZone === z ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                                            >
                                                                {z}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-2">本校连续实际就读时长</label>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3].map(yr => (
                                                            <button
                                                                key={yr}
                                                                onClick={() => setUserData({ ...userData, continuousEnrollment: yr })}
                                                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${userData.continuousEnrollment === yr ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                                                            >
                                                                {yr} 年{yr === 3 ? '及以上' : ''}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-2">* 连续满3年为享受省示范“指标到校”名额的核心前置条件。</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 指标生与照顾加分 */}
                                        <div className="space-y-6">
                                            <div className={`p-6 rounded-3xl border transition-all ${userData.continuousEnrollment === 3 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className={`font-bold ${userData.continuousEnrollment === 3 ? 'text-green-800' : 'text-red-800'}`}>指标到校预审</h4>
                                                    {userData.continuousEnrollment === 3 ? (
                                                        <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-black">具备资格</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-black">资质异常</span>
                                                    )}
                                                </div>
                                                <p className={`text-xs ${userData.continuousEnrollment === 3 ? 'text-green-700' : 'text-red-700'}`}>
                                                    {userData.continuousEnrollment === 3
                                                        ? '恭喜，您符合绝大部分地区（含合肥市）省示范高中的指标生资格，建议优先利用校内排名锁定指标生名额。'
                                                        : '注意：系统判定由于您的连续就读时长不足3年，您大概率将无法享受名校的“指标到校”降分录取政策，必须通过统招硬考。'}
                                                </p>
                                            </div>

                                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                                <h4 className="font-bold text-slate-800 mb-3 flex items-center"><User size={18} className="mr-2 text-rose-500" />政策性照顾加分验证</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {['少数民族 (+5分)', '归侨/华侨子女 (+10分)', '军人子女 (+10/20分)', '公安英烈子女', '无'].map(bonus => {
                                                        const isSelected = userData.bonusCategories.includes(bonus) || (bonus === '无' && userData.bonusCategories.length === 0);
                                                        return (
                                                            <button
                                                                key={bonus}
                                                                onClick={() => {
                                                                    if (bonus === '无') {
                                                                        setUserData({ ...userData, bonusCategories: [] });
                                                                    } else {
                                                                        const newBonus = userData.bonusCategories.includes(bonus)
                                                                            ? userData.bonusCategories.filter(b => b !== bonus)
                                                                            : [...userData.bonusCategories.filter(b => b !== '无'), bonus];
                                                                        setUserData({ ...userData, bonusCategories: newBonus });
                                                                    }
                                                                }}
                                                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-rose-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500 hover:border-rose-300'}`}
                                                            >
                                                                {bonus}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {userData.bonusCategories.length > 0 && userData.bonusCategories[0] !== '无' && (
                                                    <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start">
                                                        <AlertCircle size={14} className="text-rose-500 mr-2 shrink-0 mt-0.5" />
                                                        <p className="text-[10px] text-rose-700">根据安微省中考加分政策，多项加分通常不累计，取最高项。建议在考前 5 月份提前准备好相关户籍或军证复印件及单位证明提交学校。</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'award' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-2xl font-black text-slate-800">获奖与特长证明</h3>
                                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center">
                                            + 补充材料
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">
                                        请上传您初中阶段获得的核心奖状或考级证书（学科竞赛、科技创新、艺术体育类等）。AI将借此自动评估您的个人优势和自招潜力。
                                    </p>

                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                                        <label className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-red-400 hover:bg-white transition-all text-center cursor-pointer mb-6 block">
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => {
                                                    const uploadedAwards = Array.from(e.target.files).map(file => ({
                                                        id: Date.now() + Math.random(),
                                                        name: file.name,
                                                        type: '待识别',
                                                        grade: '解析中',
                                                        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
                                                    }));
                                                    setUserData({ ...userData, awards: [...userData.awards, ...uploadedAwards] });
                                                    e.target.value = '';
                                                }}
                                                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                                            />
                                            <UploadCloud size={28} className="mx-auto text-slate-400 mb-2" />
                                            <p className="font-bold text-slate-700 text-sm">点击或拖拽上传荣誉证书及证明资料</p>
                                            <p className="text-[10px] text-slate-400 mt-1">支持图片, PDF, Excel, Word 等格式</p>
                                        </label>

                                        <div className="space-y-3">
                                            {userData.awards.map(award => (
                                                <div key={award.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                                            <Award size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">{award.name}</div>
                                                            <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{award.type}</span>
                                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{award.grade}级别</span>
                                                                <span>{award.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setUserData({ ...userData, awards: userData.awards.filter(a => a.id !== award.id) })}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                        <div className="flex items-start gap-3">
                                            <Brain className="text-amber-500 shrink-0 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-bold text-amber-900 mb-1">AI 优势发掘报告</h4>
                                                <p className="text-xs text-amber-700 leading-relaxed">系统检测到您在“信息学”领域拥有高价值奖项。建议在考前 4 月份密切关注 <b>合肥一中/一六八中学 的科技类特长生招生简章</b>，该项荣誉极大提高录取通过率。<br /><br />同时发现您的抽象逻辑思维处于全省头部水平，这也是您平时数学、物理成绩稳定的内核支撑。在未来高中选科以及升学目标中，强烈推荐向“计算机科学、人工智能、微电子”等偏理学科倾斜。</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preference' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-2xl font-black text-slate-800">意向目标高中</h3>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <p className="text-sm text-slate-500 flex-1">
                                            请根据自身模考水平和主观意愿，最多勾选 <b>3 所</b> 您的意向高中作为志愿。AI 将根据您的排名和政策加分，全自动测算各梯队的录取胜率及填报风险。
                                        </p>
                                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm shrink-0">
                                            已选志愿：{userData.targetSchools?.length || 0} / 3
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            {
                                                id: 't1',
                                                name: '第一梯队 (顶尖名校 / 统招大本营)',
                                                bgClass: 'bg-red-50 border-red-100',
                                                titleClass: 'text-red-900',
                                                btnSelected: 'bg-red-600 text-white border-red-600',
                                                btnUnselected: 'bg-white border-red-200 text-red-700 hover:border-red-400',
                                                schools: ['合肥市第一中学', '合肥市第六中学', '合肥市第八中学', '合肥一六八中学']
                                            },
                                            {
                                                id: 't2',
                                                name: '第二梯队 (强势省示范 / 收分较高)',
                                                bgClass: 'bg-blue-50 border-blue-100',
                                                titleClass: 'text-blue-900',
                                                btnSelected: 'bg-blue-600 text-white border-blue-600',
                                                btnUnselected: 'bg-white border-blue-200 text-blue-700 hover:border-blue-400',
                                                schools: ['合肥市第七中学', '合肥市第九中学', '合肥市第十中学', '合肥北城中学', '中国科学技术大学附属中学', '合肥寿春中学', '肥东第一中学', '安徽省肥西中学', '长丰县第一中学']
                                            },
                                            {
                                                id: 't3',
                                                name: '第三梯队 (特色省市示范 / 优质民办保底)',
                                                bgClass: 'bg-slate-50 border-slate-200',
                                                titleClass: 'text-slate-800',
                                                btnSelected: 'bg-slate-700 text-white border-slate-700',
                                                btnUnselected: 'bg-white border-slate-300 text-slate-600 hover:border-slate-400',
                                                schools: ['合肥市第二中学', '合肥市第三中学', '合肥市第五中学', '合肥市第三十二中学', '合肥市第二十八中学', '合肥市第三十五中学', '合肥市包河中学', '合肥科学岛实验中学', '合肥八一学校', '肥东县第二中学', '肥东县撮镇中学', '肥东县众兴中学', '肥东石塘中学', '肥东县白龙中学', '肥东县古城中学', '肥东城关中学', '肥东艺术中学', '肥东义和尚真学校', '肥东新城高升学校', '肥东凯悦中学', '肥东锦弘中学', '肥东圣泉中学', '肥东长临河中学', '双凤高级中学', '双墩中学', '朱巷中学', '下塘中学', '合肥新康中学', '合肥长江中学', '肥西宏图中学', '肥西实验高级中学', '安徽省肥西山南中学', '安徽省肥西第三中学', '安徽省肥西农兴中学', '安徽省肥西第二中学']
                                            },
                                        ].map(tier => (
                                            <div key={tier.id} className={`p-6 rounded-3xl border ${tier.bgClass}`}>
                                                <h4 className={`font-black mb-4 ${tier.titleClass}`}>{tier.name}</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {tier.schools.map(school => {
                                                        const isSelected = userData.targetSchools?.includes(school);
                                                        return (
                                                            <button
                                                                key={school}
                                                                onClick={() => {
                                                                    const current = userData.targetSchools || [];
                                                                    if (current.includes(school)) {
                                                                        setUserData({ ...userData, targetSchools: current.filter(s => s !== school) });
                                                                    } else if (current.length < 3) {
                                                                        setUserData({ ...userData, targetSchools: [...current, school] });
                                                                    }
                                                                }}
                                                                disabled={!isSelected && (userData.targetSchools?.length || 0) >= 3}
                                                                className={`px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all border ${isSelected ? tier.btnSelected : tier.btnUnselected} ${!isSelected && (userData.targetSchools?.length || 0) >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                            >
                                                                {school}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white p-20 rounded-[3rem] shadow-sm text-center animate-in zoom-in-95">
                        <Loader2 className="mx-auto text-red-600 animate-spin mb-6" size={60} />
                        <h2 className="text-3xl font-black mb-2">正在测算考前最优路径...</h2>
                        <div className="mt-10 max-w-md mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 animate-progress w-full"></div>
                        </div>
                        <p className="mt-6 text-slate-400 font-medium">深度匹配校内排名与往年省示范投档线</p>
                        <button onClick={generateReport} className="mt-10 px-12 py-4 bg-slate-900 text-white rounded-2xl font-black">生成报告</button>
                    </div>
                )}

                {step === 3 && report && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                        {/* Range Banner */}
                        <div className={`bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden ${report.type === 'talent' ? 'ring-4 ring-amber-500/30' : ''}`}>
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Target size={240} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                                    <div className="text-center md:text-left">
                                        <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                                            <h2 className="text-4xl font-black italic">{report.title}</h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            <span className={`${report.type === 'talent' ? 'bg-amber-600' : 'bg-red-600'} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{report.badge}</span>
                                            <span className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black">{userData.district}区 · {userData.schoolRank}考生</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-center bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[120px]">
                                            <div className="text-[10px] text-slate-400 font-bold mb-1">中考保底线预估</div>
                                            <div className="text-3xl font-black">{report.range.min}</div>
                                        </div>
                                        <div className={`text-center p-4 rounded-2xl min-w-[120px] shadow-lg ${report.type === 'talent' ? 'bg-amber-600 shadow-amber-900/40' : 'bg-red-600 shadow-red-900/40'}`}>
                                            <div className={`text-[10px] font-bold mb-1 ${report.type === 'talent' ? 'text-amber-200' : 'text-red-200'}`}>超常发挥最高分</div>
                                            <div className="text-3xl font-black">{report.range.max}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                    <p className="text-lg text-slate-300 font-medium leading-relaxed italic">“{report.summary}”</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                {/* Historical Trend */}
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="text-xl font-black mb-8 flex items-center text-slate-800">
                                        <Activity className="mr-3 text-red-600" /> 历次大考成绩轨迹
                                    </h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={userData.historicalScores}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} />
                                                <YAxis domain={['dataMin - 20', 'dataMax + 20']} hide />
                                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} labelStyle={{ fontWeight: 'bold', color: '#1e293b' }} />
                                                <Line type="monotone" name="总分" dataKey="score" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Milestones */}
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="text-xl font-black mb-8 flex items-center text-slate-800">
                                        <Calendar className="mr-3 text-red-600" /> 考前关键时间轴提醒
                                    </h3>
                                    <div className="space-y-6">
                                        {report.milestones.map((m, i) => (
                                            <div key={i} className="flex gap-6 items-start group">
                                                <div className="shrink-0 w-24 text-center">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{m.date}</div>
                                                    <div className="w-full h-1 bg-slate-100 rounded-full group-hover:bg-red-500 transition-colors"></div>
                                                </div>
                                                <div className="flex-1 pb-6 border-b border-slate-50">
                                                    <h4 className="font-black text-slate-800 mb-1">{m.event}</h4>
                                                    <p className="text-sm text-slate-500">{m.action}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Subject Radar */}
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="text-xl font-black mb-8 flex items-center text-slate-800">
                                        <TrendingUp className="mr-3 text-red-600" /> 备考能力模型
                                    </h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={userData.mockScores}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
                                                <Radar
                                                    name="当前能力"
                                                    dataKey="score"
                                                    stroke="#ef4444"
                                                    fill="#ef4444"
                                                    fillOpacity={0.6}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 text-center font-medium italic">
                                        * 雷达图边缘代表满分，红色区域代表您当前的实力覆盖范围。
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Advice */}
                            <div className="space-y-6">
                                {/* Score Potential Bar Chart */}
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="text-xl font-black mb-6 text-slate-800">
                                        <Target className={`mr-3 inline ${report.type === 'talent' ? 'text-amber-500' : 'text-red-600'}`} /> 抢分空间诊断
                                    </h3>
                                    <div className="h-56 mb-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={userData.mockScores.map(s => ({ ...s, potential: s.full - s.score })).sort((a, b) => b.potential - a.potential).slice(0, 4)} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} width={50} />
                                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="potential" name="提分空间" fill={report.type === 'talent' ? "#fcd34d" : "#fca5a5"} radius={[0, 8, 8, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-xs font-bold ${report.type === 'talent' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                                        系统分析了您的各科得分率，列出失分最多的前4个科目。建议在考前按此优先级进行查漏补缺。
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="text-xl font-black mb-6 text-slate-800">
                                        <Zap className={`mr-3 inline ${report.type === 'talent' ? 'text-amber-500' : 'text-red-600'}`} /> 核心备考建议
                                    </h3>
                                    <div className="space-y-6">
                                        {report.advice.map((a, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">{a.icon}</div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-800">{a.title}</h4>
                                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{a.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`${report.type === 'talent' ? 'bg-amber-600 shadow-amber-200' : 'bg-red-600 shadow-red-200'} p-10 rounded-[2.5rem] text-white shadow-xl`}>
                                    <h4 className="font-black text-xl mb-4">{report.type === 'talent' ? '自招备考提示' : '特别提醒'}</h4>
                                    <p className="text-sm opacity-90 leading-relaxed mb-6">
                                        {report.type === 'talent'
                                            ? '科技特长生/自主招生极其看重校考机试（通常考查C++基础算法、项目经验等）。前期奖项只是敲门砖，决定能否拿到降分协议的关键在于5月的校考！'
                                            : <>安徽中考实行<b>“知分填志愿”</b>（除少数自主招生），目前的规划主要是为了锁定<b>目标学校范围</b>。</>
                                        }
                                    </p>
                                    <div className="p-4 bg-black/10 rounded-2xl text-xs">
                                        {report.type === 'talent' ? '建议：立刻对接往年校考真题，周末停止部分文化课补习，转为真题机考冲刺。' : '建议：二模后根据区排名再次校准本报告。'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <style>{`
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        .animate-progress { animation: progress 2s linear forwards; }
      `}</style>
        </div>
    );
};

export default App; 