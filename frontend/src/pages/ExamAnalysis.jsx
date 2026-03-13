import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Search, TrendingUp, Target, Cpu, Award, Home,
    Database, Sigma, Activity, BarChart3
} from 'lucide-react';

const SCHOOL_POLICY_DATA = [
    {
        school: '一中滨湖校区', short: '一中滨湖', quota: 30, generalScore: 706, techScore: 705, bonus: 1,
        indexScores: [674, 693, 693, 697, 688, 686, 672, 678, 663, 669, 670, 658]
    },
    {
        school: '一中瑶海校区', short: '一中瑶海', quota: 20, generalScore: 694, techScore: 688, bonus: 6,
        indexScores: [690, 684, 685, 673, 681, 670, 671, 671, 651, 665, 662, 669]
    },
    {
        school: '一中淝河校区', short: '一中淝河', quota: 20, generalScore: 682, techScore: 673, bonus: 9,
        indexScores: [675, 664, 666, 667, 670, 662, 655, 665, 654, 660, 659, 660]
    },
    {
        school: '一中长江路校区', short: '一中长江路', quota: 10, generalScore: 700, techScore: 700, bonus: 0,
        indexScores: [680, 685, 694, 656, 679, 689, 691, 688, 642, 664, 659, 684]
    },
    {
        school: '六中菱湖校区', short: '六中菱湖', quota: 35, generalScore: 680, techScore: 631, bonus: 49,
        indexScores: [670, 666, 667, 653, 665, 663, 659, 663, 652, 657, 656, 667]
    },
    {
        school: '六中新桥校区', short: '六中新桥', quota: 10, generalScore: 664, techScore: 648, bonus: 16,
        indexScores: [660, 652, 659, 651, 658, 658, 655, 658, 644, 654, 654, 655]
    },
    {
        school: '六中百花井校区', short: '六中百花井', quota: 15, generalScore: 691, techScore: 680, bonus: 11,
        indexScores: [675, 685, 688, 646, 675, 672, 688, 670, 650, 636, 658, 672]
    },
    {
        school: '八中匡河校区', short: '八中匡河', quota: 35, generalScore: 687, techScore: 586, bonus: 101,
        indexScores: [666, 660, 665, 662, 666, 672, 666, 668, 676, 674, 678, 657]
    },
    {
        school: '八中运河校区', short: '八中运河', quota: 20, generalScore: 668, techScore: 654, bonus: 14,
        indexScores: [663, 658, 661, 656, 663, 660, 657, 661, 653, 659, 660, 658]
    },
    // {
    //     school: '一六八中学', short: '一六八中学', quota: 15, generalScore: 669, techScore: 694, bonus: -25,
    //     indexScores: []
    // },
    {
        school: '合肥四中', short: '合肥四中', quota: 15, generalScore: 657, techScore: 632, bonus: 25,
        indexScores: [651, 647, 652, 650, 651, 650, 647, 651, 639, 649, 647, 648]
    },
    {
        school: '合肥七中', short: '合肥七中', quota: 8, generalScore: 654, techScore: 643, bonus: 11,
        indexScores: [648, 646, 648, 645, 648, 649, 648, 649, 639, 648, 650, 647]
    },
    {
        school: '九中新站校区', short: '九中新站', quota: 14, generalScore: 642, techScore: 605, bonus: 37,
        indexScores: [635, 634, 635, 634, 635, 636, 633, 633, 629, 636, 634, 636]
    },
    {
        school: '九中四牌楼校区', short: '九中四牌楼', quota: 8, generalScore: 648, techScore: 628, bonus: 20,
        indexScores: [643, 645, 646, 640, 643, 644, 643, 646, 628, 641, 643, 639]
    }
];

const ROBOT_QUOTA_BY_SCHOOL = [
    { school: '合肥五中', quota: 5 },
    { school: '九中新站校区', quota: 4 },
    { school: '九中四牌楼校区', quota: 4 }
];

function avg(list) {
    if (!list || list.length === 0) return null;
    return list.reduce((sum, n) => sum + n, 0) / list.length;
}

function quantile(values, q) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
}

function nameList(list) {
    return list.map(item => item.short).join('、');
}

