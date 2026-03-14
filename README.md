# Student Growth Platform

学生成长与升学规划平台，聚合升学资讯、学校班型分析、专题资料与 AI 规划入口，适合做本地调试、内容整理与容器化部署。

当前仓库的实际技术栈：

- 前端：React + Vite + Tailwind CSS
- 后端：FastAPI + SQLAlchemy + PostgreSQL
- 部署：Docker Compose + Nginx

说明：旧版 README 中提到的 Spring Boot 已不再是当前实现，请以本文件和源码为准。

## 功能概览

- 升学资讯查询：支持分页、关键词、地区、学校、学段筛选
- 班型分析：覆盖合肥多所头部高中的班型与校区信息
- 专题导航：强基计划、科技特长生、白名单赛事、信息学等
- AI 规划入口：面向升学路径规划的前端工作台
- 资讯抓取：支持定时抓取、手动触发抓取、批量导入
- 缓存兜底：前端资讯页支持本地缓存展示

## 技术栈

### 前端

- React 19
- React Router 7
- Vite 5
- Tailwind CSS 3
- Recharts
- Lucide React

### 后端

- Python 3.10+
- FastAPI
- SQLAlchemy Async
- asyncpg
- APScheduler
- requests
- beautifulsoup4

### 部署

- Docker Compose
- PostgreSQL 15
- Nginx

## 项目结构

```text
student-growth-platform/
|- frontend/                  # React 前端
|  |- src/
|  |  |- pages/              # 页面
|  |  |- data/               # 静态数据
|  |  |- docs/               # 页面引用资料
|  |  |- services/           # API 封装
|  |  `- utils/              # 缓存与工具函数
|  |- nginx.conf
|  `- package.json
|- python_backend/           # FastAPI 后端
|  |- main.py                # API 与定时任务入口
|  |- models.py              # 数据模型
|  |- schemas.py             # 响应模型
|  |- database.py            # 数据库配置
|  |- requirements.txt
|  `- scripts/
|- crawler/                  # 抓取逻辑
|- docker-compose.yml        # 一键启动前后端与数据库
|- init_db.sql               # PostgreSQL 初始化脚本
|- STARTUP.md                # 启动补充说明
`- DEPLOY_ALIYUN.md          # 阿里云部署文档
```

## 页面路由

当前前端主要页面：

| 路由 | 说明 |
| --- | --- |
| `/` 或 `/platform` | 平台首页 |
| `/exam-info` | 升学资讯查询 |
| `/exam-analysis` | 资讯分析 |
| `/type-of-class` | 班型分析 |
| `/strong-base` | 强基计划专题 |
| `/tech-specialty` | 科技特长生专题 |
| `/whitelist-competitions` | 白名单赛事 |
| `/informatics-olympiad` | 信息学专题 |
| `/guihua` | AI 规划入口 |

## 快速开始

推荐两种方式：

- 本地开发：适合调试前后端
- Docker Compose：适合整体跑通

### 方式一：本地开发

#### 1. 环境要求

- Node.js 18+
- Python 3.10+
- PostgreSQL 15+

#### 2. 初始化数据库

可以手动建库，也可以执行根目录的 `init_db.sql`。

推荐数据库连接：

```env
DATABASE_URL=postgresql+asyncpg://education_user:education_pass@localhost:5432/education_db
```

#### 3. 配置环境变量

将根目录 `.env.example` 复制为 `.env`，建议至少包含：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
POSTGRES_USER=education_user
POSTGRES_PASSWORD=education_pass
POSTGRES_DB=education_db
DATABASE_URL=postgresql+asyncpg://education_user:education_pass@localhost:5432/education_db
```

说明：

- `DEEPSEEK_API_KEY` 主要用于抓取任务
- 本文档默认使用 PostgreSQL，与当前 Compose 配置保持一致

#### 4. 启动后端

```bash
cd python_backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

启动后可访问：

- API：`http://localhost:8080`
- Swagger 文档：`http://localhost:8080/docs`

#### 5. 启动前端

```bash
cd frontend
npm install
npm run dev
```

启动后可访问：

- 前端页面：`http://localhost:5173`

说明：

- `frontend/vite.config.js` 已将 `/api` 代理到 `http://localhost:8080`

### 方式二：Docker Compose

#### 1. 准备 `.env`

先将 `.env.example` 复制为 `.env`，再填写真实值。

至少建议补齐：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
POSTGRES_USER=sgp_user
POSTGRES_PASSWORD=sgp_password_changeme
POSTGRES_DB=education_db
```

#### 2. 启动服务

```bash
docker compose up --build -d
```

默认访问地址：

- 平台首页：`http://localhost`

说明：

- 前端容器映射宿主机 `80` 端口
- Nginx 会把 `/api/` 请求转发到后端容器
- 当前 `docker-compose.yml` 没有把后端 `8080` 直接映射到宿主机；如果需要直接访问 `/docs`，更适合使用本地开发方式

## 后端接口

当前已实现并实际可用的核心接口主要集中在 `exam-info` 模块：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/exam-info/page` | 分页获取资讯，支持筛选 |
| `GET` | `/api/exam-info/schools` | 获取学校列表 |
| `GET` | `/api/exam-info/hot-schools` | 获取热门学校 |
| `POST` | `/api/exam-info/trigger-crawl` | 手动触发抓取 |
| `POST` | `/api/exam-info/batch-import` | 批量导入资讯 |

分页接口常用参数：

- `page`
- `size`
- `keyword`
- `category`
- `region`
- `school`
- `schoolLevel`

示例：

```text
GET /api/exam-info/page?page=0&size=20&keyword=合肥
```

## 抓取与同步

### 定时抓取

后端启动后会注册定时任务：

- 每天 `02:00` 自动执行一次抓取

### 手动触发抓取

PowerShell：

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/exam-info/trigger-crawl" -Method Post
```

curl：

```bash
curl -X POST http://localhost:8080/api/exam-info/trigger-crawl
```

### 同步本地数据到远程后端

可使用：

`python_backend/scripts/sync_exam_info_to_remote.py`

示例：

```bash
cd python_backend
python scripts/sync_exam_info_to_remote.py \
  --api-url https://your-domain/api/exam-info/batch-import
```

## 开发说明

- 前端页面主要位于 `frontend/src/pages`
- 班型详情数据位于 `frontend/src/data/classTypeDetails`
- 资讯缓存逻辑位于 `frontend/src/utils/examInfoCache.js`
- 抓取逻辑位于 `crawler/`，由 `python_backend/main.py` 调用

## 相关文档

- [STARTUP.md](./STARTUP.md)：启动补充说明
- [DEPLOY_ALIYUN.md](./DEPLOY_ALIYUN.md)：阿里云 / CentOS / Podman 部署说明

补充说明：

- `ENVIRONMENT.md` 中仍保留早期架构说明，不建议作为当前主参考文档

## 许可证

MIT License
