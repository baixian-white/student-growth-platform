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
                            <Link to="/analytics" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                学情分析
                            </Link>
                            <Link to="/exam-info" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                学生升学规划平台
                            </Link>
                            <Link to="/team-info" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                团队介绍
                            </Link>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                                陈
                            </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* 学情分析卡片 */}
                    <Link to="/analytics" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">学情分析</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                全方位学生数据分析，智能诊断学习状况，提供个性化教学建议
                            </p>
                            <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                                进入系统
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* 中高考信息卡片 */}
                    <Link to="/exam-info" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <GraduationCap className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">学生升学规划平台</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                AI智能聚合竞赛、考试、升学政策,实时掌握教育资讯动态
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                                进入系统
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* 团队介绍卡片 */}
                    <Link to="/team-info" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">团队介绍</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                了解我们的专家团队,AI算法、教育政策、数据分析领域精英
                            </p>
                            <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                                进入系统
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                    {/* 信息学奥赛卡片 */}
                    <Link to="/informatics-olympiad" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">信息学奥赛</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                NOI 全国青少年信息学奥林匹克动态、官方咨询与历年省市核心数据
                            </p>
                            <div className="flex items-center text-amber-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                                查看资料库
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                </div>

                {/* 数据统计 */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">平台数据概览</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-3">
                                <Users className="text-indigo-600" size={32} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">1,245</div>
                            <div className="text-gray-600">在校学生</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-3">
                                <TrendingUp className="text-emerald-600" size={32} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">85.6%</div>
                            <div className="text-gray-600">平均成绩</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-3">
                                <BookOpen className="text-purple-600" size={32} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">328</div>
                            <div className="text-gray-600">课程资源</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-3">
                                <Award className="text-amber-600" size={32} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
                            <div className="text-gray-600">优秀学生</div>
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
