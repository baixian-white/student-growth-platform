import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, TrendingUp, Target, Cpu, Award, Globe, Rocket, Lightbulb, MapPin, Calendar, ArrowRight, X } from 'lucide-react';

const competitionsData = [
    {
        title: "全国青少年科技创新大赛 (CASTIC)",
        level: "T1 钻石级",
        desc: "（白名单赛事核心）国内目前面向中小学生开展的规模最大、层次最高、最具导向性的科技活动。历经选题、实验、论文与答辩的完整科研挑战，在综合评价（三位一体）和强基计划中含金量极高，是顶尖名校理工科入场券的有力背书。",
        url: "http://www.kjtcsw.com/baimingdan/castic/1240.html",
        icon: <Lightbulb className="text-amber-500" size={24} />,
        bg: "bg-amber-50",
        detailContent: (
            <div className="space-y-4 text-sm text-gray-700">
                <p><strong>赛事定位与背景：</strong>该赛事是教育部办公厅公布的面向中小学生的全国性竞赛活动名单（白名单）中的核心赛事。是一项青少年科技创新成果和科学探究项目的综合性科技竞赛，是目前国内面向在校中小学生开展的规模最大、层次最高、具有最强示范性和导向性的科技教育活动。其获奖成绩备受重点学校重视，是各大高校《科技特长生招生简章》中明确认可的核心赛事之一。</p>
                <p><strong>主办单位：</strong>由教育委员会、科学技术协会、科学和信息化委员会等官方部门联合主办。</p>
                <p><strong>竞赛内容与项目分类：</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>小学生科技创新成果竞赛：鼓励小学生进行科学探究和发明创造。</li>
                    <li>中学生科技创新成果竞赛：涵盖自然科学各学科领域，要求学生提交高质量的科研论文或科技作品。</li>
                    <li>少年儿童科学幻想绘画比赛：培养青少年的想象力与艺术创造力。</li>
                    <li>青少年科技实践活动比赛：以团队形式开展，强调社会实践、环境考察等综合实践能力。</li>
                    <li>科技辅导员科技创新成果竞赛：面向指导老师，鼓励科教具制作与教学方法创新。</li>
                </ul>
                <p><strong>赛程安排（参考周期）：</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>区级比赛报名与选拔：通常在每年的 11月至次年1月。</li>
                    <li>市/省级比赛报名与选拔：通常在次年的 12月至次年2月。</li>
                    <li>全国赛报名与终评：通常在次年的 3月至5月 进行申报，并于夏季进行终审展示。</li>
                </ul>
            </div>
        )
    },
    {
        title: "全国青少年航天创新大赛",
        level: "T1 钻石级",
        desc: "（白名单赛事重点）经教育部批准，以航天科技与工程实践为主轴的顶级评比。涵盖航天器设计、无人操控、智能机器人对抗等硬核项目，着重考察机械设计与软件编程。在航天系统高校（如北航、北理、哈工大）的升学选拔中具有显著的背景加持。",
        url: "http://www.kjtcsw.com/baimingdan/htcxds/1163.html",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中小学信息技术创新与实践大赛 (NOC)",
        level: "T2 铂金级",
        desc: "（白名单赛事之一）相对门槛较低的普惠性科创赛。适合初入门玩家作为第一步刷简历用，在部分省级示范高中也有降分录取空间。",
        url: "http://www.kjtcsw.com/baimingdan/noc/",
        icon: <Cpu className="text-indigo-500" size={24} />,
        bg: "bg-indigo-50"
    },
    {
        title: "世界机器人大会青少年机器人设计与信息素养大赛",
        level: "白名单赛事",
        desc: "激发青少年对机器人技术的兴趣，培养动手实践能力和创新精神。",
        url: "http://www.kjtcsw.com/baimingdan/zncxds/",
        icon: <Cpu className="text-teal-500" size={24} />,
        bg: "bg-teal-50"
    },
    {
        title: "全国青少年科技教育成果展示大赛",
        level: "白名单赛事",
        desc: "展示青少年科技教育最新成果，搭建青少年交流学习的平台。",
        url: "http://www.kjtcsw.com/baimingdan/cxtzs/",
        icon: <Award className="text-rose-500" size={24} />,
        bg: "bg-rose-50"
    },
    {
        title: "蓝桥杯全国软件和信息技术专业人才大赛",
        level: "白名单赛事",
        desc: "国内权威的IT类专业赛事，致力于培养和选拔优秀的软件和信息技术人才。",
        url: "http://www.kjtcsw.com/kaoshi/lanqiaobei/",
        icon: <Cpu className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国青少年无人机大赛",
        level: "白名单赛事",
        desc: "推动无人机技术在青少年中的普及，培养航空兴趣和创新能力。",
        url: "http://www.kjtcsw.com/baimingdan/wurenji/",
        icon: <Target className="text-cyan-500" size={24} />,
        bg: "bg-cyan-50"
    },
    {
        title: "飞北赛 (全国青少年航空航天模型教育竞赛活动)",
        level: "白名单赛事",
        desc: "历史悠久的航空航天模型教育竞赛活动，引导青少年探究航空航天奥秘。",
        url: "http://www.kjtcsw.com/baimingdan/feibei/",
        icon: <Rocket className="text-orange-500" size={24} />,
        bg: "bg-orange-50"
    },
    {
        title: "青少年创意编程与智能设计大赛",
        level: "白名单赛事",
        desc: "以创意编程和智能设计为核心，培养青少年的计算思维和创新能力。",
        url: "http://www.kjtcsw.com/baimingdan/bcsjds/",
        icon: <Cpu className="text-purple-500" size={24} />,
        bg: "bg-purple-50"
    },
    {
        title: "全国青少年车辆模型教育竞赛",
        level: "白名单赛事",
        desc: "通过车辆模型的设计、制作和竞技，培养青少年的工程素养与实践能力。",
        url: "http://www.kjtcsw.com/baimingdan/chemo/",
        icon: <Target className="text-amber-500" size={24} />,
        bg: "bg-amber-50"
    },
    {
        title: "全国青少年航海模型教育竞赛",
        level: "白名单赛事",
        desc: "旨在普及国防知识，增强青少年海洋意识，培养科学探究精神与动手实践能力。",
        url: "http://www.kjtcsw.com/baimingdan/haimo/",
        icon: <Globe className="text-teal-500" size={24} />,
        bg: "bg-teal-50"
    },
    {
        title: "USACO (美国计算机奥林匹克竞赛)",
        level: "高含金量国际赛",
        desc: "全球知名的计算机竞赛，采用在线比赛形式，为算法和编程爱好者提供顶级竞技平台。",
        url: "http://www.kjtcsw.com/jingsai/USACO/",
        icon: <Globe className="text-indigo-500" size={24} />,
        bg: "bg-indigo-50"
    },
    {
        title: "FLL (世界青少年机器人挑战赛)",
        level: "高含金量国际赛",
        desc: "由FIRST机构与乐高集团合作举办，鼓励孩子们用科学的方式调查和解决现实世界中的问题。",
        url: "http://www.kjtcsw.com/jingsai/fll/",
        icon: <Target className="text-rose-500" size={24} />,
        bg: "bg-rose-50"
    },
    {
        title: "Botball (国际机器人工程挑战赛)",
        level: "高含金量国际赛",
        desc: "发源于麻省理工学院(MIT)，强调自主机器人的设计和编程，全方位锻炼STEAM综合素质。",
        url: "http://www.kjtcsw.com/jingsai/Botball/",
        icon: <Cpu className="text-amber-500" size={24} />,
        bg: "bg-amber-50"
    }
];

