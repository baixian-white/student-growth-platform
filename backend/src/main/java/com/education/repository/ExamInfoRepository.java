package com.education.repository;

import com.education.entity.ExamInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
           "(:schoolLevel IS NULL OR :schoolLevel = '全部' OR e.schoolLevel = :schoolLevel) AND " +
           "(:keyword IS NULL OR e.title LIKE %:keyword% OR e.summary LIKE %:keyword%) " +
           "ORDER BY e.date DESC")
    List<ExamInfo> findWithFilters(
        @Param("category") String category,
        @Param("region") String region,
        @Param("schoolLevel") String schoolLevel,
        @Param("keyword") String keyword
    );

    @Query("SELECT e.category, COUNT(e) FROM ExamInfo e GROUP BY e.category")
    List<Object[]> countByCategory();

    @Query("SELECT e.region, COUNT(e) FROM ExamInfo e GROUP BY e.region")
    List<Object[]> countByRegion();

    @Query("SELECT COUNT(e) FROM ExamInfo e")
    long countAll();
}
