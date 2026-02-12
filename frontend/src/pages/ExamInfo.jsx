import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Home, Search, Trophy, FileText, GraduationCap, Building2,
    Users, Calendar, Clock, Bookmark, Share2, TrendingUp,
    AlertCircle, Sparkles, Filter, ChevronRight, ExternalLink
} from 'lucide-react';

// 模拟数据
const examInfoData = [
    {
        id: 1,
        title: '2026年全国高中数学联赛报名通知',
        category: '竞赛',
        date: '2026-02-10',
        deadline: '2026-03-15',
        source: '中国数学会',
        summary: '面向高中生的全国性数学竞赛,分为一试和二试,获奖者可获得高校自主招生资格。报名截止3月15日。',
        tags: ['数学', '学科竞赛', '自主招生'],
        importance: 'high',
        aiRecommended: true,
        link: '#'
    },
    {
        id: 2,
        title: '2026年高考时间确定:6月7-9日',
        category: '考试',
        date: '2026-02-08',
        deadline: null,
        source: '教育部',
        summary: '教育部发布2026年普通高等学校招生全国统一考试时间安排,语文、数学、外语科目考试时间为6月7-8日,选考科目为6月9日。',
        tags: ['高考', '时间安排', '官方通知'],
        importance: 'high',
        aiRecommended: true,
        link: '#'
    },
    {
        id: 3,
        title: '强基计划2026年招生政策解读',
        category: '升学',
        date: '2026-02-05',
        deadline: '2026-04-30',
        source: '阳光高考平台',
        summary: '39所双一流高校继续实施强基计划,重点选拔培养有志于服务国家重大战略需求且综合素质优秀或基础学科拔尖的学生。',
        tags: ['强基计划', '招生政策', '双一流'],
        importance: 'high',
        aiRecommended: true,
        link: '#'
    },
    {
        id: 4,
        title: '清华大学2026年校园开放日活动',
        category: '院校',
        date: '2026-02-12',
        deadline: '2026-04-20',
        source: '清华大学招生办',
        summary: '清华大学将于4月20日举办校园开放日,届时将有专业介绍、实验室参观、招生政策咨询等活动,欢迎高三学生和家长参加。',
        tags: ['清华大学', '开放日', '招生咨询'],
        importance: 'medium',
        aiRecommended: false,
        link: '#'
    },
    {
        id: 5,
        title: '全国青少年信息学奥林匹克竞赛(NOI)通知',
        category: '竞赛',
        date: '2026-02-01',
        deadline: '2026-03-01',
        source: 'NOI组委会',
        summary: 'NOI2026将于7月举行,面向全国中学生,考察算法设计和编程能力。省级一等奖以上可获得保送资格。',
        tags: ['信息学', '编程', 'NOI'],
        importance: 'high',
        aiRecommended: true,
        link: '#'
    },
    {
        id: 6,
        title: '2026年艺术类专业招生办法调整',
        category: '招生',
        date: '2026-01-28',
        deadline: null,
        source: '教育部',
        summary: '进一步完善艺术类专业考试招生办法,2026年起,艺术史论、戏剧影视文学等专业不再组织专业能力考试,直接依据考生高考文化课成绩录取。',
        tags: ['艺术类', '招生改革', '政策调整'],
        importance: 'medium',
        aiRecommended: false,
        link: '#'
    },
    {
        id: 7,
        title: '北京大学人工智能专业介绍及就业前景',
        category: '院校',
        date: '2026-02-11',
        deadline: null,
        source: '北京大学',
        summary: '北大人工智能专业培养具有扎实数理基础和AI核心技术的复合型人才,毕业生就业率100%,平均起薪30万+。',
        tags: ['北京大学', '人工智能', '专业介绍'],
        importance: 'medium',
        aiRecommended: true,
        link: '#'
    },
    {
        id: 8,
        title: '2026年高校专项计划招生启动',
        category: '升学',
        date: '2026-02-09',
        deadline: '2026-04-25',
        source: '教育部',
        summary: '重点高校面向农村和贫困地区学生的专项招生计划启动,符合条件的考生可在4月25日前完成报名。',
        tags: ['专项计划', '农村学生', '招生'],
        importance: 'high',
        aiRecommended: false,
        link: '#'
    },
    {
        id: 9,
        title: '全国中学生物理竞赛决赛名单公布',
        category: '竞赛',
        date: '2026-02-06',
        deadline: null,
        source: '中国物理学会',
        summary: '第39届全国中学生物理竞赛决赛入围名单公布,共500名选手进入决赛,将于3月在杭州举行。',
        tags: ['物理', '竞赛决赛', '获奖名单'],
        importance: 'medium',
        aiRecommended: false,
        link: '#'
    }
];

