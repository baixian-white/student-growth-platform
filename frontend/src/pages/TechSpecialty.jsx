import { Link } from 'react-router-dom';
import { Home, Search, TrendingUp, Target, Cpu, Code, Lightbulb, CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, Award, Clock, MessageCircle, Landmark, Trophy, Medal, Star, ExternalLink, Globe, BookOpen, Terminal, GraduationCap, Compass, Building2, MapPin, FileText, Calendar, ArrowRight, Rocket } from 'lucide-react';
import { useState } from 'react';

// 数据源：各省招生简章资讯库 (Mock 部分真实数据)
const admissionGuidesData = [
    { province: '北京', title: '2025年北京四中初升高科技特长生招生方案', date: '2025-05-10', tags: ['招生方案', '老牌名校'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2613.html', summary: '招生范围: 符合报名条件的初三年级学生...' },
    { province: '北京', title: '清华大学附属中学永丰学校2025年高中入学科技特长生招生简章', date: '2025-05-08', tags: ['清华附中', '海淀区'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2612.html', summary: '面向海淀区招收2025年高中入学科技特长生，招生计划：4人！' },
    { province: '北京', title: '北京航空航天大学实验学校中学部2025年高中入学科技特长生招生简章', date: '2025-05-08', tags: ['航模', '科技创新'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2611.html', summary: '招生计划：航模 科技创新，海淀区4人！' },
    { province: '北京', title: '北京一零一中矿大分校2025年高级中等学校科技特长生招生简章', date: '2025-05-07', tags: ['101中学', '海淀区'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2610.html', summary: '面向海淀区，招生科技特长生：4人！' },
    { province: '北京', title: '清华附中志新学校2025年高中入学科技特长生招生简章', date: '2025-05-07', tags: ['无线电', '机器人'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2609.html', summary: '无线电测向和智能机器人方向科技特长生：5人。' },
    { province: '北京', title: '北京市第十九中学2025年高中入学科技特长生招生简章', date: '2025-05-06', tags: ['艺术与科技'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2608.html', summary: '本区民乐8人，本区美术4人，本区科技6人' },
    { province: '上海', title: '2025年华东师范大学第二附属中学科技特长生招生简章', date: '2025-04-15', tags: ['科创', '四大名校'], url: 'https://www.baidu.com/s?wd=' + encodeURIComponent('2025年华东师范大学第二附属中学科技特长生招生简章'), summary: '面向全市招收具备科创、信息学潜质的优秀初中毕业生...' },
    { province: '广东', title: '2025年深圳中学特长生（科技类）招生简章', date: '2025-04-20', tags: ['深圳中学', '硬件'], url: 'https://www.baidu.com/s?wd=' + encodeURIComponent('2025年深圳中学特长生（科技类）招生简章'), summary: '招收在机器人、大疆机甲大师赛中有优异表现的学生...' },
    { province: '浙江', title: '杭州第二中学2025年科技特长生招生简章', date: '2025-04-22', tags: ['杭州二中', '信息学'], url: 'https://www.baidu.com/s?wd=' + encodeURIComponent('杭州第二中学2025年科技特长生招生简章'), summary: '重点考察CSP-J/S获奖情况及综合素质评价...' },
    { province: '河北', title: '2023石家庄二中自主招生实施方案', date: '2023-06-05', tags: ['领军计划', '卓远计划'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/1780.html', summary: '招生计划人数55人，新华区、桥西区、长安区、裕华区、高新区等五区范围内初三应届毕业生。' },
    { province: '河北', title: '2023石家庄一中自主招生实施方案', date: '2023-06-05', tags: ['英才计划', '学科特长'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/1779.html', summary: '计划为45人，新华区、桥西区、长安区、裕华区、高新区各初中应届优秀毕业生。' },
    { province: '河北', title: '2023河北衡水中学科技特长生测试公告', date: '2023-06-05', tags: ['衡水中学'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/1778.html', summary: '面向对象: 衡水市主城区2023年应届初三毕业生。' },
    { province: '河北', title: '2023年邯郸市第二中学科技特长生招生简章', date: '2023-06-01', tags: ['自主招生'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/1793.html', summary: '我市各中学2023年初三年级应届毕业生。具有良好的思想品德，扎实的理科基础，有创新意识和思维潜能。' },
    { province: '河北', title: '2023年保定市第三中学中考特长生自主招生方案', date: '2023-06-06', tags: ['自主招生'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/1791.html', summary: '面向保定市三区一城报考保定市第三中学的应届初三毕业生。' },
    { province: '河北', title: '2023年唐山市第十二高级中学普通高中招收特长生测试方案', date: '2023-06-06', tags: ['人工智能与编程'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/1790.html', summary: '特长生招生计划：人工智能与编程5人。' },
    { province: '河北', title: '2023年河北正定中学自主招生实施方案', date: '2023-06-06', tags: ['自主招生'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/1782.html', summary: '招生计划人数：58人。招生范围：石家庄市各县（市）、区的优秀初三应届毕业生。' },
    { province: '北京', title: '2025年北京二中科技特长生招生简章', date: '2025-05-15', tags: ['北京二中'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2585.html', summary: '2025年北京二中科技特长生招生方案公告。' },
    { province: '北京', title: '北京大兴一中2025年高级中等学校 科技特长生招生通告', date: '2025-05-15', tags: ['大兴一中'], url: 'http://www.kjtcsw.com/shengxue/zhaojian/2577.html', summary: '北京大兴一中2025年高级中等学校科技特长生招生通告发布。' },
    { province: '安徽', title: '合肥一中2025年自主招生实施方案（含科技类）', date: '2025-06-12', tags: ['合肥一中', '科技特长生', '自主招生'], url: 'http://www.hfyz.net/xwgk/tzgg/294631.html', summary: '合肥一中发布自主招生实施细则，涵盖科技创新、信息学、青少年电脑机器人等类别，招收名额分布在滨湖、瑶海、淝河、长江路等多个校区。' },
    { province: '安徽', title: '合肥一六八中学2025年科技类自主招生实施办法', date: '2025-06-13', tags: ['合肥一六八', '科技创新', '自主招生'], url: 'https://www.hf168.net/col159/50992', summary: '合肥一六八中学计划招收青少年科技创新、青少年信息学、青少年电脑机器人共计15人，重点面向具有突出科技潜质的初中毕业生。' },
    { province: '安徽', title: '芜湖市第一中学2025年科技特长生招生简章', date: '2025-06-13', tags: ['芜湖一中', '科技特长生', '信息学'], url: 'https://wh1z.whzhjy.cn/xyzx/31643.html', summary: '芜湖一中公布科技特长生招录计划，其中包括科技创新类（含机器人）2人，以及信息学类25人。' },
    { province: '安徽', title: '马鞍山市第二中学2025年科学特长生招生办法', date: '2025-06-17', tags: ['马鞍山二中', '科学特长生', '拔尖人才'], url: 'https://mp.weixin.qq.com/s/Q9m9sUYFFKWmR_up2Riong', summary: '马鞍山二中发布科学特长生招生办法，旨在选拔在自然科学及信息学方向具有突出潜质的优秀学生，计划招收50人。' },
    { province: '安徽', title: '安师大附中2025年科技和信息学特长生招生公告', date: '2025-06-12', tags: ['安师大附中', '科技和信息学', '特长生'], url: 'https://fz.ahnu.edu.cn/info/1054/31748.htm', summary: '安徽师范大学附属中学面向全市招收科技类特长生2人、信息学类特长生20人，录取依据中考成绩及综合素质评价。' },
    { province: '安徽', title: '合肥市第四中学2025年科技类自主招生实施办法', date: '2025-06-13', tags: ['合肥四中', '自主招生', '科技类'], url: 'https://mp.weixin.qq.com/s?__biz=MzU4MzYwMTE1NA==&mid=2247583949&idx=3&sn=a540baea68c74ce9e72d0726bb2817e2&chksm=fcdad75faa5fc3ab1c0f591d04c9a7d1979c59d7062c453949d408f7c213c154d091fae432de&scene=27', summary: '合肥四中科技类自主招生涵盖青少年科技创新、信息学、电脑机器人方向，旨在培养具有科学素养和实践能力的拔尖人才。' },
    { province: '安徽', title: '蚌埠第二中学20254年科技特长生招生简章', date: '2024-06-10', tags: ['蚌埠二中', '创新潜质'], url: 'http://www.bbez.com/20725.html', summary: '蚌埠第二中学招收创新潜质特长生，重点针对科技创新和学科竞赛等领域有突出特长的考生。' },
    { province: '安徽', title: '合肥市第七中学2025年科技类自主招生实施办法', date: '2025-06-19', tags: ['合肥七中', '自主招生', '科技特长'], url: 'https://www.hfqz.net.cn/xiaoyuangonggao/14898.html', summary: '合肥七中制定科技特长生自主招生实施细则，涵盖青少年科技创新、信息学和电脑机器人方向，2025年计划招收8名科技特长生。' },
    { province: '安徽', title: '合肥市第九中学2025年自主招生实施细则', date: '2025-06-17', tags: ['合肥九中', '自主招生', '科技创新'], url: 'http://www.hfjz.com/News/show/5350.html', summary: '合肥九中发布2025自主招生计划，新站、四牌楼按比例招收科技创新及电脑机器人特长生共50人，免除专业考核只看省市奖项。' },
    { province: '安徽', title: '阜阳市2025年普通高中特长生招生计划', date: '2025-06-30', tags: ['阜阳普通高中', '正式发布'], url: 'https://edu.fy.gov.cn/OpennessContent/show/2606668.html', summary: '阜阳市教育局关于下达2025年普通高中特长生招生计划的通知' }
];

const trainingCategories = [
    {
        title: '科技创新特长生',
        icon: <Lightbulb size={24} className="text-amber-500" />,
        bg: 'bg-amber-50',
        desc: '偏向发明创造、科学研究与工程设计。常见认可赛事如全国青少年科技创新大赛、明天小小科学家等。',
        advantages: [
            { title: '顶级科研背书', desc: '以青创赛为代表的核心白名单，高度展现学术潜质与自主探究能力。' },
            { title: '强基计划重点', desc: '众多顶尖"985"高校强基计划和综合评价极为看重相关科创文凭。' },
            { title: '论文专利产出', desc: '长周期的课题研究极易形成真实学术论文与科研专利成果。' },
            { title: '创新人格塑造', desc: '在反复试错与答辩论证中塑造极致的科学思辨精神体系。' }
        ],
        competitions: [
            '全国青少年科技创新大赛',
            '北京金鹏科技论坛',
            '北京“小院士”展示活动',
            '宋庆龄少年儿童发明奖',
            '明天“小小科学家”奖励活动',
            '全国中学生水科技发明比赛',
            '丘成桐中学科学奖',
            '全球发明大会中国区',
            '中国“芯”助力中国梦——全国青少年通信科技创新大赛'
        ]
    },
    {
        title: '信息学科技特长生',
        icon: <Code size={24} className="text-blue-500" />,
        bg: 'bg-blue-50',
        desc: '专注算法编程与计算机科学。主要路径为CSP-J/S认证以及信奥联赛(NOIP)，是含金量极高的硬核赛道。',
        advantages: [
            { title: '硬核降分通道', desc: 'CSP-J/S及NOIP证书是初升高及大学强基中最具说服力的“免死金牌”。' },
            { title: '计算思维提升', desc: '深度培养严谨逻辑思维与算法基础，显著提升理科综合解决问题能力。' },
            { title: '广泛名校认可', desc: '几乎所有顶级高中的理科实验班、竞赛班均将信奥奖项作为核心选拔标准。' },
            { title: '未来职业优势', desc: '人工智能时代基石，提前掌握编程核心技术，占据高薪就业前沿。' }
        ],
        competitions: [
            '全国中学生信息学奥林匹克联赛(NOIP)',
            '非专业级别的软件能力认证(CCF CSP-J/S)',
            '全国青少年人工智能创新挑战赛',
            '全国中小学信息技术创新与实践大赛(NOC)',
            '世界机器人大会青少年电子信息智能创新大赛(WRC)',
            '蓝桥杯全国软件和信息技术专业人才大赛',
            '全国创意编程与智能设计大赛'
        ]
    },
    {
        title: '机器人科技特长生',
        icon: <Cpu size={24} className="text-emerald-500" />,
        bg: 'bg-emerald-50',
        desc: '结合软硬件，考察结构搭建与控制编程。赛事包括全国中小学电脑制作活动、VEX、大疆机甲大师赛等。',
        advantages: [
            { title: '跨学科综合力', desc: '深度融合机械结构、电子电路与编程，培养极致的STEAM跨学科能力。' },
            { title: '特长招生大户', desc: 'NOC及各类机器人竞赛受各地教育局高度认可，是特长生招生的热门赛道。' },
            { title: '动手实战锤炼', desc: '从零到一的硬件搭建到软件调试，全方位磨练真实的工程问题解决能力。' },
            { title: '团队协作精神', desc: '赛事多为小组协作制，有效锻炼领导沟通及抗压实战心理素质。' }
        ],
        competitions: [
            '全国青少年人工智能创新挑战赛',
            '全国中小学信息技术创新与实践大赛(NOC)',
            '世界机器人大会青少年机器人设计与信息素养大赛',
            '全国青少年科技教育成果展示大赛',
            '全国青少年航天创新大赛',
            '“北斗杯”全国青少年空天科技体验与创新大赛',
            '蓝桥杯全国软件和信息技术专业人才大赛',
            'VEX机器人挑战赛、RECRC、FLL、Botball、RoboRAVE'
        ]
    },
    {
        title: '航模与无人机科技特长生',
        icon: <Rocket size={24} className="text-indigo-500" />,
        bg: 'bg-indigo-50',
        desc: '侧重空气动力学、飞行控制与航空器组装。代表赛事为“飞向北京-飞向太空”全国青少年航空航天模型教育竞赛。',
        advantages: [
            { title: '强国战略导向', desc: '契合国家航空航天发展战略，北航等理工防务名校极其看重该特长。' },
            { title: '特长生蓝海', desc: '相较于信息学，航模无人机赛道竞争相对缓和，部分地区升学降分优势明显。' },
            { title: '综合科学视野', desc: '在实战中学习空气动力学、无线电通讯与气象学，大幅拓宽视野。' },
            { title: '专注力与实操', desc: '高强度的飞行训练极大地锻炼敏捷性、空间感知及高度专注的心理素质。' }
        ],
        competitions: [
            '全国青少年无人机大赛',
            '“飞向北京，飞向太空”全国青少年航空航天模型教育竞赛活动',
            '全国青少年航天创新大赛',
            '全国青少年模拟飞行锦标赛'
        ]
    },
    {
        title: '天文科技特长生',
        icon: <Globe size={24} className="text-purple-500" />,
        bg: 'bg-purple-50',
        desc: '涉及天体物理、天文观测与理论。核心赛事为全国中学生天文知识竞赛，是部分特色中学的招生青睐方向。',
        advantages: [
            { title: '高潜竞争优势', desc: '天文奥赛属于小众且高维度的拔尖赛道，极易受顶尖特色高中的重点关注。' },
            { title: '数理深度强化', desc: '天文测算高度依赖深厚的物理与数学功底，长远赋能基础理科及强基计划。' },
            { title: '名校对口特招', desc: '可直接对接开设一流天文学及空间物理专业的高校特殊优录通道。' },
            { title: '宏大世界观', desc: '培养仰望星空的视野境界与持之以恒的科学探索精神，拓展思维纵深。' }
        ],
        competitions: [
            '全国中学生天文奥林匹克竞赛',
            '全国中学生天文知识竞赛'
        ]
    },
    {
        title: '车模海模无线电测向',
        icon: <Target size={24} className="text-rose-500" />,
        bg: 'bg-rose-50',
        desc: '偏向传统竞技科技项目与无线电追踪。包括全国青少年车辆模型、航海模型竞赛及全国青少年无线电测向锦标赛。',
        advantages: [
            { title: '体教融合典范', desc: '既考验手工动手能力，又需要极强的户外奔跑适应力，属典型的体育科技项目。' },
            { title: '传统名校青睐', desc: '因自带国防教育与通信科普属性，广受各地教育局与传统老牌高中的支持。' },
            { title: '低门槛高收益', desc: '相较数理竞赛起步更易，适合依靠刻苦训练与严谨细致脱颖而出的学生。' },
            { title: '心智抗压磨砺', desc: '野外复杂环境下的测向搜寻，极大增强学生的独立作风与抗挫折应变力。' }
        ],
        competitions: [
            '“驾驭未来”全国青少年车辆模型教育竞赛',
            '“我爱祖国海疆”全国青少年航海模型教育竞赛',
            '全国青少年无线电测向锦标赛'
        ]
    }
];

const provinces = ['全部', '北京', '河北', '山西', '辽宁', '吉林', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '陕西', '甘肃', '广西', '新疆', '天津', '上海', '重庆'];

// 数据源：白名单阶梯
const whitelistTiers = [
    {
        level: 'T0 殿堂级 (免死金牌)',
        icon: <Trophy size={20} className="text-yellow-500" />,
        bg: 'bg-gradient-to-r from-yellow-50 to-white border-yellow-200',
        titleColor: 'text-yellow-700',
        tagBg: 'bg-yellow-100 text-yellow-800',
        match: '全国青少年信息学奥林匹克联赛 (NOIP) / CSP-J/S',
        desc: '含金量无可匹敌。高中阶段拿牌直接挂钩清北强基破格，初中阶段拿普及组(CSP-J)省一或提高组(CSP-S)二等可以直接被顶尖高中实验班锁定签约。唯一真正的硬核出路。'
    },
    {
        level: 'T1 钻石级 (敲门砖)',
        icon: <Medal size={20} className="text-indigo-500" />,
        bg: 'bg-gradient-to-r from-indigo-50 to-white border-indigo-200',
        titleColor: 'text-indigo-700',
        tagBg: 'bg-indigo-100 text-indigo-800',
        match: '全国青少年科技创新大赛 / 宋庆龄少年儿童发明奖 / 丘成桐科学奖',
        desc: '传统老牌教育部白名单。对于不擅长写代码但懂硬件、爱动手发明、论文答辩能力强的学生极其友好。各省初升高科技类特长生的主流“收割机”。'
    },
    {
        level: 'T2 铂金级 (加分项)',
        icon: <Star size={20} className="text-emerald-500" />,
        bg: 'bg-gradient-to-r from-emerald-50 to-white border-emerald-200',
        titleColor: 'text-emerald-700',
        tagBg: 'bg-emerald-100 text-emerald-800',
        match: '全国中小学信息技术创新与实践大赛(NOC) / 全国机甲大师赛 / 各省市白名单机甲赛',
        desc: '相对门槛较低的普惠性科创赛。适合初入门玩家作为第一步刷简历用，在部分省级示范高中也有降分录取空间，但不可通杀顶级牛校。'
    }
];

// 数据源：初中三年时间轴
const timelineData = [
    { grade: '初一 (六年级衔接)', focus: '发掘兴趣 / 锚定赛道', details: '尽早接触 Python 或 C++ 编程，参加 CSP-J 体验赛；如果不擅长代码，则转向机器人和硬件科创项目，尽早确定未来走哪一条特长通道。' },
    { grade: '初二 (打榜黄金期)', focus: '疯狂收割教育部白名单', details: '初二是压力最小的拿奖期。必须在这一年拿到省级二等及以上的白名单证书（省一最佳）。一旦进入初三上学期，再去比赛就来不及了。' },
    { grade: '初三上学期', focus: '简历投递 / “游园会”签约', details: '整理三年来所有含金量证书做成电子简历集。紧盯目标高中的“冬令营”或“开放日（游园会）”。极少数顶级 Cpp 苗子此时会被名校直接私下承诺签约保底。' },
    { grade: '初三 (4月-5月)', focus: '发布特招简章与校测', details: '各地教育局统一下发特长生招生名额表。家长进行网上报名申报特长资格；学生到报考高中参加实地“上机测试”或“科创答辩”。' },
    { grade: '中考后 (6月)', focus: '分数出炉 / 底线录取', details: '哪怕校考拿了第一名，也必须参加中考。特长生只享受在分数线上的“降分（如降20分、降至重点线底线等）”，必须死保文化课不拉垮。' }
];

// 数据源：答疑
const faqs = [
    { q: '市面上的“图形化编程考级”、“机器人等级认证”有用吗？', a: '在中考特招阶段一律没用！这是教培机构最容易骗家长的地方。升学唯一的认证标准是【教育部公布的竞赛白名单】里的获奖证书，其他任何花钱就能考的等级证书在名校筛简历时都会被直接扔进垃圾桶。' },
    { q: '走科技特长生就不用管文化课了吗？', a: '完全大错特错！初升高的科技特长生本质上是“中考降分录取保护”。比如某超级高中的统招线是680分，对特长生可能放宽到640分，如果你连640都考不到，拿了全国冠军也白搭，必须两条腿走路。' },
    { q: '我只是校内科技节一等奖或者区里的小比赛一等奖，算是特长生吗？', a: '不算硬核特长生。顶尖名校在筛选简历时，起步门槛通常是【省级二等奖】以上，市一、区一只能在区所属的一般示范高中里可能有微小的敲门作用。' }
];

// 数据源：特长生资源导航
const resourceNavData = [
    {
        category: '升学路径库',
        icon: <GraduationCap size={24} className="text-blue-600" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        titleColor: 'text-blue-900',
        hoverBorder: 'hover:border-blue-300',
        links: [
            { title: '中学招生简章', url: 'http://www.kjtcsw.com/shengxue/zhaojian/' },
            { title: '大学强基计划', url: 'http://www.kjtcsw.com/shengxue/qiangji/' },
            { title: '大学英才计划', url: 'http://www.kjtcsw.com/shengxue/yingcai/' },
            { title: '三位一体（综合评价）', url: 'http://www.kjtcsw.com/shengxue/swyt/' }
        ]
    },
    {
        category: '权威白名单赛事',
        icon: <Award size={24} className="text-rose-600" />,
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-100',
        titleColor: 'text-rose-900',
        hoverBorder: 'hover:border-rose-300',
        links: [
            { title: '科技创新大赛', url: 'http://www.kjtcsw.com/baimingdan/castic/' },
            { title: '信息技术创新与实践(NOC)', url: 'http://www.kjtcsw.com/baimingdan/noc/' },
            { title: '全国青少年无人机大赛', url: 'http://www.kjtcsw.com/baimingdan/wurenji/' },
            { title: '蓝桥杯大赛', url: 'http://www.kjtcsw.com/baimingdan/lanqiaobei/' },
            { title: '飞北赛(航空航天模型)', url: 'http://www.kjtcsw.com/baimingdan/feibei/' }
        ]
    },
    {
        category: '高含金量国际赛',
        icon: <Globe size={24} className="text-purple-600" />,
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100',
        titleColor: 'text-purple-900',
        hoverBorder: 'hover:border-purple-300',
        links: [
            { title: 'USACO (美国计算机奥赛)', url: 'http://www.kjtcsw.com/jingsai/USACO/' },
            { title: 'FLL 科创活动', url: 'http://www.kjtcsw.com/jingsai/fll/' },
            { title: 'Botball 机器人挑战赛', url: 'http://www.kjtcsw.com/jingsai/Botball/' }
        ]
    },
    {
        category: '信息学奥赛专区',
        icon: <Terminal size={24} className="text-emerald-600" />,
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-100',
        titleColor: 'text-emerald-900',
        hoverBorder: 'hover:border-emerald-300',
        links: [
            { title: '各省报考动态', url: 'http://www.kjtcsw.com/xinxixueaosai/dongtai/' },
            { title: '历年获奖名单', url: 'http://www.kjtcsw.com/xinxixueaosai/huojiang/' },
            { title: '最新信奥资讯', url: 'http://www.kjtcsw.com/xinxixueaosai/xinao/' }
        ]
    },
    {
        category: '专业等级考试',
        icon: <BookOpen size={24} className="text-amber-600" />,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100',
        titleColor: 'text-amber-900',
        hoverBorder: 'hover:border-amber-300',
        links: [
            { title: '青少年人工智能编程水平测试', url: 'http://www.kjtcsw.com/kaoshi/bcspcs/' },
            { title: '青少年人工智能技术水平测试', url: 'http://www.kjtcsw.com/kaoshi/jsspcs/' }
        ]
    }
];

import { X } from 'lucide-react';

export default function TechSpecialty() {
    const [openFaq, setOpenFaq] = useState(0);
    const [activeProvince, setActiveProvince] = useState('全部');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredGuides = (activeProvince === '全部'
        ? [...admissionGuidesData]
        : admissionGuidesData.filter(item => item.province === activeProvince)
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 顶部导航栏 */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
                                    <Cpu size={24} />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">科技特长生解析</h1>
                            </div>

                            {/* 系统内导航切换 */}
                            <div className="ml-8 flex bg-gray-100 p-1 rounded-xl">
                                <Link to="/exam-info" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Search size={16} />信息查询
                                    </div>
                                </Link>
                                <Link to="/exam-analysis" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} />信息分析
                                    </div>
                                </Link>
                                <Link to="/strong-base" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} />强基计划
                                    </div>
                                </Link>
                                <div className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-emerald-700 shadow-sm border border-gray-200 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={16} />科技特长生
                                    </div>
                                </div>
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

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* Header 简介区 */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 max-w-2xl text-left">
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                            多元化录取与科创专项通道
                        </span>
                        <h2 className="text-4xl font-extrabold mb-4 leading-tight">什么是“科技特长生”？</h2>
                        <p className="text-emerald-100 text-lg leading-relaxed">
                            指在科技创新、编程（信息学奥赛）、机器人、发明创造等领域表现突出，并通过考核在升学（小升初、初升高或高校综合评价、强基计划等）中享受降分录取等优待政策的学生群体。
                        </p>
                    </div>
                </div>

                {/* 科技特长生培养方向 */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <GraduationCap className="text-indigo-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">科技特长生培养方向</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trainingCategories.map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedCategory(cat)}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-emerald-200 transition-all duration-300 flex flex-col items-center text-center cursor-pointer group"
                            >
                                <div className={`w-14 h-14 ${cat.bg} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">{cat.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {cat.desc}
                                </p>
                                <div className="mt-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium flex items-center gap-1">
                                    查看核心赛事方案 <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 录取方式与报考提醒 */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <HelpCircle className="text-emerald-600" size={24} />
                                <h3 className="text-xl font-bold text-gray-900">特长优势能怎么用？</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                                    <p className="text-gray-600 text-sm leading-relaxed"><strong>中考特招/统招降分：</strong>许多重点高中每年设有科技特长生专属名额，可降数十分录取编入理科实验班。</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                                    <p className="text-gray-600 text-sm leading-relaxed"><strong>高校强基计划破格入选：</strong>五大学科竞赛银牌及以上，可破格进入清北复交等顶尖高校考查名单。</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                                    <p className="text-gray-600 text-sm leading-relaxed"><strong>综合评价招生加分项：</strong>部分高校综评系统将科技白名单赛事的国奖作为初审赋分重点依据。</p>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 bg-amber-50">
                            <div className="flex items-center gap-3 mb-6">
                                <AlertTriangle className="text-amber-600" size={24} />
                                <h3 className="text-xl font-bold text-gray-900">重要报考提醒与避雷</h3>
                            </div>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-3">
                                    <ShieldAlert className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                                    <div>
                                        <h4 className="font-bold text-amber-900 text-sm mb-1">野鸡比赛泛滥陷阱</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">市面上某些交钱包奖的商业“机器人比赛”和“编程考级”在升学时毫不作数，认准《教育部白名单赛事》才是正道。</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldAlert className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                                    <div>
                                        <h4 className="font-bold text-amber-900 text-sm mb-1">切勿本末倒置轻视文化课</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">特长生只是“入场券敲门砖”。无论是中考降分还是强基录取，最终仍被严格的文化课分数线兜底，千万不能因为搞科创彻底放弃平时主科。</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 科技特长生招生简章资讯库 */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <FileText className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">各省市科技特长生招生简章</h2>
                        <span className="ml-auto flex items-center gap-1 text-sm text-gray-500">
                            <MapPin size={14} />按地区筛选
                        </span>
                    </div>

                    {/* 省份切换 Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {provinces.map(prov => (
                            <button
                                key={prov}
                                onClick={() => setActiveProvince(prov)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeProvince === prov
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {prov}
                            </button>
                        ))}
                    </div>

                    {/* 招生简章列表 */}
                    {filteredGuides.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {filteredGuides.map((guide, idx) => (
                                <a
                                    key={idx}
                                    href={guide.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    <div className="flex-grow space-y-3">
                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">
                                            {guide.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                            {guide.summary}
                                        </p>
                                        <div className="flex items-center flex-wrap gap-3 pt-1">
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <Calendar size={14} />
                                                {guide.date}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                                                {guide.province}
                                            </span>
                                            {guide.tags.map(tag => (
                                                <span key={tag} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                                        <ArrowRight size={20} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                            <Search className="w-12 h-12 text-gray-300 mb-3" />
                            <h3 className="text-gray-900 font-medium mb-1">正在收集中</h3>
                            <p className="text-sm text-gray-500">该地区的科技特长生招生简章资讯持续完善中...</p>
                        </div>
                    )}
                </div>

                {/* 特长生资源导航（复刻科技特长生网内容） */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <Compass className="text-emerald-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">一站式特长生资源导航</h2>
                        <span className="ml-auto text-sm text-gray-500">数据选自：<a href="http://www.kjtcsw.com/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 underline underline-offset-2">科技特长生网</a></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resourceNavData.map((section, idx) => (
                            <div key={idx} className={`rounded-2xl border ${section.borderColor} ${section.hoverBorder} bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`}>
                                <div className={`${section.bgColor} px-6 py-4 flex items-center gap-3 border-b border-gray-100`}>
                                    <div className="bg-white p-2 rounded-xl shadow-sm">
                                        {section.icon}
                                    </div>
                                    <h3 className={`font-bold ${section.titleColor} text-lg`}>{section.category}</h3>
                                </div>
                                <div className="p-4">
                                    <ul className="space-y-2">
                                        {section.links.map((link, lIdx) => (
                                            <li key={lIdx}>
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between group/link p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <span className="text-sm font-medium text-gray-700 group-hover/link:text-emerald-600 transition-colors truncate pr-4">
                                                        {link.title}
                                                    </span>
                                                    <ExternalLink size={14} className="text-gray-400 group-hover/link:text-emerald-500 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Modal for Category Competitions */}
            {selectedCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCategory(null)}>
                    <div
                        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl scale-100 opacity-100 transition-transform flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex-shrink-0">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} className="text-white" />
                            </button>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                    {selectedCategory.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedCategory.title}培养方案</h3>
                                    <p className="text-emerald-100 text-sm mt-1">直通理想学府的专业科创路径</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                            {/* 简介区 */}
                            <div className="mb-8 bg-emerald-50/50 p-4 rounded-xl text-emerald-900 border border-emerald-100/50 leading-relaxed text-sm">
                                {selectedCategory.desc}
                            </div>

                            {/* 核心优势/政策支持 */}
                            <div className="mb-8">
                                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
                                    <Star className="text-amber-500" size={20} />
                                    核心优势与政策支持
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedCategory.advantages && selectedCategory.advantages.map((adv, idx) => (
                                        <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                                            <h5 className="font-bold text-gray-800 text-sm mb-1">{adv.title}</h5>
                                            <p className="text-gray-500 text-xs leading-relaxed">{adv.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 核心赛事列表 */}
                            <div className="mb-8">
                                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-lg">
                                    <Award className="text-amber-500" size={20} />
                                    对标教育部白名单核心赛事
                                </h4>

                                <ul className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    {selectedCategory.competitions && selectedCategory.competitions.map((comp, idx) => (
                                        <li key={idx} className="flex items-start gap-3 hover:translate-x-1 transition-transform">
                                            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shadow-sm">
                                                {idx + 1}
                                            </div>
                                            <span className="text-gray-700 font-medium leading-relaxed">{comp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 1对1测评 CTA */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 text-indigo-100 opacity-50">
                                    <Target size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-bold text-indigo-900 text-lg mb-2 flex items-center gap-2">
                                        <MessageCircle size={20} />
                                        获取专属规划方案
                                    </h4>
                                    <p className="text-indigo-700 text-sm mb-5 max-w-md">1对1专业测评，科学评估孩子科创潜能。请填写信息，等待规划导师联系您，为您定制专属学习与打榜时间轴！</p>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
                                            <FileText size={18} />
                                            预约1对1测评
                                        </button>
                                        <button className="flex-1 bg-white hover:bg-gray-50 text-indigo-700 font-medium py-3 px-6 rounded-xl transition-colors border border-indigo-200 shadow-sm flex items-center justify-center gap-2">
                                            在线咨询入口
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
