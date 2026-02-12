import React, { useState } from 'react';
import {
  Users,
  Cpu,
  BarChart3,
  ShieldCheck,
  Mail,
  Github,
  Linkedin,
  ChevronRight,
  Target,
  BookOpen,
  Zap
} from 'lucide-react';

// 团队成员数据
const teamMembers = [
  {
    name: "张明远",
    role: "首席执行官 & AI 算法专家",
    bio: "清华大学人工智能博士，曾任某知名教育科技公司技术总监，专注于深度学习在学情分析中的应用。",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    tags: ["算法架构", "战略决策"]
  },
  {
    name: "李若希",
    role: "教育大数据首席分析师",
    bio: "资深中高考政策研究员，拥有 15 年招考数据分析经验，擅长从海量录取数据中发现规律。",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    tags: ["数据挖掘", "政策解读"]
  },
  {
    name: "王博",
    role: "技术负责人 (CTO)",
    bio: "全栈工程师，负责 AI 模型在云端的部署与实时响应架构，确保分析结果秒级呈现。",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    tags: ["架构设计", "高并发"]
  },
  {
    name: "陈思语",
    role: "产品负责人 & 用户体验师",
    bio: "前教育平台交互设计主管，致力于将复杂的 AI 分析报告转化为家长和学生易读的可视化方案。",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    tags: ["UX设计", "产品运营"]
  }
];

// 核心优势数据
const features = [
  {
    icon: <Cpu className="w-8 h-8 text-blue-500" />,
    title: "自研 AI 模型",
    description: "针对历年考试大纲与试题结构，定制化开发学情预测模型，准确度领先行业。"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
    title: "多维大数据",
    description: "整合全国各省市 10 年内录取分数线、排名走势及专业热度，提供全方位画像。"
  },
  {
    icon: <Target className="w-8 h-8 text-purple-500" />,
    title: "精准志愿填报",
    description: "基于蒙特卡洛算法模拟录取概率，最大程度降低掉档风险，提升志愿命中率。"
  },
  {
    icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
    title: "个性化提分路径",
    description: "分析学生错题特征，智能生成弱项提升计划，实现效率最大化的精准复习。"
  }
];

const App = () => {
  const [activeMember, setActiveMember] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                智考 AI 实验室
              </span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#home" className="hover:text-blue-600 transition-colors">首页</a>
              <a href="#features" className="hover:text-blue-600 transition-colors">核心技术</a>
              <a href="#team" className="hover:text-blue-600 transition-colors">专家团队</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors text-blue-600 border border-blue-600 px-4 py-1.5 rounded-full">联系我们</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄展示区 */}
      <header id="home" className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              用 <span className="text-blue-600">AI</span> 的智慧，<br />
              开启 <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">中高考</span> 的升学新篇章
            </h1>
            <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              我们是致力于教育信息化的科技团队，通过机器学习与大数据分析，为每一位学子量身定制升学最优解。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                开始免费分析 <ChevronRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                了解研究成果
              </button>
            </div>
          </div>
        </div>

        {/* 背景装饰 */}
        <div className="absolute top-0 -z-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 opacity-20 blur-3xl pointer-events-none">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </header>

      {/* 核心优势 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">为什么选择我们</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 团队成员 */}
      <section id="team" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-bold mb-4">集结行业顶尖专家</h2>
              <p className="text-slate-600 max-w-xl">
                由算法工程师、教育政策专家、数据分析师组成的跨学科团队，只为每一个更精准的决策。
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer hover:gap-3 transition-all">
              <span>查看全部成员</span> <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200"
                onMouseEnter={() => setActiveMember(index)}
                onMouseLeave={() => setActiveMember(null)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部联系 */}
      <footer id="contact" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">准备好为未来精准定位了吗？</h2>
              <p className="text-slate-400 mb-8 text-lg">
                我们的 AI 系统已经准备就绪，欢迎通过以下方式联系我们，获取专属的分析报告。
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>contact@zk-ai-lab.edu</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span>商务合作: 400-888-9999</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6">快捷咨询</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="您的称呼"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="电子邮箱 / 手机号"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="简单描述您的需求 (如：高考报志愿咨询)"
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button className="w-full py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/50">
                  提交申请
                </button>
              </form>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>© 2024 智考 AI 实验室. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">隐私政策</a>
              <a href="#" className="hover:text-white">服务条款</a>
              <div className="flex gap-4 ml-4">
                <Github className="w-5 h-5 cursor-pointer hover:text-white" />
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;