export default function ExamAnalysis() {
    const analytics = useMemo(() => {
        const totalQuota = SCHOOL_POLICY_DATA.reduce((sum, item) => sum + item.quota, 0);
        const weightedGeneral = SCHOOL_POLICY_DATA.reduce((sum, item) => sum + item.generalScore * item.quota, 0) / totalQuota;
        const weightedTech = SCHOOL_POLICY_DATA.reduce((sum, item) => sum + item.techScore * item.quota, 0) / totalQuota;
        const avgBonus = SCHOOL_POLICY_DATA.reduce((sum, item) => sum + item.bonus, 0) / SCHOOL_POLICY_DATA.length;

        const maxBonusSchool = SCHOOL_POLICY_DATA.reduce((best, item) => (item.bonus > best.bonus ? item : best), SCHOOL_POLICY_DATA[0]);
        const minBonusSchool = SCHOOL_POLICY_DATA.reduce((best, item) => (item.bonus < best.bonus ? item : best), SCHOOL_POLICY_DATA[0]);

        const allIndexScores = SCHOOL_POLICY_DATA.flatMap(item => item.indexScores);
        const indexAvg = avg(allIndexScores);
        const indexP25 = quantile(allIndexScores, 0.25);
        const indexP75 = quantile(allIndexScores, 0.75);

        const opportunityRanking = SCHOOL_POLICY_DATA
            .map(item => {
                const indexAvgBySchool = avg(item.indexScores);
                const indexRange = item.indexScores.length > 0 ? Math.max(...item.indexScores) - Math.min(...item.indexScores) : null;
                return {
                    ...item,
                    indexAvg: indexAvgBySchool,
                    indexRange,
                    opportunityIndex: Math.max(item.bonus, 0) * item.quota
                };
            })
            .sort((a, b) => b.opportunityIndex - a.opportunityIndex);

        const sprintLayer = SCHOOL_POLICY_DATA.filter(item => item.generalScore >= 690);
        const leverageLayer = SCHOOL_POLICY_DATA.filter(item => item.bonus >= 30);
        const stableLayer = opportunityRanking.filter(item => item.indexAvg !== null && item.indexAvg >= 645 && item.indexRange !== null && item.indexRange <= 20);

        const robotQuota = ROBOT_QUOTA_BY_SCHOOL.reduce((sum, item) => sum + item.quota, 0);
        const innovationQuota = totalQuota - robotQuota;
        const trackPie = [
            { name: '信息学/科技创新', value: innovationQuota, color: '#2563eb' },
            { name: '电脑机器人', value: robotQuota, color: '#14b8a6' }
        ];

        return {
            totalQuota,
            weightedGeneral,
            weightedTech,
            avgBonus,
            weightedBonus: weightedGeneral - weightedTech,
            maxBonusSchool,
            minBonusSchool,
            allIndexCount: allIndexScores.length,
            indexAvg,
            indexP25,
            indexP75,
            opportunityRanking,
            sprintLayer,
            leverageLayer,
            stableLayer,
            trackPie
        };
    }, []);

    const scoreCompareData = SCHOOL_POLICY_DATA.map(item => ({
        school: item.short,
        general: item.generalScore,
        tech: item.techScore
    }));

    const leverageChartData = analytics.opportunityRanking.slice(0, 6).map(item => ({
        school: item.short,
        leverage: item.opportunityIndex
    }));

    return (
        <div className="min-h-screen bg-slate-50 pb-20 text-slate-800">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                    <TrendingUp size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-wide whitespace-nowrap">信息分析</h1>
                            </div>

                            <div className="ml-8 flex bg-gray-100 p-1 rounded-xl">
                                <Link to="/exam-info" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </Link>
                                <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-red-600 shadow-sm border border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} />信息分析
                                    </div>
                                </div>
                                <Link to="/strong-base" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} />强基计划
                                    </div>
                                </Link>
                                <Link to="/tech-specialty" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={16} />科技特长生
                                    </div>
                                </Link>
                                <Link to="/whitelist-competitions" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} />白名单赛事
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700">
                            <Home size={18} />
                            <span className="text-sm font-medium">返回首页</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            <Database size={18} className="text-red-500" />
                            数据基线
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100">
                            大数据洞察模型已重算
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        样本由“2025合肥中考学校/校区科技类名额与分数表”和“科技类项目招生学校及人数分配表”构成。
                        共覆盖 {SCHOOL_POLICY_DATA.length} 个校区、{analytics.totalQuota} 个科技类名额、{analytics.allIndexCount} 个指标到校分位点。
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <Sigma size={16} />总科技类名额
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{analytics.totalQuota}</p>
                        <p className="text-xs text-slate-500 mt-1">覆盖信息学/科技创新与机器人方向</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <Activity size={16} />加权降分空间
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{analytics.weightedBonus.toFixed(1)} 分</p>
                        <p className="text-xs text-slate-500 mt-1">加权统招 {analytics.weightedGeneral.toFixed(1)} vs 科技线 {analytics.weightedTech.toFixed(1)}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <BarChart3 size={16} />最大政策杠杆
                        </div>
                        <p className="text-xl font-bold text-blue-600">{analytics.maxBonusSchool.short}</p>
                        <p className="text-xs text-slate-500 mt-1">单校降分空间最高 +{analytics.maxBonusSchool.bonus}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <TrendingUp size={16} />指标到校中位区间
                        </div>
                        <p className="text-xl font-bold text-slate-900">{analytics.indexP25.toFixed(0)} - {analytics.indexP75.toFixed(0)}</p>
                        <p className="text-xs text-slate-500 mt-1">整体均值 {analytics.indexAvg.toFixed(1)}（样本分位稳定带）</p>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-bold text-slate-900 mb-4">统招线 vs 科技线（校区对比）</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={scoreCompareData} margin={{ top: 8, right: 12, left: -14, bottom: 34 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="school" angle={-30} textAnchor="end" interval={0} height={52} tick={{ fontSize: 11 }} />
                                    <YAxis domain={[560, 720]} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="general" name="统招线" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="tech" name="科技线" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-bold text-slate-900 mb-4">科技类项目名额结构</h3>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={analytics.trackPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={76} label>
                                        {analytics.trackPie.map(entry => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                            <p className="text-slate-600">
                                机器人方向明确名额：<span className="font-semibold text-slate-900">{ROBOT_QUOTA_BY_SCHOOL.reduce((sum, item) => sum + item.quota, 0)}人</span>
                            </p>
                            {ROBOT_QUOTA_BY_SCHOOL.map(item => (
                                <p key={item.school} className="text-xs text-slate-500">{item.school}：{item.quota}人</p>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-bold text-slate-900 mb-4">政策杠杆指数 Top6</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={leverageChartData} layout="vertical" margin={{ top: 6, right: 10, left: 10, bottom: 6 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                    <YAxis type="category" dataKey="school" width={76} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="leverage" name="杠杆指数(名额×降分)" fill="#2563eb" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <h3 className="text-base font-bold text-slate-900 mb-4">2026分层策略建议（由样本自动推导）</h3>
                        <div className="space-y-3 text-sm">
                            <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
                                <p className="font-semibold text-red-700">冲顶层（统招线 690+）</p>
                                <p className="text-slate-600 mt-1">{nameList(analytics.sprintLayer)}。建议把科技赛道当“保底增强”，文化分仍需保持在高位。</p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                                <p className="font-semibold text-emerald-700">高杠杆层（降分空间 30+）</p>
                                <p className="text-slate-600 mt-1">{nameList(analytics.leverageLayer)}。建议优先配置高确定性的信息学/机器人项目，追求“分差换录取”。</p>
                            </div>
                            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                                <p className="font-semibold text-blue-700">稳态层（指标均值 ≥645 且波动≤20）</p>
                                <p className="text-slate-600 mt-1">{analytics.stableLayer.length ? analytics.stableLayer.map(item => item.short).join('、') : '暂无满足条件校区'}。建议走“指标到校 + 科技线”双保险策略。</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-4">校区机会清单</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[860px]">
                            <thead>
                                <tr className="text-left text-slate-500 border-b border-slate-200">
                                    <th className="py-2 pr-3">排名</th>
                                    <th className="py-2 pr-3">学校/校区</th>
                                    <th className="py-2 pr-3">名额</th>
                                    <th className="py-2 pr-3">统招线</th>
                                    <th className="py-2 pr-3">科技线</th>
                                    <th className="py-2 pr-3">降分空间</th>
                                    <th className="py-2 pr-3">杠杆指数</th>
                                    <th className="py-2 pr-3">指标均值</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.opportunityRanking.map((item, idx) => (
                                    <tr key={item.school} className="border-b border-slate-100 hover:bg-slate-50/70">
                                        <td className="py-2 pr-3 font-medium text-slate-700">{idx + 1}</td>
                                        <td className="py-2 pr-3 font-medium text-slate-900">{item.school}</td>
                                        <td className="py-2 pr-3">{item.quota}</td>
                                        <td className="py-2 pr-3">{item.generalScore}</td>
                                        <td className="py-2 pr-3">{item.techScore}</td>
                                        <td className={`py-2 pr-3 font-semibold ${item.bonus >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {item.bonus >= 0 ? `+${item.bonus}` : item.bonus}
                                        </td>
                                        <td className="py-2 pr-3 text-blue-600 font-semibold">{item.opportunityIndex}</td>
                                        <td className="py-2 pr-3">
                                            {item.indexAvg !== null ? item.indexAvg.toFixed(1) : '--'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
