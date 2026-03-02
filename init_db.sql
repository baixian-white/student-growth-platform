-- PostgreSQL 初始化脚本
-- 执行方式（任选其一）：
--   psql -U postgres -f init_db.sql
--   或在 pgAdmin 中执行以下 SQL

-- 创建用户（若已存在则跳过）
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'education_user') THEN
        CREATE USER education_user WITH PASSWORD 'education_pass';
    END IF;
END $$;

-- 创建数据库（若已存在则跳过）
SELECT 'CREATE DATABASE education_db OWNER education_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'education_db')\gexec

-- 授权
GRANT ALL PRIVILEGES ON DATABASE education_db TO education_user;