export default function ExamInfo() {
    const [activeCategory, setActiveCategory] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['全部', '竞赛', '考试', '升学', '院校', '招生'];

    const filteredData = examInfoData.filter(item => {
        const matchCategory = activeCategory === '全部' || item.category === activeCategory;
        const matchSearch = item.title.includes(searchTerm) || item.summary.includes(searchTerm);
        return matchCategory && matchSearch;
    });

    const aiRecommendedItems = examInfoData.filter(item => item.aiRecommended).slice(0, 3);
    const urgentItems = examInfoData.filter(item => item.deadline && new Date(item.deadline) - new Date() < 30 * 24 * 60 * 60 * 1000).slice(0, 3);

    const getCategoryColor = (category) => {
        const colors = {
            '竞赛': 'bg-purple-100 text-purple-700 border-purple-200',
            '考试': 'bg-blue-100 text-blue-700 border-blue-200',
            '升学': 'bg-green-100 text-green-700 border-green-200',
            '院校': 'bg-orange-100 text-orange-700 border-orange-200',
            '招生': 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getImportanceIcon = (importance) => {
        if (importance === 'high') {
            return <AlertCircle className="text-red-500" size={16} />;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航栏 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                                    <GraduationCap size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">中高考信息分析</h1>
                            </div>
                            <div className="relative w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="搜索竞赛、考试、升学信息..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
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
                <div className="flex gap-8">
                    {/* 主内容区 */}
                    <div className="flex-1">
                        {/* 分类标签 */}
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl transition-all ${activeCategory === cat
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* 信息卡片网格 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredData.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(item.category)}`}>
                                                {item.category}
                                            </span>
                                            {item.aiRecommended && (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-xs font-medium">
                                                    <Sparkles size={12} />
                                                    AI推荐
                                                </span>
                                            )}
                                        </div>
                                        {getImportanceIcon(item.importance)}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.summary}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {item.date}
                                            </span>
                                            {item.deadline && (
                                                <span className="flex items-center gap-1 text-red-600 font-medium">
                                                    <Clock size={14} />
                                                    截止 {item.deadline}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="收藏">
                                                <Bookmark size={16} />
                                            </button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="分享">
                                                <Share2 size={16} />
                                            </button>
                                            <a href={item.link} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="查看详情">
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                        来源: {item.source}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredData.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                <p>暂无相关信息</p>
                            </div>
                        )}
                    </div>

                    {/* 右侧边栏 */}
                    <div className="w-80 space-y-6">
                        {/* AI 推荐 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-purple-600" size={20} />
                                <h3 className="font-bold text-gray-900">AI 智能推荐</h3>
                            </div>
                            <div className="space-y-3">
                                {aiRecommendedItems.map(item => (
                                    <div key={item.id} className="bg-white rounded-xl p-3 hover:shadow-sm transition-shadow cursor-pointer">
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 即将截止 */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-red-600" size={20} />
                                <h3 className="font-bold text-gray-900">即将截止</h3>
                            </div>
                            <div className="space-y-3">
                                {urgentItems.map(item => (
                                    <div key={item.id} className="border-l-4 border-red-500 pl-3 py-2">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.title}</p>
                                        <p className="text-xs text-red-600 font-medium">截止: {item.deadline}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 热门标签 */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">热门标签</h3>
                            <div className="flex flex-wrap gap-2">
                                {['数学', '物理', '强基计划', '自主招生', '高考', '竞赛', '清华', '北大', '人工智能', '艺术类'].map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs cursor-pointer transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
