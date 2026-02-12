# 📚 智慧教育平台

基于 **React + Vite + Tailwind CSS** 前端 + **Java Spring Boot + PostgreSQL** 后端的现代化智慧教育管理系统。

---

## ✨ 功能特性

### 🏠 主页面
- 精美的导航栏设计
- 功能模块卡片展示
- 平台数据概览统计
- 响应式布局

### 📊 学情分析系统
- **概览看板**: 统计卡片、成绩趋势图、分布图、学生表格
- **学生名单**: 完整信息管理、编辑删除、批量导入
- **深度分析**: 柱状图、雷达图、AI 诊断建议
- **课程资源**: 资源卡片、分类筛选、上传下载
- **系统设置**: 个人信息、班级配置、通知、数据管理

### 🎓 中高考信息系统
- **信息聚合**: AI智能聚合竞赛、考试、升学政策
- **分类筛选**: 竞赛、考试、升学、院校、招生分类
- **搜索功能**: 关键词搜索信息
- **AI推荐**: 智能推荐重要信息
- **紧急提醒**: 截止日期临近提醒

### 👥 团队介绍
- **专家展示**: 团队成员信息展示
- **核心优势**: 自研AI模型、多维大数据、精准志愿填报
- **联系表单**: 快捷咨询功能

---

## 🛠️ 技术栈

### 前端
- **React 19** - UI 框架
- **React Router 7** - 路由管理
- **Vite 7** - 构建工具
- **Tailwind CSS 3** - 样式框架
- **Recharts 3** - 数据可视化
- **Lucide React** - 图标库

### 后端
- **Java 17** - 编程语言
- **Spring Boot 3.2.2** - 应用框架
- **Spring Data JPA** - ORM框架
- **PostgreSQL** - 关系型数据库
- **Maven** - 构建工具
- **SpringDoc OpenAPI** - API文档

---

## 📁 项目结构

```
个性化培养/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # 主页面
│   │   │   ├── Analytics.jsx      # 学情分析
│   │   │   ├── ExamInfo.jsx       # 考试信息
│   │   │   └── TeamInfo.jsx       # 团队介绍
│   │   ├── App.jsx                # 路由配置
│   │   ├── main.jsx               # React 入口
│   │   └── index.css              # 全局样式
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/                  # 后端项目
    ├── src/main/java/com/education/
    │   ├── controller/       # REST控制器
    │   ├── service/          # 业务逻辑
    │   ├── repository/       # 数据访问
    │   ├── entity/           # JPA实体
    │   └── config/           # 配置类
    ├── src/main/resources/
    │   └── application.yml   # 配置文件
    ├── pom.xml
    └── README.md
```

---

## 🚀 快速开始

### 环境要求
- **前端**: Node.js >= 16.0.0, npm >= 8.0.0
- **后端**: JDK 17+, Maven 3.6+, PostgreSQL 12+

### 1. 启动后端

```bash
# 进入后端目录
cd backend

# 配置数据库 (修改 application.yml)
# 创建数据库: CREATE DATABASE education_db;

# 启动后端服务
mvn spring-boot:run
```

后端服务: http://localhost:8080
Swagger文档: http://localhost:8080/api/swagger-ui.html

### 2. 启动前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端访问: http://localhost:5173

---

## 💻 前端开发详解

### 组件架构

#### 页面组件
- **Home.jsx** - 主页,包含导航栏、功能卡片、数据统计
- **Analytics.jsx** - 学情分析系统,包含侧边栏、多标签页、图表
- **ExamInfo.jsx** - 考试信息系统,分类筛选、搜索、AI推荐
- **TeamInfo.jsx** - 团队介绍,成员展示、核心优势、联系表单

#### 路由配置 (App.jsx)
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/analytics" element={<Analytics />} />
  <Route path="/exam-info" element={<ExamInfo />} />
  <Route path="/team-info" element={<TeamInfo />} />
