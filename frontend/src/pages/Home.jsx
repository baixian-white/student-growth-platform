import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, ChevronRight, GraduationCap, BookOpen, Award } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* 导航栏 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                智
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                智慧教育平台
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                首页
                            </Link>
                            <Link to="/exam-info" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                升学政策资讯库
                            </Link>
                            <Link to="/guihua" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                AI升学规划平台
                            </Link>
                            <Link to="/type-of-class" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                班型分析
                            </Link>
                            <Link to="/team-info" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                团队介绍
                            </Link>

                        </div>
                    </div>
                </div>
            </nav>

            {/* 主内容区 */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero 区域 */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        欢迎使用智慧教育平台
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        基于数据驱动的智能教学管理系统，助力教育现代化
                    </p>
                </div>

                {/* 功能卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-16">
                    {/* 升学政策资讯库卡片 */}
                    <Link to="/exam-info" className="group h-full block">
                        <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
                                <GraduationCap className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 shrink-0">升学政策资讯库</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                AI智能聚合竞赛、考试、升学政策,实时掌握教育资讯动态
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all shrink-0">
                                进入系统
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* AI 升学规划卡片 */}
                    <Link to="/guihua" className="group h-full block">
                        <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
                                <TrendingUp className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 shrink-0">AI升学规划平台</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                基于大数据的中高考升学全维度深度匹配与路径规划
                            </p>
                            <div className="flex items-center text-red-600 font-semibold group-hover:gap-3 gap-2 transition-all shrink-0">
                                开始规划
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* 班型分析卡片 */}
                    <Link to="/type-of-class" className="group h-full block">
                        <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
                                <BookOpen className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 shrink-0">班型分析</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                聚焦名校班型设置、校区结构与培养路径,快速匹配适合的发展方向
                            </p>
                            <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-3 gap-2 transition-all shrink-0">
                                查看详情
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* 团队介绍卡片 */}
                    <Link to="/team-info" className="group h-full block">
                        <div className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
                                <Users className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 shrink-0">团队介绍</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                了解我们的专家团队,AI算法、教育政策、数据分析领域精英
                            </p>
                            <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-3 gap-2 transition-all shrink-0">
                                进入系统
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 核心驱动力 / AI 引擎优势 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">AI 核心引擎赋能体系</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <BarChart3 size={28} />
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3">多维雷达定位算法</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">基于合肥中考历年真实录取分数线与指标到校数据，精确换算模考全区排名，科学锁定并匹配目标高中梯队。</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                    <Award size={28} />
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3">特长与强基双轨推演</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">独立解析科技特长生与强基计划综评的降分录取政策，为您智能切分并规划裸分统招之外的高收益升学赛道。</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <BookOpen size={28} />
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3">新政与考情全息同步</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">实时聚合最新初升高730招考政策、白名单赛事规则及省示范名校招生简章，彻底消除考前家长的升学信息差。</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 页脚 */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center text-gray-500 text-sm">
                        © 2026 智慧教育平台 | Powered by React + Vite + Tailwind CSS
                    </div>
                </div>
            </footer>
        </div>
    );
}
