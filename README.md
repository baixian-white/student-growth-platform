# 🎓 Student Growth Platform (学生成长平台)

一个基于 **React + Spring Boot + PostgreSQL** 的现代化智慧教育管理系统,提供学情分析、考试信息聚合、团队管理等功能。

---

## ✨ 主要功能

### 📊 学情分析系统
- 学生成绩数据可视化(趋势图、分布图、雷达图)
- 学生信息管理(增删改查、批量导入)
- AI 智能诊断与学习建议
- 课程资源管理

### 🎯 中高考信息系统
- AI 智能聚合竞赛、考试、升学政策信息
- 多维度分类筛选(竞赛/考试/升学/院校/招生)
- 智能推荐重要信息
- 截止日期提醒

### 👥 团队管理
- 专家团队信息展示
- 核心优势介绍
- 在线咨询功能

---

## 🛠️ 技术栈

### 前端 (Frontend)
- **React 19** - UI 框架
- **React Router 7** - 路由管理
- **Vite 7** - 构建工具
- **Tailwind CSS 3** - 样式框架
- **Recharts 3** - 数据可视化
- **Lucide React** - 图标库

### 后端 (Backend)
- **Java 17** - 编程语言
- **Spring Boot 3.2.2** - 应用框架
- **Spring Data JPA** - ORM 框架
- **PostgreSQL** - 关系型数据库
- **Maven** - 构建工具
- **SpringDoc OpenAPI** - API 文档

---

## 📁 项目结构

```
student-growth-platform/
├── frontend/                 # 前端项目 (React + Vite)
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   ├── Home.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── ExamInfo.jsx
│   │   │   └── TeamInfo.jsx
│   │   ├── App.jsx          # 路由配置
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # 后端项目 (Spring Boot)
    ├── src/main/java/com/education/
    │   ├── controller/      # REST 控制器
    │   ├── service/         # 业务逻辑
    │   ├── repository/      # 数据访问
    │   ├── entity/          # JPA 实体
    │   └── config/          # 配置类
    ├── src/main/resources/
    │   └── application.yml  # 配置文件
    └── pom.xml
```

---

## 🚀 快速开始

### 环境要求
- **前端**: Node.js >= 16, npm >= 8
- **后端**: JDK 17+, Maven 3.6+, PostgreSQL 12+

### 1. 克隆项目

```bash
git clone https://github.com/您的用户名/student-growth-platform.git
cd student-growth-platform
```

### 2. 启动后端

```bash
# 进入后端目录
cd backend

### 2. 环境配置

本项目需要配置 PostgreSQL 数据库及相关环境。**详细的连接配置和环境搭建指南，请参考：[ENVIRONMENT.md](file:///Users/baixian/Desktop/code/student-growth-platform/ENVIRONMENT.md)**

### 3. 启动后端
mvn spring-boot:run
```

后端服务: http://localhost:8080/api  
API 文档: http://localhost:8080/api/swagger-ui.html

### 3. 启动前端

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

## 📊 API 端点

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
- `GET /recommended` - 获取 AI 推荐

### 团队信息 (`/api/team`)
- `GET /` - 获取团队成员列表
- `GET /{id}` - 获取成员详情

---

## 🗄️ 数据库表结构

### students (学生表)
- id, name, grade, class_name
- enrollment_date, total_score, average_score
- created_at, updated_at

### scores (成绩表)
- id, student_id, subject, score
- exam_date, rank, percentile

### exam_info (考试信息表)
- id, title, category, date, deadline
- source, summary, importance, tags
- ai_recommended, link

### team_members (团队成员表)
- id, name, role, bio
- image_url, tags

---

## 🎨 功能特色

### 现代化 UI 设计
- 渐变背景与玻璃态效果
- 流畅的动画过渡
- 响应式布局(支持移动端、平板、桌面)

### 数据可视化
- 成绩趋势折线图
- 分数分布饼图
- 能力雷达图
- 实时数据更新

### 智能功能
- AI 学习诊断建议
- 智能信息推荐
- 截止日期提醒

---

## 📦 部署

### 前端部署

```bash
cd frontend
npm run build
# 将 dist/ 目录部署到静态服务器
```

### 后端部署

```bash
cd backend
mvn clean package
java -jar target/education-backend-1.0.0.jar
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

如有问题或建议,请通过以下方式联系:

- 提交 Issue: [GitHub Issues](https://github.com/您的用户名/student-growth-platform/issues)
- 邮箱: your.email@example.com

---

## 🙏 致谢

感谢以下开源项目:

- [React](https://react.dev/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

**⭐ 如果这个项目对您有帮助,请给个 Star!**
