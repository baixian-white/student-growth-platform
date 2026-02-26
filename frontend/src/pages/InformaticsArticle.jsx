import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Share2 } from 'lucide-react';
import informaticsData from '../data/informaticsData.json';

export default function InformaticsArticle() {
    const { type, id } = useParams();
    const navigate = useNavigate();

    // The index corresponds to the item in the respective list
    const articleIndex = parseInt(id, 10);
    const sourceList = type === 'consulting' ? informaticsData.consulting : informaticsData.provincialDynamics;
    const article = sourceList ? sourceList[articleIndex] : null;
    const sourceLabel = type === 'consulting' ? '信奥资讯' : '各省动态';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">找不到该文章</h2>
                <button onClick={() => navigate('/informatics-olympiad')} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                    返回列表
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans selection:bg-blue-500/30">
            {/* 极简阅读导航 */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/informatics-olympiad')}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        <ArrowLeft size={18} /> 返回资讯列表
                    </button>
                    <div className="flex gap-4">
                        <button className="text-gray-400 hover:text-blue-500 transition-colors">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 mt-10">
                <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-14">
                    {/* 文章头 */}
                    <header className="mb-10 text-center border-b border-gray-100 pb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug mb-6">
                            {article.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                            {article.date && (
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} className="text-blue-400" />
                                    发布时间: {article.date}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Eye size={16} className="text-emerald-400" />
                                来源: {sourceLabel}
                            </div>
                        </div>
                    </header>

                    {/* 正文渲染区 */}
                    {article.contentHtml ? (
                        <div
                            className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed
                                       prose-headings:text-gray-900 prose-headings:font-bold 
                                       prose-a:text-blue-600 hover:prose-a:text-blue-800
                                       prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto"
                            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                        />
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            暂未抓取到该正文内容。
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                                点击前往外网阅读原文
                            </a>
                        </div>
                    )}
                </article>
            </main>
        </div>
    );
}
