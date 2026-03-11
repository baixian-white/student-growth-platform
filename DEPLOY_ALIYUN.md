# 阿里云 CentOS 部署指南

> 本文档基于实际部署过程沉淀。技术栈：Python FastAPI + React + PostgreSQL，容器化方案：Podman + podman-compose。

---

## 一、服务器环境准备

### 1.1 基本工具安装

```bash
# 更新系统包
sudo yum update -y

# 安装 git 和 epel 源
sudo yum install -y git epel-release

# 安装 podman 和 podman-compose
sudo yum install -y podman
sudo pip3 install podman-compose

# 验证安装版本
podman --version
podman-compose --version
```

### 1.2 配置 Podman 国内镜像加速（关键步骤）

> ⚠️ **强烈建议**：国内服务器直连 docker.io 极易超时，务必配置镜像加速器。

```bash
sudo vi /etc/containers/registries.conf
```

在文件末尾追加以下内容：

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

保存后无需重启，Podman 立即生效。

---

## 二、拉取项目代码

```bash
# 进入部署目录
cd /opt

# 克隆仓库（若 github.com 超时，先用代理或手动上传 zip）
git clone https://github.com/baixian-white/student-growth-platform.git

cd student-growth-platform
```

> ⚠️ **注意**：若 `git clone` 一直显示 `Connection timed out`，是因为国内服务器无法直连 GitHub。可以选择：
> - 在本地打包 `git archive --format=zip HEAD > deploy.zip`，再通过 `scp` 上传到服务器解压
> - 或者在服务器上配置 HTTP 代理

---

## 三、配置环境变量

```bash
# 复制样例配置文件
cp .env.example .env

# 编辑配置
nano .env
```

`.env` 文件内容参考：

```dotenv
# 数据库配置
POSTGRES_USER=sgp_user
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=sgp_db

# DeepSeek API Key（爬虫必须）
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx

# 后端地址（前端 build 时用）
VITE_API_BASE_URL=/api
```

> 💡 **注意**：`DEEPSEEK_API_KEY` 是智能体爬虫的核心，必须填写有效 KEY。建议前往 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册获取。

---

## 四、关键配置文件说明

### 4.1 docker-compose.yml（重要修改）

`podman-compose` 存在一个已知 Bug：无法识别本地构建的镜像，会错误地尝试从远程拉取。  
项目已在 `docker-compose.yml` 中显式添加 `image: localhost/...` 标签来规避此问题：

```yaml
services:
  backend:
    build: ./python_backend
    image: localhost/sgp_backend:latest   # ← 这行是关键，不能删
    container_name: sgp_backend
    ...

  frontend:
    build: ./frontend
    image: localhost/sgp_frontend:latest  # ← 同上
    container_name: sgp_frontend
    ...
```

### 4.2 frontend/nginx.conf（Podman DNS 兼容修复）

Nginx 反向代理必须使用 **容器名**（`sgp_backend`）而不是 service 名（`backend`），否则 Podman 内部 DNS 无法解析：

```nginx
location /api/ {
    # 使用 container_name，兼容 Podman 内部 DNS
    proxy_pass http://sgp_backend:8080;
    proxy_read_timeout 300s;
}
```

### 4.3 python_backend/Dockerfile（Alpine 替换 Slim）

国内服务器上 Debian 的 `apt` 镜像源经常不稳定，项目已将后端基础镜像从 `python:3.10-slim` 改为 `python:3.10-alpine`，使用 `apk` 安装系统依赖：

```dockerfile
FROM python:3.10-alpine
RUN apk add --no-cache gcc musl-dev postgresql-dev tzdata
```

---

## 五、构建并启动服务

### 5.1 首次部署（全量构建）

```bash
# 构建所有容器并后台启动
sudo podman-compose up -d --build
```

构建完成后会启动三个容器：
| 容器名 | 说明 |
|---|---|
| `sgp_postgres` | PostgreSQL 15 数据库 |
| `sgp_backend` | Python FastAPI 后端 (端口 8080) |
| `sgp_frontend` | React + Nginx 前端 (端口 80) |

### 5.2 查看容器状态

```bash
sudo podman ps -a
```

所有容器的 STATUS 应该显示 `Up X minutes`，若有 `Exited`，用以下命令查日志排查：

```bash
sudo podman logs sgp_backend  # 查看后端日志
sudo podman logs sgp_frontend # 查看前端日志
```

### 5.3 重启单个服务（代码更新后）

```bash
# 仅重新构建并重启后端（推荐用于更新后端代码）
sudo podman-compose up -d --force-recreate --build backend

# 仅重启前端
sudo podman-compose up -d --force-recreate --build frontend
```

> ⚠️ **注意**：使用 `--force-recreate` 会先停止依赖容器（包括 postgres），若数据库也在 compose 管理之内，请确认数据已持久化到 volume。

---

## 六、手动运行爬虫（初始化数据）

首次部署时数据库为空，需手动运行智能体爬虫采集数据：

```bash
# 直接运行，从 .env 读取 API Key
sudo podman exec -it sgp_backend python /app/crawler/crawl_agent.py

# 若 .env 的 API Key 未被容器识别，可直接通过命令行传入
sudo podman exec -it sgp_backend python /app/crawler/crawl_agent.py --llm-key "sk-你的密钥"
```

爬虫运行结束后，终端会输出：
```
✅ 所有主题采集完成，本次全量任务共新增入库 XX 条。
```

此后，每天凌晨 **02:00** 系统会自动触发爬虫更新。

---

## 七、阿里云安全组配置

在阿里云控制台 → 实例 → 安全组 → 入方向规则中，开放以下端口：

| 端口 | 协议 | 用途 |
|---|---|---|
| 80 | TCP | 前端 HTTP 访问（必须） |
| 443 | TCP | HTTPS（若配置 SSL） |
| 22 | TCP | SSH 远程登录 |

