# 阿里云部署文档

适用场景：

- 阿里云 ECS
- CentOS / Alibaba Cloud Linux 一类的 `yum` 系系统
- 使用 `Podman + podman-compose` 部署当前仓库

本文按两种场景拆分：

1. 初始部署：服务器上第一次把项目跑起来
2. 代码更新后的部署：本地代码已经推到 Git，服务器只做拉取和发布

说明：

- 仓库里的编排文件是 `docker-compose.yml`
- 本文默认在服务器上用 `podman-compose` 读取它
- 如果你使用 Docker，也可以把文中的 `podman` / `podman-compose` 替换成 `docker` / `docker compose`

## 部署架构

当前服务由 3 个容器组成：

| 容器名 | 作用 |
| --- | --- |
| `sgp_postgres` | PostgreSQL 数据库 |
| `sgp_backend` | FastAPI 后端 |
| `sgp_frontend` | React 构建产物 + Nginx 反向代理 |

访问关系：

- 用户访问 `80` 端口进入前端
- Nginx 将 `/api/` 请求转发到 `sgp_backend:8080`
- 后端通过内网连接 PostgreSQL

当前关键配置：

- `docker-compose.yml`
- `frontend/nginx.conf`
- `python_backend/Dockerfile`

## 一、初始部署

### 1. 服务器准备

建议机器至少满足：

- 2 核 CPU
- 2 GB 内存
- 20 GB 可用磁盘

阿里云安全组至少放通：

| 端口 | 协议 | 说明 |
| --- | --- | --- |
| `22` | TCP | SSH 登录 |
| `80` | TCP | 站点访问 |
| `443` | TCP | 可选，后续接 HTTPS 用 |

### 2. 安装基础工具

```bash
sudo yum update -y
sudo yum install -y git podman python3-pip
sudo pip3 install podman-compose
```

校验安装结果：

```bash
podman --version
podman-compose --version
git --version
```

### 3. 配置镜像加速

如果服务器在国内，强烈建议给 Podman 配镜像加速，否则首次构建很容易卡在拉镜像阶段。

编辑：

```bash
sudo vi /etc/containers/registries.conf
```

可参考追加：

```ini
unqualified-search-registries = ["docker.io"]

[[registry]]
prefix = "docker.io"
location = "docker.m.daocloud.io"

[[registry.mirror]]
location = "registry.cn-hangzhou.aliyuncs.com"

[[registry.mirror]]
location = "dockerpull.com"
```

### 4. 拉取代码

建议统一放在 `/opt`：

```bash
cd /opt
git clone https://github.com/baixian-white/student-growth-platform.git
cd student-growth-platform
```

如果服务器无法直接访问 GitHub，可在本地打包后上传，再在服务器解压。

### 5. 配置环境变量

复制模板：

```bash
cp .env.example .env
```

编辑：

```bash
vi .env
```

最少需要配置：

```dotenv
POSTGRES_USER=sgp_user
POSTGRES_PASSWORD=请替换成强密码
POSTGRES_DB=education_db
DEEPSEEK_API_KEY=你的真实密钥
```

说明：

- `POSTGRES_*` 会被 `docker-compose.yml` 用来生成数据库连接
- `DEEPSEEK_API_KEY` 用于资讯抓取，不填也能启动页面，但抓取任务会失败
- 当前 Compose 会自动给后端注入 `DATABASE_URL`，不需要你手动再写一遍

### 6. 首次构建并启动

在项目根目录执行：

```bash
sudo podman-compose up -d --build
```

首次启动会完成：

- 拉取基础镜像
- 构建前端镜像
- 构建后端镜像
- 创建数据库卷
- 启动 3 个容器

### 7. 检查容器状态

```bash
sudo podman ps -a
```

正常情况下你应该看到：

- `sgp_postgres` 为 `Up` 或 `healthy`
- `sgp_backend` 为 `Up`
- `sgp_frontend` 为 `Up`

如果某个容器退出，先看日志：

```bash
sudo podman logs sgp_postgres
sudo podman logs sgp_backend
sudo podman logs sgp_frontend
```

### 8. 初始化数据

如果是空库，第一次建议手动触发一次抓取：

```bash
curl -X POST http://127.0.0.1/api/exam-info/trigger-crawl
```

然后观察后端日志：

```bash
sudo podman logs -f sgp_backend
```

补充说明：

- 后端本身也会注册定时任务，每天 `02:00` 自动抓取
- 因为后端没有直接映射宿主机端口，所以从服务器本机触发时走的是前端 Nginx 的 `/api/` 代理

### 9. 部署完成后的自检

建议至少检查这 4 项：

```bash
curl -I http://127.0.0.1
curl "http://127.0.0.1/api/exam-info/page?page=0&size=1"
sudo podman-compose ps
git status -sb
```

预期结果：

- 首页返回 `200`
- `exam-info/page` 能返回 JSON
- 3 个容器都在运行
- 工作区是干净的，没有额外改动

## 二、代码更新后的部署

这部分适用于：

- 你已经完成过一次初始部署
- 本地代码已经提交并推送到 GitHub
- 服务器只需要拉取新代码并重启对应服务