export default function WhitelistCompetitions() {
    const [selectedComp, setSelectedComp] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 顶部导航栏 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                    <Award size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">白名单赛事</h1>
                            </div>

                            {/* 系统内导航切换 */}
                            <div className="ml-8 flex flex-wrap bg-gray-100 p-1 rounded-xl">
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
                                <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-orange-700 shadow-sm border border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} />白名单赛事
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700 flex-shrink-0">
                            <Home size={18} />
                            <span className="text-sm font-medium">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* Header 简介区 */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 max-w-2xl text-left">
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                            教育部权威认证
                        </span>
                        <h2 className="text-4xl font-extrabold mb-4 leading-tight">教育部白名单赛事</h2>
                        <p className="text-orange-50 text-lg leading-relaxed">
                            教育部办公厅发布的面向中小学生的全国性竞赛活动名单。这些赛事经过严格评审，具有极高的权威性和含金量，是学生升学、评优的重要参考。
                        </p>
                    </div>
                </div>

                {/* 赛事列表 */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200 text-left">
                        <Award className="text-orange-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">核心赛事介绍</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {competitionsData.map((comp, idx) => {
                            const isInternal = !!comp.detailContent;
                            return (
                                <a
                                    key={idx}
                                    href={isInternal ? undefined : comp.url}
                                    target={isInternal ? undefined : "_blank"}
                                    rel={isInternal ? undefined : "noopener noreferrer"}
                                    onClick={(e) => {
                                        if (isInternal) {
                                            e.preventDefault();
                                            setSelectedComp(comp);
                                        }
                                    }}
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 flex flex-col group block text-left cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${comp.bg}`}>
                                            {comp.icon}
                                        </div>
                                        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                                            {comp.level}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                        {comp.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                                        {comp.desc}
                                    </p>
                                    <div className="mt-5 text-orange-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        查看详情 <ArrowRight size={14} />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedComp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSelectedComp(null)}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${selectedComp.bg}`}>
                                    {selectedComp.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedComp.title}</h3>
                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100 inline-block mt-1">
                                        {selectedComp.level}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedComp(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 text-left">
                            {selectedComp.detailContent}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                                <a
                                    href={selectedComp.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 bg-orange-600 text-white text-sm font-medium rounded-xl hover:bg-orange-700 transition-colors flex items-center gap-2"
                                >
                                    去官网查看原通知 <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