---

## 八、常见问题排查

### Q1：构建时 `pip install` 卡死、超时

**原因**：PyPI 官方源国内访问慢。

**解决**：在 `Dockerfile` 的 `pip install` 命令加上清华镜像参数：
```dockerfile
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --no-cache-dir
```

---

### Q2：前端显示"后端离线，显示本地缓存数据"

**原因**：前端无法请求到 `/api/exam-info/page` 接口。

**排查步骤**：

1. 确认后端容器正在运行：  
   `sudo podman ps | grep sgp_backend`

2. 在 Nginx 容器内部测试连通性：  
   `sudo podman exec -it sgp_frontend sh -c "wget -qO- http://sgp_backend:8080/docs"`  
   若有 HTML 输出，说明内网 DNS 正常。

3. 若无输出，确认 `nginx.conf` 配置是否使用了 `container_name`（即 `sgp_backend`）而非 service 名（`backend`）。

4. 修改配置后重新创建前端容器：  
   `sudo podman-compose up -d --force-recreate --build frontend`

---

### Q3：后端报错 `ModuleNotFoundError: No module named 'requests'`

**原因**：爬虫依赖没有在 `requirements.txt` 中声明，导致构建时未安装。

**解决**：确认 `python_backend/requirements.txt` 包含以下条目：
```
requests
beautifulsoup4
openai
```
然后重新构建并重启后端：
```bash
sudo podman-compose up -d --force-recreate --build backend
```

---

### Q4：API Key 更新后旧 Key 仍在生效（401 错误）

**原因**：`.env` 文件被修改后，旧容器内的环境变量不会自动刷新。

**解决**：必须用 `--force-recreate` 让容器从新的 `.env` 重新读取：
```bash
sudo podman-compose up -d --force-recreate backend
```

或者直接用命令行参数传入 Key：
```bash
sudo podman exec -it sgp_backend python /app/crawler/crawl_agent.py --llm-key "sk-新密钥"
```

---

### Q5：HTTPS 证书警告（InsecureRequestWarning）

爬虫在抓取部分政府/学校网站（如 `ahzsks.cn`）时会输出：
```
InsecureRequestWarning: Unverified HTTPS request...
```

**这是正常现象**，因为这类网站的 SSL 证书配置不规范，我们主动关闭了证书验证（`verify=False`）以确保能成功抓取数据。此警告不影响数据采集，不需要处理。

---

## 九、快速命令速查

```bash
# 查看所有容器状态
sudo podman ps -a

# 查看后端实时日志
sudo podman logs -f sgp_backend

# 重启所有服务
sudo podman-compose restart

# 停止所有服务
sudo podman-compose down

# 完全重建（通常在拉取新代码后使用）
sudo podman-compose up -d --build --force-recreate

# 手动触发一次爬虫
sudo podman exec -it sgp_backend python /app/crawler/crawl_agent.py --llm-key "sk-你的密钥"

# 进入后端容器的 shell 进行调试
sudo podman exec -it sgp_backend sh
```

---

## 10. Git 更新与推送规范（2026-03-11 实战补充）

目标：后续固定为“本地 push -> 服务器 pull -> 重启服务”，避免服务器本地脏改动导致拉取失败。

### 10.1 推荐标准流程

本地：

```bash
git add .
git commit -m "feat/fix/chore: ..."
git push origin main
```

服务器：

```bash
cd /opt/student-growth-platform
git pull --ff-only origin main
sudo podman-compose up -d --build
```

### 10.2 `git pull` 被本地改动拦截时

典型报错：

```text
error: Your local changes to the following files would be overwritten by merge
```

方式 A（临时保留服务器本地改动）：

```bash
git stash push -m "server-local-changes" docker-compose.yml python_backend/Dockerfile
git pull origin main
git stash pop
```

方式 B（不需要本地改动，直接对齐远端）：

```bash
git restore docker-compose.yml python_backend/Dockerfile
git pull --ff-only origin main
```

### 10.3 服务器本地文件忽略规则

这些文件只应留在服务器本地，不推送远端：

- `.env`
- `**/__pycache__/`
- `*.pyc`

建议 `.gitignore` 包含：

```gitignore
.env
**/__pycache__/
*.pyc
```

清理缓存：

```bash
rm -rf crawler/__pycache__
```

### 10.4 服务器首次提交前配置 Git 身份

出现 `Author identity unknown` 时执行：

```bash
git config --global user.name "your-github-name"
git config --global user.email "your-github-email"
```

### 10.5 服务器 `git push` 认证说明（GitHub）

GitHub 已不支持账号密码推送。

- `https` 方式：使用 PAT
- 推荐：SSH key

SSH 方式示例：

```bash
ssh-keygen -t ed25519 -C "server-deploy" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
# 把公钥加到 GitHub -> Settings -> SSH and GPG keys

git remote set-url origin git@github.com:baixian-white/student-growth-platform.git
ssh -T git@github.com
git push origin main
```

### 10.6 `podman-compose --force-recreate` 出现 `exit code: 125`

实战里可能出现依赖容器删除顺序问题，中途报 `125`，但最终容器仍可能成功启动。

因此要看最终状态：

```bash
sudo podman-compose ps
sudo podman-compose logs --tail=100 backend
```

如需干净重建：

```bash
sudo podman-compose down
sudo podman-compose up -d --build
```

### 10.7 部署后快速自检

```bash
cd /opt/student-growth-platform
git status -sb
sudo podman-compose ps
curl -I http://127.0.0.1
```

预期：

- `git status -sb` 无 `M/D/??`
- `sgp_postgres` 为 `healthy`
- `sgp_backend`、`sgp_frontend` 为 `Up`
