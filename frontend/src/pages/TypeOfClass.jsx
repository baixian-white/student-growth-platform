import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { School, Award, ShieldCheck, BookOpen, Users, Compass, ChevronRight, Star, GraduationCap, Zap, Target, Rocket, Lightbulb, TrendingUp, Trophy, Atom, Layers, Crown, FlaskConical, Sigma, ScrollText, Binary, MapPin, ArrowLeft } from 'lucide-react';
import classTypeDetails from '../data/classTypeDetails.json';

const App = () => {
  const [activeSchool, setActiveSchool] = useState('hf1z'); 
  const [activeCampus, setActiveCampus] = useState('yaohai');

  // 学校配置
  const schools = [
    { id: 'hf1z', name: '合肥一中' },
    { id: 'hf6z', name: '合肥六中' },
    { id: 'hf7z', name: '合肥七中' },
    { id: 'hf9z', name: '合肥九中' },
    { id: 'hf4z', name: '合肥四中' },
    { id: 'hf168', name: '合肥一六八中' }
  ];

  // 模拟合肥行政区坐标 (x, y 为地图百分比)
  // 逻辑：庐阳(50,35), 蜀山(35,45), 包河(55,60), 瑶海(65,40), 高新(25,55), 经开(45,75), 新站(75,25), 滨湖(60,85), 肥西(20,80)
  const campuses = {
    hf1z: [
      { id: 'yaohai', name: '瑶海校区', color: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', shadow: 'shadow-blue-100', bg: 'from-blue-50 to-indigo-50', pos: { x: 72, y: 40 } },
      { id: 'binhu', name: '滨湖校区', color: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', shadow: 'shadow-rose-100', bg: 'from-rose-50 to-orange-50', pos: { x: 60, y: 88 } },
      { id: 'feihe', name: '淝河校区', color: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', shadow: 'shadow-purple-100', bg: 'from-purple-50 to-fuchsia-50', pos: { x: 68, y: 65 } },
      { id: 'changjiang', name: '长江路校区', color: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', shadow: 'shadow-emerald-100', bg: 'from-emerald-50 to-teal-50', pos: { x: 50, y: 45 } }
    ],
    hf6z: [
      { id: 'linghu', name: '菱湖校区', color: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', shadow: 'shadow-indigo-100', bg: 'from-indigo-50 to-slate-100', pos: { x: 52, y: 28 } },
      { id: 'xinqiao', name: '新桥校区', color: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-600', shadow: 'shadow-cyan-100', bg: 'from-cyan-50 to-blue-50', pos: { x: 10, y: 25 } },
      { id: 'baihuajing', name: '百花井校区', color: 'bg-violet-700', text: 'text-violet-700', border: 'border-violet-700', shadow: 'shadow-violet-100', bg: 'from-violet-50 to-fuchsia-50', pos: { x: 54, y: 42 } }
    ],
    hf7z: [
      { id: 'gaoxin', name: '高新区校区', color: 'bg-sky-600', text: 'text-sky-600', border: 'border-sky-600', shadow: 'shadow-sky-100', bg: 'from-sky-50 to-blue-50', pos: { x: 28, y: 55 } }
    ],
    hf9z: [
      { id: 'xinzhan', name: '新站校区', color: 'bg-rose-700', text: 'text-rose-700', border: 'border-rose-700', shadow: 'shadow-rose-100', bg: 'from-rose-50 to-amber-50', pos: { x: 82, y: 25 } },
      { id: 'sipailou', name: '四牌楼校区', color: 'bg-red-800', text: 'text-red-800', border: 'border-red-800', shadow: 'shadow-red-100', bg: 'from-red-50 to-stone-100', pos: { x: 48, y: 48 } }
    ],
    hf4z: [
      { id: 'zhonghuan', name: '中环城校区', color: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-600', shadow: 'shadow-amber-100', bg: 'from-amber-50 to-orange-50', pos: { x: 42, y: 68 } }
    ],
    hf168: [
      { id: 'shixin', name: '始信路校区', color: 'bg-blue-800', text: 'text-blue-800', border: 'border-blue-800', shadow: 'shadow-blue-100', bg: 'from-blue-50 to-slate-100', pos: { x: 46, y: 78 } }
    ]
  };

  const currentCampusList = campuses[activeSchool] || campuses['hf1z'];
  const currentCampus = currentCampusList.find(c => c.id === activeCampus) || currentCampusList[0];

  const classData = {
    yaohai: [
      { type: '顶尖特设', title: '杨振宁班', icon: <Star className="text-amber-500 w-6 h-6" />, desc: '与中科大共建，招牌班型。', details: '40人；高一高二参加中科大创新班选拔。', tags: ['中科大共建', '40人'], level: 'Elite' },
      { type: '顶尖特设', title: '国防教育班', icon: <ShieldCheck className="text-blue-600 w-6 h-6" />, desc: '与陆军兵种训练基地共建。', details: '50人，侧重综合素质与国防意识。', tags: ['军校共建', '50人'], level: 'Elite' },
      { type: '重点梯队', title: '强基班', icon: <Target className="text-red-500 w-6 h-6" />, desc: '针对竞赛与强基计划方向。', details: '分为竞赛/高考双轨。统招、指标高分构成。', tags: ['竞赛方向', '高考强基'], level: 'Key' },
      { type: '实验梯队', title: '实验班', icon: <Zap className="text-indigo-500 w-6 h-6" />, desc: '校级重点教学班。', details: '主要为指标到校较高分数段学生。', tags: ['指标高分'], level: 'Standard' },
      { type: '平行梯队', title: '素养班', icon: <Users className="text-slate-500 w-6 h-6" />, desc: '注重均衡发展。', details: '按成绩S形分布平均分配。', tags: ['均衡分班'], level: 'Normal' }
    ],
    binhu: [
        { type: '重点梯队', title: '强基班', icon: <Award className="text-rose-500 w-6 h-6" />, desc: '竞赛与高考双轨并行。', details: '主要面向强基、统招及特长高分生源。', tags: ['高分集结'], level: 'Key' },
        { type: '实验梯队', title: '实验班', icon: <BookOpen className="text-rose-400 w-6 h-6" />, desc: '传统的重点班级，师资雄厚。', details: '指标到校高分生源集中地。', tags: ['指标高分'], level: 'Standard' },
        { type: '平行梯队', title: '素养班', icon: <Users className="text-slate-400 w-6 h-6" />, desc: 'S形分布，公平起点。', details: '保证每班生源与师资力量完全一致。', tags: ['均衡分班'], level: 'Normal' }
    ],
    feihe: [
        { type: '顶尖特设', title: '北大博雅英才班', icon: <GraduationCap className="text-purple-600 w-6 h-6" />, desc: '全省唯一北大博雅四星级基地。', details: '依托北大资源，开展拔尖创新人才早期培养。', tags: ['北大合作', '四星基地'], level: 'Elite' },
        { type: '重点梯队', title: '强基班', icon: <Award className="text-purple-500 w-6 h-6" />, desc: '竞赛与高考双轨分向。', details: '统招高分段与强基意向生源。', tags: ['拔尖培养'], level: 'Key' },
        { type: '实验梯队', title: '实验班', icon: <BookOpen className="text-purple-400 w-6 h-6" />, desc: '侧重理科强化与综合能力培养。', details: '主要针对指标到校较高分数段。', tags: ['理科强化'], level: 'Standard' },
        { type: '平行梯队', title: '素养班', icon: <Users className="text-slate-400 w-6 h-6" />, desc: '均衡化教学管理模型。', details: 'S形分配，确保教育公平。', tags: ['均衡'], level: 'Normal' }
    ],
    changjiang: [
        { type: '重点梯队', title: '强基班', icon: <Award className="text-emerald-500 w-6 h-6" />, desc: '精品化高分段班型。', details: '覆盖强基、统招、指标高分生源。', tags: ['高精尖'], level: 'Key' },
        { type: '实验梯队', title: '实验班', icon: <BookOpen className="text-emerald-400 w-6 h-6" />, desc: '传统强势重点班级。', details: '指标到校高分生源。', tags: ['传统重点'], level: 'Standard' },
        { type: '平行梯队', title: '素养班', icon: <Users className="text-slate-400 w-6 h-6" />, desc: '保证教学起点的绝对公平。', details: 'S形分布平均分配学生。', tags: ['均衡公平'], level: 'Normal' }
    ],
    linghu: [
      { type: '顶尖特设', title: '北大博雅人才班', icon: <GraduationCap className="text-blue-700 w-6 h-6" />, desc: '北大四星级共育基地。', details: '对接北大核心资源，主攻国内顶尖高校。', tags: ['北京大学', '四星基地'], level: 'Elite' },
      { type: '顶尖特设', title: '中科大物理共建班', icon: <Atom className="text-indigo-600 w-6 h-6" />, desc: '与中科大合作培养。', details: '侧重物理学科拔尖人才。', tags: ['中科大', '物理拔尖'], level: 'Elite' },
      { type: '重点梯队', title: '强基A班', icon: <Trophy className="text-amber-500 w-6 h-6" />, desc: '中考前120名生源。', details: '竞赛核心阵地，主攻强基与五大联赛。', tags: ['竞赛王牌'], level: 'Key' }
    ],
    gaoxin: [
      { type: '顶尖特设', title: '火箭班', icon: <Rocket className="text-sky-600 w-6 h-6" />, desc: '七中尖端力量，168联动。', details: '分人工智能、科技创新、人文素养三个方向。', tags: ['168联动', 'AI/科创'], level: 'Elite' },
      { type: '重点梯队', title: '博雅班', icon: <GraduationCap className="text-indigo-500 w-6 h-6" />, desc: '综合素质拔尖培养。', details: '面向统招线下10分左右学生。', tags: ['综合提升'], level: 'Key' },
      { type: '普惠梯队', title: '宏志班', icon: <Users className="text-emerald-500 w-6 h-6" />, desc: '最大规模的普惠型班型。', details: '面向指标到校生，侧重基础知识夯实。', tags: ['基础巩固'], level: 'Standard' }
    ],
    xinzhan: [
      { type: '顶尖特设', title: '杨武之班', icon: <Sigma className="text-rose-600 w-6 h-6" />, desc: '育人标杆，数理特长生。', details: '学校实施“强基计划”、打造育人品牌的重点班型。', tags: ['强基标杆', '数理特长'], level: 'Elite' },
      { type: '重点梯队', title: '横渠班', icon: <ScrollText className="text-amber-600 w-6 h-6" />, desc: '基础学科与素养双修。', details: '面向统招线或基地推荐生。', tags: ['博雅教育'], level: 'Key' },
      { type: '主体梯队', title: '卓越班', icon: <TrendingUp className="text-rose-500 w-6 h-6" />, desc: '分层教学。', details: '九中主体班型，确保精准提升。', tags: ['分层教学'], level: 'Standard' }
    ],
    zhonghuan: [
      { type: '顶尖特设', title: '英才班', icon: <Crown className="text-amber-500 w-6 h-6" />, desc: '高分段尖端班型。', details: '配备最强教师团队。课程难度较高。', tags: ['顶级师资'], level: 'Elite' },
      { type: '重点梯队', title: '创新实验班', icon: <FlaskConical className="text-orange-500 w-6 h-6" />, desc: '科研对接。', details: '参与高校或企业科研项目。', tags: ['科研对接'], level: 'Key' }
    ],
    shixin: [
      { type: '顶尖特设', title: '钱学森班', icon: <Rocket className="text-indigo-600 w-6 h-6" />, desc: '2025新设，科学素养。', details: '专注于创新能力培养。', tags: ['科学特长'], level: 'Elite' },
      { type: '顶尖特设', title: '茅以升班', icon: <TrendingUp className="text-blue-500 w-6 h-6" />, desc: '702分+ 顶级班型。', details: '2025预估：702分及以上。', tags: ['702分+'], level: 'Elite' }
    ]
  };

  classData.sipailou = classData.xinzhan;
  classData.xinqiao = classData.linghu;
  classData.baihuajing = classData.linghu;

  const activeCampusData = useMemo(() => classData[activeCampus] || classData['xinzhan'], [activeCampus]);
  const detailSlugByTitle = useMemo(() => classTypeDetails.indexByTitle || {}, []);

  const handleSchoolChange = (schoolId) => {
    setActiveSchool(schoolId);
    const firstCampus = campuses[schoolId][0].id;
    setActiveCampus(firstCampus);
  };

  const handleMapClick = (schoolId, campusId) => {
    setActiveSchool(schoolId);
    setActiveCampus(campusId);
  };

  const mapColorByClass = {
    'bg-blue-600': '#2563eb',
    'bg-rose-600': '#e11d48',
    'bg-purple-600': '#9333ea',
    'bg-emerald-600': '#059669',
    'bg-indigo-600': '#4f46e5',
    'bg-cyan-600': '#0891b2',
    'bg-violet-700': '#6d28d9',
    'bg-sky-600': '#0284c7',
    'bg-rose-700': '#be123c',
    'bg-red-800': '#991b1b',
    'bg-amber-600': '#d97706',
    'bg-blue-800': '#1e40af'
  };

  // 合肥轮廓图（细粒度）+ 校区标注
  const HefeiMap = () => {
    const activeSchoolCampuses = campuses[activeSchool] || [];
    const activeSchoolName = schools.find(s => s.id === activeSchool)?.name || '合肥重点校';
    const currentMapColor = mapColorByClass[currentCampus.color] || '#2563eb';
    const cityOutlinePath = 'M12 17 L22 11 L37 13 L48 8 L62 10 L72 16 L84 15 L91 27 L96 39 L91 51 L93 63 L87 75 L78 84 L69 92 L57 94 L46 90 L35 94 L24 88 L17 79 L14 68 L8 58 L7 46 L10 34 Z';

    const districtShapes = [
      { id: 'changfeng', name: '长丰', path: 'M29 10 L46 8 L42 19 L24 18 Z', label: { x: 35, y: 14 }, fill: 'rgba(226,232,240,0.52)' },
      { id: 'shushan', name: '蜀山', path: 'M24 29 L39 24 L48 31 L37 40 L26 35 Z', label: { x: 34, y: 31 }, fill: 'rgba(219,234,254,0.48)' },
      { id: 'gaoxin', name: '高新', path: 'M14 44 L26 35 L37 40 L34 54 L22 63 L13 56 Z', label: { x: 22, y: 50 }, fill: 'rgba(191,219,254,0.5)' },
      { id: 'luyang', name: '庐阳', path: 'M42 19 L58 19 L62 31 L48 33 L39 24 Z', label: { x: 50, y: 25 }, fill: 'rgba(224,231,255,0.52)' },
      { id: 'yaohai', name: '瑶海', path: 'M58 19 L77 20 L82 32 L69 41 L62 31 Z', label: { x: 70, y: 28 }, fill: 'rgba(199,210,254,0.5)' },
      { id: 'xinzhan', name: '新站', path: 'M74 13 L86 17 L90 29 L82 32 L77 20 Z', label: { x: 84, y: 23 }, fill: 'rgba(196,181,253,0.48)' },
      { id: 'baohe', name: '包河', path: 'M49 33 L69 41 L65 57 L51 62 L40 52 L37 40 Z', label: { x: 56, y: 49 }, fill: 'rgba(186,230,253,0.45)' },
      { id: 'jingkai', name: '经开', path: 'M37 52 L51 62 L46 76 L31 74 L25 62 Z', label: { x: 39, y: 66 }, fill: 'rgba(153,246,228,0.38)' },
      { id: 'binhu', name: '滨湖', path: 'M51 62 L66 57 L72 70 L67 83 L53 86 L46 76 Z', label: { x: 61, y: 74 }, fill: 'rgba(254,205,211,0.38)' },
      { id: 'feixi', name: '肥西', path: 'M18 62 L31 74 L30 86 L20 82 L15 72 Z', label: { x: 23, y: 75 }, fill: 'rgba(254,215,170,0.36)' }
    ];

    const terrainContours = [
      'M14 50 C23 42, 34 37, 49 37 C64 37, 78 45, 90 54',
      'M12 59 C24 49, 38 46, 52 47 C66 48, 79 56, 89 66',
      'M16 67 C29 58, 41 55, 55 56 C69 57, 81 64, 87 73',
      'M24 26 C34 31, 46 34, 58 33 C70 32, 80 28, 87 22',
      'M22 80 C33 73, 46 70, 59 72 C71 74, 80 79, 85 86'
    ];

    const arterialLines = [
      'M9 48 L22 40 L38 40 L52 46 L68 48 L86 43',
      'M33 14 L40 24 L47 34 L52 45 L57 58 L63 74',
      'M20 74 L35 66 L50 62 L66 62 L82 70'
    ];

    const centerPoint = activeSchoolCampuses.reduce(
      (acc, campus) => ({ x: acc.x + campus.pos.x, y: acc.y + campus.pos.y }),
      { x: 0, y: 0 }
    );
    const activeCenter = activeSchoolCampuses.length
      ? { x: centerPoint.x / activeSchoolCampuses.length, y: centerPoint.y / activeSchoolCampuses.length }
      : { x: 50, y: 52 };

    const mapMarkers = Object.entries(campuses).flatMap(([schoolKey, campusList]) =>
      campusList.map(campus => ({ schoolKey, campus }))
    );

    return (
      <div className="relative w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem] rounded-[2.6rem] overflow-hidden border border-white/70 shadow-[0_20px_55px_rgba(15,23,42,0.2)] bg-white/35 backdrop-blur-xl">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.86),rgba(255,255,255,0.16)_60%,transparent_86%)] z-20"></div>
        <div className="absolute inset-0 pointer-events-none opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:16px_16px] z-20"></div>
        <div
          className="absolute w-40 h-40 rounded-full blur-3xl opacity-30 z-20 transition-all duration-700"
          style={{ left: `calc(${activeCenter.x}% - 5rem)`, top: `calc(${activeCenter.y}% - 5rem)`, backgroundColor: currentMapColor }}
        ></div>

        <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-lg bg-slate-900/75 text-white text-[10px] font-semibold tracking-wide">
          {activeSchoolName} · 校区分布
        </div>

        <div className="absolute inset-0 z-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="hf-base-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(248,250,252,0.98)" />
                <stop offset="100%" stopColor="rgba(226,232,240,0.82)" />
              </linearGradient>
              <clipPath id="hf-outline-clip">
                <path d={cityOutlinePath} />
              </clipPath>
            </defs>

            <path d={cityOutlinePath} fill="url(#hf-base-gradient)" stroke="rgba(71,85,105,0.5)" strokeWidth="0.8" />

            <g clipPath="url(#hf-outline-clip)">
              {districtShapes.map(district => (
                <path
                  key={district.id}
                  d={district.path}
                  fill={district.fill}
                  stroke="rgba(100,116,139,0.4)"
                  strokeWidth="0.42"
                />
              ))}

              {terrainContours.map((contour, index) => (
                <path
                  key={`contour-${index}`}
                  d={contour}
                  fill="none"
                  stroke="rgba(148,163,184,0.5)"
                  strokeWidth="0.45"
                  strokeDasharray="1.2 1.3"
                />
              ))}

              {arterialLines.map((line, index) => (
                <path
                  key={`arterial-${index}`}
                  d={line}
                  fill="none"
                  stroke="rgba(71,85,105,0.34)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              ))}

              <path
                d="M15 60 C31 50, 46 49, 61 56 C73 61, 82 69, 89 70"
                fill="none"
                stroke="rgba(59,130,246,0.32)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {activeSchoolCampuses.slice(1).map((campus, index) => {
                const prev = activeSchoolCampuses[index];
                return (
                  <line
                    key={`${prev.id}-${campus.id}`}
                    x1={prev.pos.x}
                    y1={prev.pos.y}
                    x2={campus.pos.x}
                    y2={campus.pos.y}
                    stroke={currentMapColor}
                    strokeWidth="1.2"
                    strokeDasharray="2 1.4"
                    strokeOpacity="0.78"
                  />
                );
              })}
            </g>

            <path d={cityOutlinePath} fill="none" stroke="rgba(30,41,59,0.42)" strokeWidth="1" />

            {districtShapes.map(district => (
              <text
                key={`${district.id}-label`}
                x={district.label.x}
                y={district.label.y}
                fontSize="3.1"
                fontWeight="700"
                textAnchor="middle"
                fill="rgba(51,65,85,0.84)"
              >
                {district.name}
              </text>
            ))}
          </svg>
        </div>

        <div
          className="absolute z-30 px-2 py-1 rounded-lg bg-slate-900/80 text-white text-[9px] font-semibold shadow-md pointer-events-none"
          style={{ left: `calc(${activeCenter.x}% - 2.2rem)`, top: `calc(${activeCenter.y}% - 2rem)` }}
        >
          {activeSchoolName}
        </div>

        <div className="absolute inset-0 z-30">
          {mapMarkers.map(({ schoolKey, campus }) => {
            const isActive = campus.id === activeCampus;
            const isSchoolActive = schoolKey === activeSchool;
            const markerColor = mapColorByClass[campus.color] || '#64748b';
            return (
              <button
                key={`${schoolKey}-${campus.id}`}
                onClick={() => handleMapClick(schoolKey, campus.id)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${campus.pos.x}%`, top: `${campus.pos.y}%` }}
              >
                {isActive && (
                  <span className="absolute inset-[-2px] rounded-full animate-ping opacity-60" style={{ backgroundColor: markerColor }}></span>
                )}
                <span
                  className="absolute inset-[-5px] rounded-full blur-[2px]"
                  style={{ backgroundColor: isActive || isSchoolActive ? markerColor : '#cbd5e1', opacity: isActive ? 0.4 : isSchoolActive ? 0.26 : 0.14 }}
                ></span>
                <span
                  className="relative block rounded-full border-2 border-white shadow-md transition-all duration-300"
                  style={{
                    width: isActive ? '15px' : isSchoolActive ? '12px' : '10px',
                    height: isActive ? '15px' : isSchoolActive ? '12px' : '10px',
                    backgroundColor: isActive || isSchoolActive ? markerColor : '#94a3b8',
                    opacity: isActive ? 1 : isSchoolActive ? 0.85 : 0.58
                  }}
                ></span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap px-2 py-1 rounded-md text-[9px] font-semibold bg-slate-900 text-white shadow transition-all duration-200 ${
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                  }`}
                >
                  {campus.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="absolute left-2 right-2 bottom-2 z-30 px-2.5 py-1.5 rounded-xl bg-white/75 backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.16em] flex items-center gap-1">
            <MapPin size={10} /> Hefei Terrain Outline
          </span>
          <span className={`text-[10px] font-bold ${currentCampus.text}`}>{activeSchoolCampuses.length} 校区标注</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-700 bg-gradient-to-br ${currentCampus.bg} p-4 md:p-12 font-sans relative overflow-hidden`}>
      {/* Background Decor */}
      <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 blur-3xl transition-colors duration-700 ${currentCampus.color}`}></div>
      <div className={`absolute top-1/2 -left-24 w-64 h-64 rounded-full opacity-10 blur-3xl transition-colors duration-700 ${currentCampus.color}`}></div>

      {/* Hero Header */}
      <div className="max-w-6xl mx-auto mb-16 relative z-20">
        <div className="mb-8 flex justify-center lg:justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold">返回主页</span>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left flex-1">
                <span className={`inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-sm bg-white/80 border border-white/50 ${currentCampus.text}`}>
                权威发布 · 合肥名校深度盘点
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                合肥头部省示范高中<br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">
                    班型设置全景图
                </span>
                </h1>
                <div className={`w-32 h-2.5 mx-auto lg:mx-0 rounded-full transition-colors duration-500 ${currentCampus.color}`}></div>
            </div>
            
            <div className="flex-shrink-0 animate-in fade-in slide-in-from-right duration-1000">
                <HefeiMap />
            </div>
        </div>
      </div>

      {/* School Navigation Card */}
      <header className="max-w-6xl mx-auto mb-10 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/30 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/40 shadow-xl overflow-hidden">
          <div className="flex items-center gap-4 group cursor-default justify-center lg:justify-start">
            <div className={`p-4 rounded-2xl shadow-xl transition-all duration-500 group-hover:rotate-12 ${currentCampus.color}`}>
              <School className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                {schools.find(s => s.id === activeSchool)?.name}
                <span className={`transition-colors duration-500 text-sm md:text-lg block md:inline md:ml-2 font-bold ${currentCampus.text}`}>
                  当前所选院校
                </span>
              </h1>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row gap-2">
              {schools.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSchoolChange(s.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm md:text-base text-center ${
                    activeSchool === s.id 
                      ? `${currentCampus.color} text-white shadow-lg scale-105 z-10` 
                      : 'bg-white/40 text-slate-500 hover:bg-white/80 hover:text-slate-800'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Campus Navigation */}
      <div className="max-w-6xl mx-auto mb-12 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-lg flex flex-wrap gap-2 w-full sm:w-fit justify-center sm:justify-start">
          {currentCampusList.map((campus) => (
            <button
              key={campus.id}
              onClick={() => setActiveCampus(campus.id)}
              className={`px-8 py-3 rounded-xl transition-all duration-500 font-bold flex items-center justify-center gap-2 flex-1 sm:flex-none ${
                activeCampus === campus.id
                  ? `${campus.color} text-white shadow-lg scale-105 z-10`
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeCampus === campus.id ? 'bg-white' : campus.color}`}></div>
              <span className="whitespace-nowrap">{campus.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Class Cards Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {activeCampusData.map((cls, index) => (
          <div 
            key={`${activeCampus}-${index}`} 
            className={`group relative bg-white/70 backdrop-blur-sm border-2 border-transparent rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:${currentCampus.border} hover:bg-white transition-all duration-500 transform hover:-translate-y-2 flex flex-col min-h-[340px]`}
          >
            <div className={`self-start mb-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
              cls.level === 'Elite' ? 'bg-amber-100 text-amber-700' :
              cls.level === 'Key' ? 'bg-rose-50 text-rose-600' :
              'bg-slate-100 text-slate-500'
            }`}>
              {cls.type}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                {cls.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                {cls.title}
              </h3>
            </div>

            <p className="text-slate-600 text-base mb-6 leading-relaxed font-medium">
              {cls.desc}
            </p>

            <div className={`bg-slate-50/80 rounded-2xl p-5 mb-8 border-l-8 transition-colors duration-500 ${currentCampus.border}`}>
              <div className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-widest">Growth Path / 培养路径</div>
              <p className="text-slate-700 text-sm leading-relaxed font-semibold">
                {cls.details}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              {cls.tags.map((tag, tIndex) => (
                <span 
                  key={tIndex} 
                  className={`px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white/50 text-slate-600`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {detailSlugByTitle[cls.title] && (
              <div className="mt-5 pt-5 border-t border-slate-200/70">
                <Link
                  to={`/type-of-class/detail/${detailSlugByTitle[cls.title]}`}
                  className={`inline-flex items-center gap-1 text-sm font-bold ${currentCampus.text} hover:opacity-85`}
                >
                  查看详情
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Footer Branding */}
      <footer className="max-w-6xl mx-auto mt-20 relative z-10">
        <div className="bg-white/30 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className={`text-xl font-black mb-6 flex items-center gap-3 ${currentCampus.text}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${currentCampus.color}`}>
                  <Layers size={18} />
                </div>
                合分攻略 · 班型知识窗
              </h4>
              <div className="space-y-4">
                {[
                  { 
                    title: activeSchool === 'hf9z' ? "杨武之先生" : "S形/Z形分班", 
                    desc: activeSchool === 'hf9z' ? "合肥九中以此命名顶尖班型，彰显深厚的人才培养底蕴。" : "合肥高中通用的均衡分班法，旨在消除班级间的生源差异。" 
                  },
                  { 
                    title: "区位地理联动", 
                    desc: "点击右上角精细化地图中的圆点，可以直接查看该校区在合肥市的具体行政区位。" 
                  },
                  { 
                    title: "动态调整", 
                    desc: "合肥省示范高中通常在高二选科后进行班型重组，建议高一阶段夯实基础。" 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`w-1 h-auto rounded-full transition-all duration-500 group-hover:h-full group-hover:w-1.5 ${currentCampus.color}`}></div>
                    <div>
                      <span className="font-black text-slate-800 text-sm block">{item.title}</span>
                      <span className="text-slate-500 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <div className={`w-24 h-24 rounded-full mb-6 border-4 border-white shadow-xl flex items-center justify-center ${currentCampus.color}`}>
                 <Binary className="text-white w-12 h-12" />
              </div>
              <h5 className="text-2xl font-black text-slate-800 mb-2">怀天下抱负，做未来主人</h5>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                合肥名校林立，每一寸土地都孕育着梦想。选择合适的班型，从了解地理分布与升学路径开始。
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
