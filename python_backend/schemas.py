from pydantic import BaseModel, ConfigDict
from typing import Optional

class ExamInfoBase(BaseModel):
    title: str
    category: Optional[str] = None
    date: Optional[str] = None
    source: Optional[str] = None
    summary: Optional[str] = None
    link: Optional[str] = None
    sourceUrl: Optional[str] = None
    region: Optional[str] = None
    importance: Optional[str] = None
    aiRecommended: Optional[bool] = False
    tags: Optional[str] = None
    school: Optional[str] = None
    schoolLevel: Optional[str] = None
    admissionYear: Optional[int] = None

class ExamInfoResponse(ExamInfoBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class PageResponse(BaseModel):
    content: list[ExamInfoResponse]
    totalElements: int
    totalPages: int
    size: int
    number: int
