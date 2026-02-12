package com.education.repository;

import com.education.entity.ExamInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamInfoRepository extends JpaRepository<ExamInfo, Long> {
    List<ExamInfo> findByCategory(String category);
    List<ExamInfo> findByTitleContaining(String keyword);
    List<ExamInfo> findByAiRecommended(Boolean aiRecommended);
}
