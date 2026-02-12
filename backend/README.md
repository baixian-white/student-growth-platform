# 智慧教育平台后端系统

基于 Spring Boot 3.2.2 + Java 17 + PostgreSQL 的教育平台后端 API

## 技术栈

- **Java**: 17
- **框架**: Spring Boot 3.2.2
- **数据库**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **构建工具**: Maven
- **API文档**: SpringDoc OpenAPI (Swagger)

## 项目结构

```
backend/
├── src/main/java/com/education/
│   ├── config/           # 配置类 (CORS等)
│   ├── controller/       # REST控制器
│   ├── service/          # 业务逻辑层
│   ├── repository/       # 数据访问层
│   ├── entity/           # JPA实体
│   └── EducationApplication.java
├── src/main/resources/
│   └── application.yml   # 配置文件
└── pom.xml
```

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.6+
- PostgreSQL 12+

### 2. 数据库配置

创建数据库:
```sql
CREATE DATABASE education_db;
```

修改 `src/main/resources/application.yml` 中的数据库配置:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/education_db
    username: your_username
    password: your_password
```

### 3. 运行项目

```bash
# 进入项目目录
cd backend

# 使用 Maven 运行
mvn spring-boot:run
```

服务将在 `http://localhost:8080` 启动

### 4. API 文档

启动后访问 Swagger UI:
```
http://localhost:8080/api/swagger-ui.html
```

## API 端点

### 学生管理
- `GET /api/students` - 获取所有学生
- `GET /api/students/{id}` - 获取学生详情
- `GET /api/students/{id}/scores` - 获取学生成绩
- `POST /api/students` - 创建学生
- `PUT /api/students/{id}` - 更新学生
- `DELETE /api/students/{id}` - 删除学生
- `GET /api/students/search?keyword=xxx` - 搜索学生

### 考试信息
- `GET /api/exam-info` - 获取所有考试信息
- `GET /api/exam-info/{id}` - 获取详情
- `GET /api/exam-info/category/{category}` - 按分类查询
- `GET /api/exam-info/search?keyword=xxx` - 搜索
- `GET /api/exam-info/recommended` - 获取AI推荐

### 团队信息
- `GET /api/team` - 获取团队成员列表
- `GET /api/team/{id}` - 获取成员详情

## 数据库表结构

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

## 开发说明

### 添加新功能

1. 在 `entity` 包中创建实体类
2. 在 `repository` 包中创建 Repository 接口
3. 在 `service` 包中实现业务逻辑
4. 在 `controller` 包中创建 REST API

### CORS 配置

已配置允许前端访问,支持端口:
- http://localhost:5173
- http://localhost:5174
- http://localhost:5175

## 许可证

MIT License
