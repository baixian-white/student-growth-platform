package com.education.service;

import com.education.entity.ExamInfo;
import com.education.repository.ExamInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamInfoService {

    private final ExamInfoRepository examInfoRepository;

    // ── 基础查询 ──────────────────────────────────────────────────────

    public List<ExamInfo> getAllExamInfo() {
        return examInfoRepository.findAll();
    }

    public Optional<ExamInfo> getExamInfoById(Long id) {
        return examInfoRepository.findById(id);
    }

    public List<ExamInfo> getExamInfoByCategory(String category) {
        if ("全部".equals(category)) {
            return examInfoRepository.findAll();
        }
        return examInfoRepository.findByCategory(category);
    }

    public List<ExamInfo> searchExamInfo(String keyword) {
        return examInfoRepository.findByTitleContaining(keyword);
    }

    public List<ExamInfo> getAiRecommended() {
        return examInfoRepository.findByAiRecommended(true);
    }

    public List<ExamInfo> getLatest20() {
        return examInfoRepository.findTop20ByOrderByDateDesc();
    }

    // ── 多条件筛选（不分页，兼容旧接口） ─────────────────────────────

    public List<ExamInfo> searchWithFilters(String category, String region,
                                             String schoolLevel, String keyword) {
        return examInfoRepository.findWithFilters(
            nullIfEmpty(category),
            nullIfEmpty(region),
            nullIfEmpty(schoolLevel),
            nullIfEmpty(keyword)
        );
    }

    // ── 分页 + 多条件筛选 ─────────────────────────────────────────────

    public Page<ExamInfo> getPagedResults(String category, String region,
                                          String schoolLevel, String school,
                                          String keyword, int page, int size) {
        PageRequest pageRequest = PageRequest.of(
            Math.max(0, page),
            Math.min(50, Math.max(1, size)),
            Sort.by(Sort.Direction.DESC, "date")
        );
        return examInfoRepository.findWithFiltersPaged(
            nullIfEmpty(category),
            nullIfEmpty(region),
            nullIfEmpty(schoolLevel),
            nullIfEmpty(school),
            nullIfEmpty(keyword),
            pageRequest
        );
    }

    // ── 学校相关 ──────────────────────────────────────────────────────

    /** 返回数据库中所有出现过的学校名（去重，字母序） */
    public List<String> getSchoolList() {
        return examInfoRepository.findDistinctSchools();
    }

    /** 返回热门学校（按数据量降序，最多 topN 所） */
    public List<Map<String, Object>> getHotSchools(int topN) {
        List<Map<String, Object>> result = new ArrayList<>();
        examInfoRepository.countBySchool().stream()
            .limit(topN)
            .forEach(row -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("school", row[0]);
                m.put("count", row[1]);
                result.add(m);
            });
        return result;
    }

    // ── 统计 ─────────────────────────────────────────────────────────

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        Map<String, Long> categoryCount = new LinkedHashMap<>();
        examInfoRepository.countByCategory()
            .forEach(row -> categoryCount.put((String) row[0], (Long) row[1]));
        stats.put("byCategory", categoryCount);

        Map<String, Long> regionCount = new LinkedHashMap<>();
        examInfoRepository.countByRegion()
            .forEach(row -> regionCount.put((String) row[0], (Long) row[1]));
        stats.put("byRegion", regionCount);

        stats.put("total", examInfoRepository.countAll());
        stats.put("hotSchools", getHotSchools(10));
        return stats;
    }

    // ── 批量导入（供爬虫调用） ────────────────────────────────────────

    @Transactional
    public BatchImportResult batchImport(List<ExamInfo> items) {
        int imported = 0;
        int skipped  = 0;
        List<String> errors = new ArrayList<>();

        for (ExamInfo item : items) {
            try {
                if (item.getSourceUrl() != null && !item.getSourceUrl().isBlank()) {
                    if (examInfoRepository.existsBySourceUrl(item.getSourceUrl())) {
                        skipped++;
                        continue;
                    }
                }
                examInfoRepository.save(item);
                imported++;
            } catch (Exception e) {
                log.error("Failed to import item: {}", item.getTitle(), e);
                errors.add(item.getTitle() + ": " + e.getMessage());
            }
        }

        return new BatchImportResult(imported, skipped, errors);
    }

    // ── 工具 ─────────────────────────────────────────────────────────

    private static String nullIfEmpty(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }

    public record BatchImportResult(int imported, int skipped, List<String> errors) {}
}