</Routes>
```

### 状态管理
- 使用 React Hooks (useState, useMemo)
- 本地状态管理,无需 Redux
- 数据通过 props 传递

### 样式方案
- **Tailwind CSS** - 实用优先的 CSS 框架
- **响应式设计** - 移动端、平板、桌面端适配
- **渐变背景** - 现代化视觉效果
- **悬停动画** - 提升用户体验

### 数据可视化
- **Recharts** - 折线图、柱状图、饼图、雷达图
- **自定义配色** - 与整体设计风格统一
- **响应式图表** - 自适应容器大小

### 图标系统
- **Lucide React** - 轻量级图标库
- **一致性设计** - 统一的图标风格
- **可定制** - 支持大小、颜色调整

---

## 📊 页面路由

| 路由 | 页面 | 描述 |
|------|------|------|
| `/` | Home | 主页面,功能模块导航 |
| `/analytics` | Analytics | 学情分析系统 |
| `/exam-info` | ExamInfo | 中高考信息系统 |
| `/team-info` | TeamInfo | 团队介绍页面 |

---

## 🔌 API 端点

### 学生管理 (`/api/students`)
- `GET /` - 获取所有学生
- `GET /{id}` - 获取学生详情
- `GET /{id}/scores` - 获取学生成绩
- `POST /` - 创建学生
- `PUT /{id}` - 更新学生
- `DELETE /{id}` - 删除学生

### 考试信息 (`/api/exam-info`)
- `GET /` - 获取所有考试信息
- `GET /category/{category}` - 按分类查询
- `GET /search?keyword=xxx` - 搜索
- `GET /recommended` - 获取AI推荐

### 团队信息 (`/api/team`)
- `GET /` - 获取团队成员列表
- `GET /{id}` - 获取成员详情

---

## 🎨 设计特点

### 主页面
- 渐变背景设计
- 导航栏固定顶部
- 功能卡片悬停效果
- 3列响应式布局

### 学情分析
- 侧边栏导航
- 多标签页切换
- 图表数据可视化
- 表格信息管理

### 考试信息
- 分类标签筛选
- AI推荐侧边栏
- 紧急截止提醒
- 信息卡片展示

### 团队介绍
- 英雄展示区
- 成员卡片悬停效果
- 核心优势展示
- 联系表单

---

## � 前端开发工作流

### NPM 脚本
```bash
npm run dev      # 启动开发服务器 (热重载)
npm run build    # 生产环境构建
npm run preview  # 预览生产构建
```

### 热重载开发
- ✅ 修改代码后自动刷新浏览器
- ✅ 保持应用状态 (React Fast Refresh)
- ✅ 即时查看样式变化

### 调试技巧
```javascript
// 使用 React DevTools
// Chrome 扩展: React Developer Tools

// 控制台调试
console.log('数据:', data);

// 性能分析
console.time('渲染时间');
// ... 代码
console.timeEnd('渲染时间');
```

### 代码组织最佳实践
- **组件复用**: 提取公共组件到独立文件
- **状态提升**: 共享状态放在父组件
- **样式一致**: 使用 Tailwind 工具类
- **命名规范**: 组件用 PascalCase,函数用 camelCase

### Tailwind CSS 实用技巧
```jsx
// 响应式设计
<div className="w-full md:w-1/2 lg:w-1/3">

// 悬停效果
<button className="hover:bg-blue-700 transition-colors">

// 渐变背景
<div className="bg-gradient-to-r from-blue-500 to-purple-600">

// 深色模式 (可选)
<div className="bg-white dark:bg-gray-800">
```

### 性能优化建议
- ✅ 使用 `useMemo` 缓存计算结果
- ✅ 使用 `React.memo` 避免不必要的重渲染
- ✅ 图片使用 WebP 格式
- ✅ 代码分割 (动态 import)
- ✅ Vite 自动优化打包

### 常见问题解决
```bash
# 端口被占用
# 修改 vite.config.js 中的 server.port

# 样式不生效
# 检查 tailwind.config.js 的 content 配置

# 图表不显示
# 确保容器有明确的宽高
```

---

## �📦 部署指南

### 前端部署

```bash
# 构建生产版本
cd frontend
npm run build

# dist/ 目录部署到静态服务器
```

### 后端部署

```bash
# 打包 JAR
cd backend
mvn clean package

# 运行
java -jar target/education-backend-1.0.0.jar
```

---

## 📝 更新日志

### v2.0.0 (2026-02-12)
- ✅ 新增 Java Spring Boot 后端系统
- ✅ PostgreSQL 数据库集成
- ✅ RESTful API 完整实现
- ✅ Swagger API 文档
- ✅ 中高考信息系统
- ✅ 团队介绍页面

### v1.1.0 (2026-02-12)
- ✅ 新增主页面和导航系统
- ✅ 学情分析作为子模块
- ✅ 优化页面路由结构

### v1.0.0 (2026-02-12)
- ✅ 初始版本发布
- ✅ 学情分析系统完整功能

---

## 📄 许可证

MIT License

---

## 🙏 致谢

### 前端
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Lucide](https://lucide.dev/)

### 后端
- [Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org/)
- [SpringDoc](https://springdoc.org/)

---

**最后更新**: 2026-02-12
