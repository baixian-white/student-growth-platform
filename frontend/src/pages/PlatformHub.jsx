import { Link } from 'react-router-dom';
import {
    ArrowRightCircle,
    BarChart3,
    BookOpenText,
    Calendar,
    CheckCircle2,
    ChevronRight,
    FileText,
    GraduationCap,
    Grid,
    MapPin,
    Sparkles,
    Target,
    TrendingUp
} from 'lucide-react';

const overviewCards = [
    {
        title: '2大核心模块',
        description: '资讯检索与AI规划协同工作，把信息判断和方案生成放在同一个入口里。',
        icon: GraduationCap,
        iconWrap: 'from-rose-500 to-fuchsia-500',
        panel: 'from-rose-50 to-white'
    },
    {
        title: '3步完成决策',
        description: '先看政策，再看班型，最后生成路径，减少家长来回切换页面的成本。',
        icon: Target,
        iconWrap: 'from-orange-500 to-amber-500',
        panel: 'from-orange-50 to-white'
    },
    {
        title: '三档方案输出',
        description: 'AI可生成“冲刺-稳妥-保底”三档升学路径，并附带关键任务建议。',
        icon: TrendingUp,
        iconWrap: 'from-indigo-500 to-blue-500',
        panel: 'from-indigo-50 to-white'
    },
    {
        title: '适合家长前置摸底',
        description: '特别适合刚开始梳理升学方向、目标学校和班型差异的家庭快速建立认知。',
        icon: CheckCircle2,
        iconWrap: 'from-emerald-500 to-teal-500',
        panel: 'from-emerald-50 to-white'
    }
];

const moduleCards = [
    {
        title: '资讯模块',
        subtitle: '先把规则看清，再决定怎么选',
        description: '集中查看升学政策、招生简章、竞赛考试动态与班型解析，支持按地区、学段、关键词筛选，帮助家长和学生快速完成信息判断。',
        highlights: [
            '升学政策资讯库统一汇总核心信息入口',
            '班型分析帮助理解不同学校的培养路径差异',
            '可结合信息分析、强基计划、科技特长生等专题联动查看',
            '更适合前期摸底、缩小范围、建立判断框架'
        ],
        outputs: ['政策资讯', '招生简章', '班型分析', '专题导航'],
        to: '/exam-info',
        cta: '进入升学政策资讯库',
        icon: BookOpenText,
        iconWrap: 'from-sky-500 to-cyan-500',
        badge: '信息检索入口',
        panel: 'from-sky-50 via-white to-cyan-50',
        button: 'text-blue-600 hover:text-blue-700'
    },
    {
        title: 'AI一键规划模块',
        subtitle: '把信息沉淀成一套可执行方案',
        description: '基于学生画像、成绩水平、目标学校与偏好方向，一键生成“冲刺-稳妥-保底”三档升学路径，并给出阶段任务与优先行动清单。',
        highlights: [
            '支持围绕成绩、目标校、竞赛方向等要素快速建模',
            '自动给出三档升学路径与风险分布判断',
            '输出可落地的阶段任务、优先级与补强方向',
            '更适合中后期定方案、做取舍、校正路径'
        ],
        outputs: ['三档路径', '阶段任务', '行动清单', '风险判断'],
        to: '/guihua',
        cta: '开始AI一键规划',
        icon: Sparkles,
        iconWrap: 'from-rose-500 to-red-500',
        badge: '智能方案生成',
        panel: 'from-rose-50 via-white to-orange-50',
        button: 'text-red-600 hover:text-red-700'
    }
];

const journeySteps = [
    {
        step: '01',
        title: '先看政策与方向',
        description: '先进入资讯模块确认招生政策、学校动态、专题栏目和基础升学规则，避免在信息不完整时直接做判断。',
        icon: FileText,
        accent: 'text-blue-600 bg-blue-50'
    },
    {
        step: '02',
        title: '再看班型与竞争格局',
        description: '通过班型分析了解不同学校、不同班型的培养侧重，建立对目标校梯队和路径的现实认知。',
        icon: Grid,
        accent: 'text-amber-600 bg-amber-50'
    },
    {
        step: '03',
        title: '最后生成个性化方案',
        description: '回到AI模块，根据学生画像生成冲刺、稳妥、保底方案，并形成后续执行清单。',
        icon: Sparkles,
        accent: 'text-rose-600 bg-rose-50'
    }
];

const userScenes = [
    {
        title: '家长前期摸底',
        description: '适合还在了解规则、学校和班型差异的阶段，先建立整体认知。',
        icon: MapPin
    },
    {
        title: '目标校冲刺判断',
        description: '适合已经有意向学校，希望判断路径是否合理、是否需要调整策略。',
        icon: Target
    },
    {
        title: '阶段节奏规划',
        description: '适合准备把“看过的信息”转成“接下来该做什么”的具体安排。',
        icon: Calendar
    }
];

