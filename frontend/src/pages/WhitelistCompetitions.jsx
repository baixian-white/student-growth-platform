import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen,  Home, Search, TrendingUp, Target, Cpu, Award, Globe, Rocket, Lightbulb, MapPin, Calendar, ArrowRight, X } from 'lucide-react';

const competitionsData = [
    {
        title: "全国青少年科技创新大赛 (CASTIC)",
        host: "中国科协",
        targets: "普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "https://castic.cyscc.org/",
        icon: <Lightbulb className="text-amber-500" size={24} />,
        bg: "bg-amber-50",
        internalRoute: "/competition/castic"
    },
    {
        title: "全国青少年航天创新大赛",
        host: "中国航天科技国际交流中心",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://nysaic.buaa.edu.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50",
        internalRoute: "/competition/space-innovation"
    },
    {
        title: "世界机器人大会青少年机器人设计与信息素养大赛",
        host: "中国电子学会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.worldrobotconference.com/",
        icon: <Cpu className="text-teal-500" size={24} />,
        bg: "bg-teal-50"
    },
    {
        title: "全国青少年无人机大赛",
        host: "中国航空学会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.kjtcsw.com/baimingdan/wurenji/",
        icon: <Target className="text-cyan-500" size={24} />,
        bg: "bg-cyan-50"
    },
    {
        title: "全国青少年人工智能创新挑战赛",
        host: "中国少年儿童发展服务中心",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://aiic.china-caa.org/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "宋庆龄少年儿童发明奖",
        host: "中国宋庆龄基金会、中国发明协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://sclcf.org.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生天文知识竞赛",
        host: "中国天文学会",
        targets: "初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "#",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "“地球小博士”全国地理科普知识大赛活动",
        host: "中国地理学会",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.geoscience.net.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生水科技发明比赛暨斯德哥尔摩青少年水奖中国区选拔赛",
        host: "生态环境部宣传教育中心、水利部宣传教育中心",
        targets: "小学、初中、普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "#",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生地球科学奥林匹克竞赛",
        host: "中国地震学会、中国地球物理学会",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "https://ceso.ssoc.org.cn/saishigonggao/shownews.php?lang=cn&amp;id=638",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生数学奥林匹克竞赛",
        host: "中国数学会",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.cms.org.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生物理奥林匹克竞赛",
        host: "中国物理学会",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.cpho.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生化学奥林匹克竞赛",
        host: "中国化学会",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.chemsoc.org.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生生物学奥林匹克竞赛",
        host: "中国植物学会、中国动物学会",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.zmnh.com/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国中学生信息学奥林匹克竞赛",
        host: "中国计算机学会",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "https://www.noi.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50",
        internalRoute: "/informatics-olympiad"
    },
    {
        title: "丘成桐中学科学奖",
        host: "清华大学",
        targets: "普通高中",
        level: "白名单赛事 (自然科学素养类)",
        url: "#",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全球发明大会（中国）竞赛活动",
        host: "中国友好和平发展基金会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "https://cn.weforum.org/press/2025/01/quanqiu-fengxian-baogao-2025/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国青少年人工智能大赛",
        host: "中国少年儿童发展服务中心",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://aiic.china61.org.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国青少年科学实验能力大赛",
        host: "中国教育装备行业协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "https://www.ceeia.cn/kxsy/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国青少年科学探究建模能力大赛",
        host: "北京师范大学",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "https://www.gfbzb.gov.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国青少年心理成长知识与应用创新大赛",
        host: "中国心理卫生协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "http://www.camh-edu.org.cn/",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国青少年安全与应急科普创新大赛",
        host: "中国灾害防御协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (自然科学素养类)",
        url: "https://www.nyseic.cn/home/preview",
        icon: <Rocket className="text-blue-500" size={24} />,
        bg: "bg-blue-50"
    },
    {
        title: "全国青少年禁毒知识竞赛",
        host: "中国禁毒基金会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "http://www.nncc626.com/20251111/ee87c13d3a20443190546824eef5b592/c.html",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "世界华人学生作文大赛",
        host: "中华全国归国华侨联合会、中华全国台湾同胞联谊会",
        targets: "普通高中",
        level: "白名单赛事 (人文综合素养类)",
        url: "#",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "“外研社杯”全国中学生外语素养大赛",
        host: "北京外国语大学",
        targets: "普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://events.fltrp.com/",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "高中生创新能力大赛",
        host: "中国老教授协会",
        targets: "普通高中",
        level: "白名单赛事 (人文综合素养类)",
        url: "#",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "全国中学生环境保护优秀作文征集活动",
        host: "中华环保联合会",
        targets: "普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://www.gfbzb.gov.cn/",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "“美丽中国”全国版图知识竞赛（中小学组）",
        host: "自然资源部宣传教育中心",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://zh.hinative.com/questions/5615773",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "全国青少年劳动技能与智能设计大赛",
        host: "中国自动化学会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://aild.caa.org.cn/cn/web/index/",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "中华诗词美育大赛",
        host: "中华诗词学会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://zhscmyds.com/shici/",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "鲁迅青少年文学大赛",
        host: "鲁迅文化基金会",
        targets: "普通高中",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://www.luxunwenxue.com/home",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "全国青少年红色文化传承与实践创新大赛",
        host: "中国红色文化研究会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://www.hswhds.com/",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "“讲好中国故事”全国中小学语言素养大赛",
        host: "中国教育电视协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "#",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "同颂中华·全国青少年志愿文学创作与诵读大赛",
        host: "中国青年报社",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (人文综合素养类)",
        url: "https://news.cyol.com/gb/articles/2026-01/07/content_BbWLJqFlY7.html",
        icon: <Globe className="text-emerald-500" size={24} />,
        bg: "bg-emerald-50"
    },
    {
        title: "全国中小学生绘画书法作品比赛",
        host: "中国儿童中心（全国妇联儿童事业发展集团）",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "https://www.ccc.org.cn/col/col281/index.html",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "“我爱祖国海疆”全国青少年航海模型教育竞赛",
        host: "中国航海模型运动协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "#",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "“驾驭未来”全国青少年车辆模型教育竞赛",
        host: "中国车辆模型运动协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "#",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "全国青少年模拟飞行锦标赛",
        host: "国家体育总局航空无线电模型运动管理中心",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "https://www.gfbzb.gov.cn/",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "“飞向北京·飞向太空”全国青少年航空航天模型教育竞赛活动",
        host: "中国航空运动协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "https://www.sport.gov.cn/hgzx/n15154/c28801884/content.html",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "全国青少年传统体育项目比赛",
        host: "中国青少年宫协会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "https://www.gfbzb.gov.cn/",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "“希望颂”——全国青少年书画艺术大展",
        host: "中国国际书画艺术研究会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "http://gjshyjh.com/",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "全国中小学生海洋文化创意设计大赛",
        host: "中国海洋发展基金会、中国海洋大学、自然资源部北海局",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "https://www.gfbzb.gov.cn/",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "全国青少年国防素养大赛",
        host: "南京理工大学",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "http://www.gfsy.org.cn/",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "“戏剧中国”全国青少年戏剧文化艺术大赛",
        host: "中国戏剧文学学会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "#",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "全国青少年人工智能辅助生成数字艺术创作者大赛",
        host: "中国福利会、中国妇女发展基金会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "https://www.gfbzb.gov.cn/",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "学校美育助力行动——青少年视觉艺术传承与创新工作坊展示",
        host: "中国艺术教育促进会",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "#",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    },
    {
        title: "“常青藤”全国青少年校园戏剧创意大赛",
        host: "中央戏剧学院",
        targets: "小学、初中、普通高中、中职",
        level: "白名单赛事 (艺术体育类)",
        url: "#",
        icon: <Award className="text-pink-500" size={24} />,
        bg: "bg-pink-50"
    }
];

