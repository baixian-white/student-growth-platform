package com.education.repository;

import com.education.entity.ExamInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    List<ExamInfo> findBySchool(String school);

    // ── 多条件筛选（不分页，兼容旧接口） ─────────────────────────────
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

    // ── 多条件筛选（分页版） ──────────────────────────────────────────
    @Query(value = "SELECT e FROM ExamInfo e WHERE " +
           "(:category IS NULL OR :category = '全部' OR e.category = :category) AND " +
           "(:region IS NULL OR :region = '全部' OR e.region = :region) AND " +
           "(:schoolLevel IS NULL OR :schoolLevel = '全部' OR e.schoolLevel = :schoolLevel) AND " +
           "(:school IS NULL OR :school = '' OR e.school = :school) AND " +
           "(:keyword IS NULL OR e.title LIKE %:keyword% OR e.summary LIKE %:keyword%) " +
           "ORDER BY e.date DESC",
           countQuery = "SELECT COUNT(e) FROM ExamInfo e WHERE " +
           "(:category IS NULL OR :category = '全部' OR e.category = :category) AND " +
           "(:region IS NULL OR :region = '全部' OR e.region = :region) AND " +
           "(:schoolLevel IS NULL OR :schoolLevel = '全部' OR e.schoolLevel = :schoolLevel) AND " +
           "(:school IS NULL OR :school = '' OR e.school = :school) AND " +
           "(:keyword IS NULL OR e.title LIKE %:keyword% OR e.summary LIKE %:keyword%)")
    Page<ExamInfo> findWithFiltersPaged(
        @Param("category") String category,
        @Param("region") String region,
        @Param("schoolLevel") String schoolLevel,
        @Param("school") String school,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    // ── 统计查询 ─────────────────────────────────────────────────────
    @Query("SELECT e.category, COUNT(e) FROM ExamInfo e GROUP BY e.category")
    List<Object[]> countByCategory();

    @Query("SELECT e.region, COUNT(e) FROM ExamInfo e GROUP BY e.region")
    List<Object[]> countByRegion();

    @Query("SELECT COUNT(e) FROM ExamInfo e")
    long countAll();

    // ── 学校列表（distinct，过滤空值） ───────────────────────────────
    @Query("SELECT DISTINCT e.school FROM ExamInfo e WHERE e.school IS NOT NULL AND e.school <> '' ORDER BY e.school")
    List<String> findDistinctSchools();

    // ── 学校条数统计（取前 N 名） ────────────────────────────────────
    @Query("SELECT e.school, COUNT(e) FROM ExamInfo e WHERE e.school IS NOT NULL AND e.school <> '' " +
           "GROUP BY e.school ORDER BY COUNT(e) DESC")
    List<Object[]> countBySchool();
}
