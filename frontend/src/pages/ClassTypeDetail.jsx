import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CalendarClock, School, Users, Sparkles, AlertCircle } from 'lucide-react'
import classTypeDetailsIndex from '../data/classTypeDetails/index.json'

const iconByField = {
    成立时间: CalendarClock,
    创建时间: CalendarClock,
    合作单位: School,
    合作高校: School,
    招生人数: Users,
    培养模式: Sparkles,
}

const detailModules = import.meta.glob('../data/classTypeDetails/*/*.json')

export default function ClassTypeDetail() {
    const { slug } = useParams()
    const [item, setItem] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const detailPath = useMemo(
        () => classTypeDetailsIndex.slugToFile?.[slug] || '',
        [slug]
    )

    useEffect(() => {
        let cancelled = false

        const loadItem = async () => {
            setIsLoading(true)
            setItem(null)

            if (!detailPath) {
                if (!cancelled) setIsLoading(false)
                return
            }

            const moduleKey = `../data/classTypeDetails/${detailPath}`
            const loader = detailModules[moduleKey]
            if (!loader) {
                if (!cancelled) setIsLoading(false)
                return
            }

            try {
                const loaded = await loader()
                if (!cancelled) {
                    setItem(loaded.default || loaded)
                }
            } catch {
                if (!cancelled) {
                    setItem(null)
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        loadItem()
        return () => {
            cancelled = true
        }
    }, [detailPath])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <Link
                        to="/type-of-class"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm mb-8"
                    >
                        <ArrowLeft size={16} />
                        返回班型分析
                    </Link>
                    <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm text-center">
                        <h1 className="text-2xl font-black text-slate-900 mb-3">详情加载中</h1>
                        <p className="text-slate-600">正在读取班型详情数据，请稍候。</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <Link
                        to="/type-of-class"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm mb-8"
                    >
                        <ArrowLeft size={16} />
                        返回班型分析
                    </Link>
                    <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm text-center">
                        <AlertCircle className="mx-auto text-slate-400 mb-4" size={36} />
                        <h1 className="text-2xl font-black text-slate-900 mb-3">暂无可展示的公开资料</h1>
                        <p className="text-slate-600">
                            当前班型暂未收录可展示的详情内容。
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const baseInfoEntries = Object.entries(item.baseInfo || {})

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <Link
                        to="/type-of-class"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
                    >
                        <ArrowLeft size={16} />
                        返回班型分析
                    </Link>
                </div>

                <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm mb-8">
                    <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
                        <Sparkles size={14} />
                        班型详细介绍
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        {item.title}
                    </h1>
                    <p className="text-slate-600 text-lg mb-6">
                        {item.subtitle}
                    </p>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                        <h2 className="text-sm font-semibold text-slate-800 mb-2">班型简介</h2>
                        <p className="text-slate-700 leading-8">
                            {item.summary}
                        </p>
                    </div>
                </section>

                <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm mb-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-6">基础信息</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {baseInfoEntries.map(([key, value]) => {
                            const Icon = iconByField[key]
                            return (
                                <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                                        {Icon ? <Icon size={15} /> : null}
                                        <span>{key}</span>
                                    </div>
                                    <div className="text-slate-900 font-semibold leading-7">
                                        {value}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {Array.isArray(item.policySections) && item.policySections.length > 0 && (
                    <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm mb-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">实施办法正文</h2>
                        <div className="space-y-6">
                            {item.policySections.map((section, idx) => (
                                <div key={`${section.title}-${idx}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                                    <h3 className="text-lg font-black text-slate-900 mb-3">{section.title}</h3>
                                    <div className="space-y-2 text-slate-700 leading-7">
                                        {(section.paragraphs || []).map((paragraph, pIdx) => (
                                            <p key={pIdx}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">官网链接</h2>
                    <div className="flex flex-col gap-3 text-sm text-slate-700">
                        {item.source?.url ? (
                            <a
                                href={item.source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-medium"
                            >
                                跳转官网原文
                                <ExternalLink size={14} />
                            </a>
                        ) : (
                            <div className="text-slate-600">暂未提供官网链接</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