export default function PlatformHub() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/80 to-indigo-50/80">
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-indigo-600 text-white shadow-sm">
                            <GraduationCap size={22} />
                        </div>
                        <span className="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                            AI升学规划平台
                        </span>
                    </div>
                </div>
            </nav>

            <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:py-14">
                <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/75 px-8 py-12 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-12">
                    <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-rose-200/35 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl" />
                    <div className="relative z-10 text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-sm font-medium text-rose-600 shadow-sm">
                            <Sparkles size={16} />
                            信息查询与AI规划双入口协同
                        </div>
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
                            AI升学规划平台
                        </h1>
                        <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-600 md:text-xl">
                            打通政策资讯与智能规划两大能力，从“获取信息”到“制定方案”一站式完成，让家长和学生先看清规则，再形成路径，减少信息分散带来的判断成本。
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm">
                                <BookOpenText size={16} />
                                资讯模块
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-100">
                                <Grid size={16} className="text-amber-500" />
                                班型分析
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-100">
                                <Sparkles size={16} className="text-rose-500" />
                                AI一键规划
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {overviewCards.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className={`rounded-3xl border border-white/70 bg-gradient-to-br ${item.panel} p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]`}
                            >
                                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconWrap} text-white shadow-sm`}>
                                    <Icon size={22} />
                                </div>
                                <h2 className="mb-2 text-xl font-bold text-gray-900">{item.title}</h2>
                                <p className="text-sm leading-7 text-gray-600">{item.description}</p>
                            </div>
                        );
                    })}
                </section>

                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {moduleCards.map((item) => {
                        const Icon = item.icon;

                        return (
                            <section
                                key={item.title}
                                className={`relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br ${item.panel} p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]`}
                            >
                                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
                                <div className="relative z-10 flex h-full flex-col">
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconWrap} text-white shadow-md`}>
                                            <Icon size={28} />
                                        </div>
                                        <div className="rounded-full border border-gray-200/70 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-gray-500">
                                            {item.badge}
                                        </div>
                                    </div>

                                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-gray-400">
                                        {item.subtitle}
                                    </p>
                                    <h2 className="mb-3 text-3xl font-bold text-gray-900">{item.title}</h2>
                                    <p className="mb-6 text-base leading-8 text-gray-600">{item.description}</p>

                                    <div className="mb-6 grid gap-3">
                                        {item.highlights.map((point) => (
                                            <div
                                                key={point}
                                                className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3"
                                            >
                                                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                                                <span className="text-sm leading-7 text-gray-700">{point}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-7 rounded-2xl border border-dashed border-gray-200 bg-white/60 p-4">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                                            模块输出
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.outputs.map((output) => (
                                                <span
                                                    key={output}
                                                    className="rounded-full bg-gray-900 px-3 py-1.5 text-xs font-medium text-white"
                                                >
                                                    {output}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        to={item.to}
                                        className={`mt-auto inline-flex items-center gap-2 text-lg font-semibold transition-all hover:gap-3 ${item.button}`}
                                    >
                                        {item.cta}
                                        <ArrowRightCircle size={22} />
                                    </Link>
                                </div>
                            </section>
                        );
                    })}
                </section>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-[28px] border border-white/80 bg-white/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                                <BarChart3 size={22} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">推荐使用路径</h2>
                                <p className="text-sm text-gray-500">建议先建立信息认知，再形成可执行方案</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {journeySteps.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.step}
                                        className="grid gap-4 rounded-3xl border border-gray-100 bg-gradient-to-r from-white to-slate-50 px-5 py-5 md:grid-cols-[72px_1fr]"
                                    >
                                        <div className="flex items-center gap-3 md:block">
                                            <div className="text-sm font-bold tracking-[0.2em] text-gray-300">{item.step}</div>
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.accent}`}>
                                                <Icon size={22} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                                            <p className="text-sm leading-7 text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/80 bg-white/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">适用场景</h2>
                            <p className="mt-2 text-sm leading-7 text-gray-500">
                                这个平台不仅是一个入口页，更是帮助家长和学生建立判断顺序的工作台。
                            </p>
                        </div>

                        <div className="space-y-4">
                            {userScenes.map((scene) => {
                                const Icon = scene.icon;

                                return (
                                    <div
                                        key={scene.title}
                                        className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4"
                                    >
                                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="mb-1 text-base font-bold text-gray-900">{scene.title}</h3>
                                        <p className="text-sm leading-7 text-gray-600">{scene.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-8 py-9 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                    <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-rose-400/15 blur-3xl" />
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/50">
                                Best Practice
                            </p>
                            <h2 className="mb-3 text-3xl font-bold">先用资讯模块建立认知，再用AI模块沉淀成方案</h2>
                            <p className="text-base leading-8 text-white/80">
                                如果你还在确认政策、学校和班型差异，建议先进入资讯模块；如果你已经有目标范围，想快速形成“接下来怎么做”的路径判断，就进入AI一键规划模块。
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/exam-info"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
                            >
                                先看资讯模块
                                <ChevronRight size={18} />
                            </Link>
                            <Link
                                to="/guihua"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                            >
                                直接开始AI规划
                                <ArrowRightCircle size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
