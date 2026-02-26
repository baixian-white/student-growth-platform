import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Rocket, FileText, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import spaceInnovationMd from '../docs/space-innovation.md?raw';
import casticMd from '../docs/castic.md?raw';
import qgqksMd from '../docs/qgqks.md?raw';
import nocMd from '../docs/noc.md?raw';

export default function CompetitionDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    // In a real application, we would fetch content based on the `id`.
    // For now we map 'space-innovation' to our markdown file.
    let content = null;
    let title = "赛事详情";
    let icon = <FileText className="text-gray-500" size={24} />;
    let bg = "bg-gray-50";

    if (id === 'space-innovation') {
        content = spaceInnovationMd;
        title = "全国青少年航天创新大赛";
        icon = <Rocket className="text-blue-500" size={24} />;
        bg = "bg-blue-50";
    } else if (id === 'castic') {
        content = casticMd;
        title = "全国青少年科技创新大赛";
        icon = <FileText className="text-amber-500" size={24} />;
        bg = "bg-amber-50";
    } else if (id === 'qgqks') {
        content = qgqksMd;
        title = "全国青少年科技教育成果展示大赛";
        icon = <Award className="text-rose-500" size={24} />;
        bg = "bg-rose-50";
    } else if (id === 'noc') {
        content = nocMd;
        title = "全国中小学信息技术创新与实践大赛";
        icon = <Rocket className="text-indigo-500" size={24} />;
        bg = "from-indigo-600 to-purple-800";
    }

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">未找到赛事信息</h2>
                    <p className="text-slate-500 mb-8">您请求的赛事内容不存在或已被移除。</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium flex justify-center items-center gap-2"
                    >
                        <ArrowLeft size={18} /> 返回上一页
                    </button>
                </div>
            </div>
        );
    }

    // Default gradient if bg is just a background color class format
    const isGradient = bg.includes('from-');
    const heroBg = isGradient ? bg : "from-blue-600 to-indigo-800"; // Fallback premium gradient

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Dynamic Hero Section */}
            <div className={`relative pt-20 pb-32 lg:pt-28 lg:pb-48 bg-gradient-to-br ${heroBg} overflow-hidden`}>
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-2xl" />

                    {/* SVG Dot Pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dot-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="2" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="group mb-8 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all duration-300 border border-white/20 text-sm font-medium shadow-lg hover:shadow-xl hover:-translate-x-1"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        返回赛事中心
                    </button>

                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 mt-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl flex items-center justify-center p-4 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                            {/* Force icon icon to be white in hero */}
                            <div className="text-white scale-150 drop-shadow-md">
                                {icon}
                            </div>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-lg border border-white/30 mb-4 tracking-wider uppercase drop-shadow-sm">
                                教育部白名单赛事
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg max-w-3xl">
                                {title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glowing Glassmorphism Content Card */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-24 lg:-mt-32 relative z-20 pb-24">
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/50 overflow-hidden animate-in slide-in-from-bottom-12 duration-700 ease-out fill-mode-both">

                    {/* Top Accent Gradient Line */}
                    <div className={`h-2 w-full bg-gradient-to-r ${heroBg}`} />

                    <div className="p-8 sm:p-12 lg:p-16">
                        {/* Premium Customized Typography for Markdown */}
                        <div className="prose prose-lg md:prose-xl max-w-none 
                            prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900 
                            prose-h1:text-4xl sm:prose-h1:text-5xl prose-h1:mb-10 prose-h1:pb-6 prose-h1:border-b prose-h1:border-slate-200/60
                            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:flex prose-h2:items-center prose-h2:gap-3
                            prose-h2:before:content-[''] prose-h2:before:block prose-h2:before:w-2.5 prose-h2:before:h-8 prose-h2:before:bg-indigo-500 prose-h2:before:rounded-full prose-h2:before:shadow-sm
                            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:text-slate-800 prose-h3:mt-12
                            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[1.05rem]
                            prose-a:text-indigo-600 prose-a:no-underline prose-a:font-semibold hover:prose-a:underline hover:prose-a:text-indigo-800 transition-colors
                            prose-strong:text-slate-900 prose-strong:font-bold
                            prose-ul:list-none prose-ul:pl-0 prose-ul:mb-8
                            prose-li:relative prose-li:pl-8 prose-li:mb-4 prose-li:text-slate-600 prose-li:leading-relaxed text-[1.05rem]
                            prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-2.5 prose-li:before:top-3.5 prose-li:before:w-2 prose-li:before:h-2 prose-li:before:bg-indigo-400 prose-li:before:rounded-full
                            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 prose-blockquote:italic prose-blockquote:my-10 prose-blockquote:shadow-sm
                        ">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>

                        {/* Animated Footer Call to Action */}
                        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center justify-center">
                            <p className="text-slate-400 text-sm mb-8 tracking-wider uppercase font-semibold">深入了解官方参赛指南与报名入口</p>
                            <button className={`group relative px-10 py-4.5 bg-gradient-to-r ${heroBg} text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
                                <div className="absolute inset-0 w-full h-full bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <span className="relative flex items-center gap-3">
                                    <Rocket size={22} className="group-hover:animate-bounce" />
                                    前往赛事官方网站
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
}
