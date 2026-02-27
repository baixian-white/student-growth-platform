import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# 获取数据库 URL，优先从环境变量读取，否则使用 SQLite 本地数据库
DB_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite+aiosqlite:///./education.db"
)

# 创建异步引擎
engine = create_async_engine(DB_URL, echo=False)

# 创建异步 Session 工厂
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

# 依赖注入，用于 FastAPI 获取数据库 session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
