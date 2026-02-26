package com.education.repository;

import com.education.entity.ExamInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamInfoRepository extends JpaRepository<ExamInfo, Long> {
    List<ExamInfo> findByCategory(String category);
    List<ExamInfo> findByTitleContaining(String keyword);
    List<ExamInfo> findByAiRecommended(Boolean aiRecommended);
    boolean existsBySourceUrl(String sourceUrl);
    List<ExamInfo> findByRegion(String region);
    List<ExamInfo> findTop20ByOrderByDateDesc();

    @Query("SELECT e FROM ExamInfo e WHERE " +
           "(:category IS NULL OR :category = '全部' OR e.category = :category) AND " +
           "(:region IS NULL OR :region = '全部' OR e.region = :region) AND " +
           "(:keyword IS NULL OR e.title LIKE %:keyword% OR e.summary LIKE %:keyword%) " +
           "ORDER BY e.date DESC")
    List<ExamInfo> findWithFilters(String category, String region, String keyword);
}
