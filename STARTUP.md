# 学生成长平台 — Python 后端启动指南

## 架构升级说明
后端已根据你的实际环境，从繁琐的 Java (Spring Boot) + PostgreSQL **完全重写为极简的 Python (FastAPI) + SQLite**。

**它的优势在于：**
1. **零配置开箱即用**：自带 SQLite 文件数据库（`education.db`），你不需要在电脑上安装任何数据库软件。
2. **爬虫内核一体化**：原本独立的智能体爬虫（`crawl_agent.py`），现在已经被整合成了 FastAPI 后端内部的一个**后台驻留任务**。只要后端跑着，爬虫就在待命！

---

## 启动指南

### 第一步：进入后端并安装依赖（仅首次需要）
打开终端（终端需在能调用 python 的环境中）：
```powershell
cd e:\CODE\student-growth-platform\python_backend
pip install -r requirements.txt
```

### 第二步：启动后端
```powershell
cd e:\CODE\student-growth-platform\python_backend
python -m uvicorn main:app --host 0.0.0.0 --port 8080
```
> 启动后，你看到 `Uvicorn running on http://0.0.0.0:8080` 即代表成功。数据库文件会自动创建，且后台的每天凌晨两点定时调度也会一并启动。

### 第三步：启动前端
打开一个新的终端运行前端：
```powershell
cd e:\CODE\student-growth-platform\frontend
npm run dev
```

打开 `http://localhost:5173` 即可。

---

## 如何操作智能体爬虫？

在新的架构下，你不再需要去分别执行爬虫脚本了！

### 方式一：自动执行（适合线上挂机）
只要你的后端在运行，内部集成的 `APScheduler` 会在 **每天凌晨 02:00** 自动拉起 DeepSeek 智能体执行大范围检索与入库。

### 方式二：手动立即触发（适合本地测试）
如果你在测试时想让它**立刻执行一次全量爬取**，直接打开任意一个终端，向后端发一个触发指令即可：

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/exam-info/trigger-crawl" -Method Post
```
> 发送请求后，请返回**看后端的黑框控制台**。你会立刻看到智能体被唤醒，开始调用百度搜索、抓取页面、分析数据并自动入库的过程！
