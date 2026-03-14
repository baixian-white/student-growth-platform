import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, ChevronRight, BookOpen, Award } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                智
                            </div>
                            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                智慧教育平台
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base">
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                首页
                            </Link>
                            <Link to="/platform" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                AI升学规划平台
                            </Link>
                            <Link to="/team-info" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                                团队介绍
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                        欢迎使用智慧教育平台
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        基于数据驱动的智能教育服务，提供升学资讯、路径规划与决策支持
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 mb-16">
                    <Link to="/platform" className="group h-full block">
                        <div className="flex flex-col h-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
                                <TrendingUp className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 shrink-0">AI升学规划平台</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                一个平台统一承载两大模块：升学政策资讯库 + AI一键规划，先看政策，再做决策。
                            </p>
                            <div className="flex items-center text-red-600 font-semibold group-hover:gap-3 gap-2 transition-all shrink-0">
                                进入平台
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>

                    <Link to="/team-info" className="group h-full block">
                        <div className="flex flex-col h-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shrink-0">
                                <Users className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 shrink-0">团队介绍</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                                了解我们的专家团队与产品理念，覆盖教育政策、数据分析和AI应用。
                            </p>
                            <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-3 gap-2 transition-all shrink-0">
                                进入系统
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">AI 核心引擎赋能体系</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <BarChart3 size={28} />
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3">多维数据定位算法</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">基于历年真实录取数据与趋势分析，精准估算目标区间，提升择校决策效率。</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                    <Award size={28} />
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3">特长与强基双轨建议</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">联动科技特长生、强基计划与综合评价规则，给出清晰可执行的升学路径建议。</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <BookOpen size={28} />
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-3">政策与资讯持续同步</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">实时聚合新政、招生简章和竞赛动态，帮助家庭第一时间把握关键升学窗口。</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="text-center text-gray-500 text-sm">
                        © 2026 智慧教育平台 | Powered by React + Vite + Tailwind CSS
                    </div>
                </div>
            </footer>
        </div>
    );
}