推荐固定流程：

1. 本地提交并推送
2. 服务器 `git pull --ff-only`
3. 按变更类型重启对应容器
4. 做发布后自检

### 1. 本地先推送代码

在你的开发机上：

```bash
git add .
git commit -m "你的提交说明"
git push origin main
```

### 2. 服务器拉取最新代码

登录服务器后执行：

```bash
cd /opt/student-growth-platform
git pull --ff-only origin main
```

如果这里失败，优先检查是否有服务器本地脏改动：

```bash
git status -sb
```

如果服务器上不应该保留本地修改，先恢复再拉取：

```bash
git restore .
git pull --ff-only origin main
```

如果服务器上确实保留了临时改动，先暂存：

```bash
git stash push -m "server-local-changes"
git pull --ff-only origin main
git stash pop
```

### 3. 按变更类型执行更新

#### 3.1 只改了前端页面或样式

例如改动了：

- `frontend/src/**`
- `frontend/nginx.conf`

执行：

```bash
cd /opt/student-growth-platform
sudo podman-compose up -d --build frontend
```

#### 3.2 改了后端代码或抓取逻辑

例如改动了：

- `python_backend/**`
- `crawler/**`

执行：

```bash
cd /opt/student-growth-platform
sudo podman-compose up -d --build backend
```

#### 3.3 改了依赖、镜像、环境变量或编排文件

例如改动了：

- `.env`
- `docker-compose.yml`
- `python_backend/Dockerfile`
- `frontend/Dockerfile`
- `package.json`
- `requirements.txt`

执行完整重建：

```bash
cd /opt/student-growth-platform
sudo podman-compose up -d --build --force-recreate
```

说明：

- `.env` 改了以后，旧容器不会自动读取新值
- `--force-recreate` 可以确保容器重新创建并加载新的环境变量

### 4. 发布后检查

每次更新完成后建议执行：

```bash
cd /opt/student-growth-platform
sudo podman-compose ps
curl -I http://127.0.0.1
curl "http://127.0.0.1/api/exam-info/page?page=0&size=1"
sudo podman logs --tail=100 sgp_backend
```

如果改的是前端页面，也建议实际浏览器访问一遍首页和目标页面。

### 5. 数据库结构变更的特别说明

当前后端没有接入 Alembic 一类的迁移工具。

这意味着：

- 新增表：通常可以随着后端启动自动创建
- 修改已有字段、字段类型、约束：不要假设重启就能自动迁移

如果你修改了 `python_backend/models.py` 里的已存在表结构，发布前请先准备手工 SQL 或迁移脚本，再执行服务更新。

### 6. 回滚建议

如果更新后服务异常，优先回滚到上一个稳定提交：

```bash
cd /opt/student-growth-platform
git log --oneline -n 5
git checkout <稳定提交号>
sudo podman-compose up -d --build --force-recreate
```

确认稳定后，再决定是否切回 `main`。

如果你不希望进入 detached HEAD，也可以单独创建回滚分支。

## 常用命令速查

```bash
# 查看容器状态
sudo podman ps -a

# 查看 compose 状态
sudo podman-compose ps

# 查看后端日志
sudo podman logs -f sgp_backend

# 查看前端日志
sudo podman logs -f sgp_frontend

# 查看数据库日志
sudo podman logs -f sgp_postgres

# 重启全部服务
sudo podman-compose restart

# 停止全部服务
sudo podman-compose down

# 全量重建
sudo podman-compose up -d --build --force-recreate

# 进入后端容器
sudo podman exec -it sgp_backend sh
```

## 常见问题

### 1. 前端页面能打开，但接口一直报“后端离线”

先检查：

```bash
sudo podman-compose ps
sudo podman logs --tail=100 sgp_backend
sudo podman logs --tail=100 sgp_frontend
```

然后在前端容器里验证 Nginx 到后端的连通性：

```bash
sudo podman exec -it sgp_frontend sh -c "wget -qO- http://sgp_backend:8080/docs"
```

如果这里不通，优先检查 `frontend/nginx.conf` 中的 `proxy_pass` 是否仍然是：

```nginx
proxy_pass http://sgp_backend:8080;
```

### 2. 改了 `.env`，但服务还是用旧配置

这是因为容器不会自动重读环境变量。

请使用：

```bash
sudo podman-compose up -d --build --force-recreate
```

### 3. `git pull` 提示会覆盖本地修改

先看服务器上到底改了什么：

```bash
git status -sb
```

如果本地改动不需要保留：

```bash
git restore .
git pull --ff-only origin main
```

如果需要暂存：

```bash
git stash push -m "server-local-changes"
git pull --ff-only origin main
git stash pop
```

### 4. 更新后数据库没按预期变化

请先确认这是不是“已有表结构修改”。

当前项目没有自动迁移能力，字段变更需要你手动做数据库迁移，不能只靠重启服务。

### 5. 完全重建后数据库数据是否会丢

正常不会。

因为数据库使用了 compose volume：

```yaml
volumes:
  pgdata:
```

只要你没有主动删除 volume，重建容器不会清空数据库。
