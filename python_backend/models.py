from sqlalchemy import Column, Integer, String, Text, Boolean, BigInteger
from database import Base

class ExamInfo(Base):
    __tablename__ = "exam_info"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50))
    date = Column(String(50))
    source = Column(String(100))
    summary = Column(Text)
    link = Column(String(500))
    source_url = Column(String(500), unique=True, index=True)
    region = Column(String(50))
    importance = Column(String(50))
    ai_recommended = Column(Boolean, default=False)
    tags = Column(String(500))
    school = Column(String(100), index=True)
    school_level = Column(String(50))
    admission_year = Column(Integer)