const priorityKeywords = ["人工智能", "科技", "机器", "奥林匹克", "信息学", "航天", "太空", "芯片", "软件", "编程", "无人机", "科学"];

competitionsData.sort((a, b) => {
    const getScore = (comp) => {
        let score = 0;
        if (comp.title.includes("CASTIC")) score += 100;
        if (comp.title.includes("航天创新")) score += 90;

        priorityKeywords.forEach(kw => {
            if (comp.title.includes(kw)) score += 10;
            if (comp.host && comp.host.includes(kw)) score += 5;
            if (comp.targets && comp.targets.includes(kw)) score += 5;
        });
        return score;
    };
    return getScore(b) - getScore(a);
});

export default function WhitelistCompetitions() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCompetitions = competitionsData.filter(comp => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return comp.title.toLowerCase().includes(lowerSearch) ||
            (comp.host && comp.host.toLowerCase().includes(lowerSearch)) ||
            (comp.targets && comp.targets.toLowerCase().includes(lowerSearch)) ||
            comp.level.toLowerCase().includes(lowerSearch);
    });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 selection:bg-blue-500/30 font-sans">
            {/* 顶部导航栏 */}
            <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md">
                                    <Award size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-wide">白名单赛事</h1>
                            </div>

                            {/* 系统内导航切换 */}
                            <div className="ml-8 flex flex-wrap bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50">
                                <Link to="/exam-info" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </Link>
                                <Link to="/exam-analysis" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} />信息分析
                                    </div>
                                </Link>
                                <Link to="/strong-base" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} />强基计划
                                    </div>
                                </Link>
                                <Link to="/tech-specialty" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={16} />科技特长生
                                    </div>
                                </Link>
                                <Link to="/informatics-olympiad" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={16} />信息学奥赛
                                    </div>
                                </Link>
                                <div className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-blue-600 shadow-sm border border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} />白名单赛事
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-transparent rounded-xl transition-all text-gray-600 hover:text-gray-900 flex-shrink-0 group">
                            <Home size={18} className="group-hover:text-blue-600 transition-colors" />
                            <span className="text-sm font-medium">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* Header 简介区 */}
                <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 opacity-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 opacity-50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                    {/* Minimal Grid pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCA0MEwwIDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-60 z-0 pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl text-left">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-200">
                            教育部权威认证
                        </span>
                        <h2 className="text-4xl font-extrabold mb-4 leading-tight text-gray-900">
                            教育部白名单赛事
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-light">
                            教育部办公厅发布的面向中小学生的全国性竞赛活动名单。这些赛事经过严格评审，具有极高的权威性和科技含金量，是学生综合素质评价、强基计划的重要指标。
                        </p>
                    </div>
                </div>

                {/* 赛事列表 */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-200 text-left relative">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                                <Award className="text-blue-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-wide">核心赛事介绍</h2>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="检索科技、创新、航天等赛事..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredCompetitions.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center text-gray-500 bg-white rounded-3xl border border-gray-200 shadow-sm border-dashed relative overflow-hidden">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 relative z-10">
                                <Search className="text-blue-400" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">未扫描到匹配数据</h3>
                            <p className="text-gray-500 relative z-10">数据库中未包含与 "{searchTerm}" 相关的赛事指令。</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-8 px-6 py-2.5 bg-white border border-gray-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm relative z-10"
                            >
                                重置扫描协议
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredCompetitions.map((comp, idx) => {
                                const isInternal = !!comp.internalRoute;
                                return (
                                    <a
                                        key={idx}
                                        href={isInternal ? undefined : comp.url}
                                        target={isInternal ? undefined : "_blank"}
                                        rel={isInternal ? undefined : "noopener noreferrer"}
                                        onClick={(e) => {
                                            if (isInternal) {
                                                e.preventDefault();
                                                navigate(comp.internalRoute);
                                            }
                                        }}
                                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-400/50 transition-all duration-300 flex flex-col group block text-left cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div className="flex items-center justify-between mb-5 relative z-10">
                                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                                <div className="scale-110 drop-shadow-sm">
                                                    {comp.icon}
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 shadow-sm">
                                                {comp.level}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors relative z-10 tracking-wide">
                                            {comp.title}
                                        </h3>

                                        <div className="text-gray-600 text-sm leading-relaxed flex-grow space-y-2.5 relative z-10">
                                            <div className="flex items-start gap-2">
                                                <span className="font-bold text-gray-800 whitespace-nowrap">主办单位：</span>
                                                <span className="text-gray-600">{comp.host}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="font-bold text-gray-800 whitespace-nowrap">对等学段：</span>
                                                <span className="text-gray-600">{comp.targets}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 text-blue-600 text-sm font-bold flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10 translate-y-2 group-hover:translate-y-0">
                                            <span className="tracking-widest uppercase text-xs">Access Data</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
