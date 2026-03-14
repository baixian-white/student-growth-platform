import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CalendarClock, School, Users, Sparkles, AlertCircle, FileText, Target } from 'lucide-react'
import classTypeDetailsIndex from '../data/classTypeDetails/index.json'

const iconByField = {
    成立时间: CalendarClock,
    创建时间: CalendarClock,
    合作单位: School,
    合作高校: School,
    招生人数: Users,
    培养模式: Sparkles,
}

const admissionHighlightIconByField = {
    招生人数: Users,
    招生对象: Users,
    招生定位: Target,
    录取方式: FileText,
    选拔方式: Sparkles,
    '2025录取参考': AlertCircle,
}

const admissionFieldPriority = [
    '2025录取参考',
    '录取方式',
    '选拔方式',
    '招生人数',
    '招生对象',
    '招生定位',
]

const admissionTextMatcher = /(招生|录取|选拔|面试|推荐|中考|统招|提前批|分数)/

function isAdmissionField(key) {
    return admissionFieldPriority.includes(key) || admissionTextMatcher.test(key)
}

function getAdmissionFieldPriority(key) {
    const index = admissionFieldPriority.indexOf(key)
    return index === -1 ? admissionFieldPriority.length : index
}

function trimNote(text, maxLength = 68) {
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength).trim()}...`
}

function extractAdmissionNotes(item, highlightedValues) {
    const sourceTexts = [
        item?.subtitle,
        item?.summary,
        ...((item?.policySections || []).flatMap((section) => section.paragraphs || [])),
    ]

    const notes = []
    const seen = new Set()

    sourceTexts.forEach((source) => {
        if (!source) return

        source
            .split(/[。；]/)
            .map((sentence) => sentence.trim())
            .filter((sentence) => sentence && admissionTextMatcher.test(sentence))
            .forEach((sentence) => {
                if (highlightedValues.has(sentence) || seen.has(sentence)) return
                seen.add(sentence)
                notes.push(trimNote(sentence))
            })
    })

    return notes.slice(0, 3)
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
    const admissionEntries = baseInfoEntries
        .filter(([key]) => isAdmissionField(key))
        .sort(([keyA], [keyB]) => getAdmissionFieldPriority(keyA) - getAdmissionFieldPriority(keyB))
    const otherBaseInfoEntries = baseInfoEntries.filter(([key]) => !isAdmissionField(key))
    const admissionNotes = extractAdmissionNotes(
        item,
        new Set(admissionEntries.map(([, value]) => String(value).trim()))
    )

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
                    {(admissionEntries.length > 0 || admissionNotes.length > 0) && (
                        <div className="mb-8 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm shrink-0">
                                    <Target size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">招生重点速览</h3>
                                    <p className="text-sm text-slate-600 leading-7">
                                        优先看录取参考、招生对象、人数和选拔方式，能更快判断这个班型的进入门槛与适配人群。
                                    </p>
                                </div>
                            </div>

                            {admissionEntries.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
                                    {admissionEntries.map(([key, value]) => {
                                        const Icon = admissionHighlightIconByField[key] || AlertCircle
                                        return (
                                            <div key={key} className="rounded-2xl border border-amber-100 bg-white/85 p-5 shadow-sm">
                                                <div className="flex items-center justify-between gap-3 mb-3">
                                                    <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold">
                                                        <Icon size={16} />
                                                        <span>{key}</span>
                                                    </div>
                                                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black tracking-[0.18em] uppercase">
                                                        招生重点
                                                    </span>
                                                </div>
                                                <div className="text-slate-900 font-black text-lg leading-8">
                                                    {value}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {admissionNotes.length > 0 && (
                                <div className="rounded-2xl border border-amber-100 bg-white/80 p-5">
                                    <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold mb-3">
                                        <AlertCircle size={16} className="text-amber-500" />
                                        <span>招生提醒</span>
                                    </div>
                                    <div className="space-y-3">
                                        {admissionNotes.map((note) => (
                                            <div key={note} className="flex items-start gap-3">
                                                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                                                <p className="text-sm text-slate-700 leading-7">{note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {otherBaseInfoEntries.length > 0 ? (
                        <>
                            {(admissionEntries.length > 0 || admissionNotes.length > 0) && (
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mb-4">
                                    <FileText size={16} />
                                    <span>其他基础信息</span>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {otherBaseInfoEntries.map(([key, value]) => {
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
                        </>
                    ) : admissionEntries.length === 0 && admissionNotes.length === 0 ? (
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
                    ) : null}
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
