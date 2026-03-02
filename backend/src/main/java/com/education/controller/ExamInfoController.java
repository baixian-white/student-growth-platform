package com.education.controller;

import com.education.entity.ExamInfo;
import com.education.service.ExamInfoService;
import com.education.service.CrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/exam-info")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExamInfoController {

    private final ExamInfoService examInfoService;
    private final CrawlerService crawlerService;

    // ── 旧接口（兼容保留） ────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<ExamInfo>> getAllExamInfo(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String schoolLevel,
            @RequestParam(required = false) String keyword) {
        if (category != null || region != null || schoolLevel != null || keyword != null) {
            return ResponseEntity.ok(examInfoService.searchWithFilters(category, region, schoolLevel, keyword));
        }
        return ResponseEntity.ok(examInfoService.getLatest20());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamInfo> getExamInfoById(@PathVariable Long id) {
        return examInfoService.getExamInfoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExamInfo>> getExamInfoByCategory(@PathVariable String category) {
        return ResponseEntity.ok(examInfoService.getExamInfoByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ExamInfo>> searchExamInfo(@RequestParam String keyword) {
        return ResponseEntity.ok(examInfoService.searchExamInfo(keyword));
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<ExamInfo>> getAiRecommended() {
        return ResponseEntity.ok(examInfoService.getAiRecommended());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(examInfoService.getStats());
    }

    // ── 新接口：分页查询 ──────────────────────────────────────────────

    /**
     * GET /api/exam-info/page
     * 参数：category, region, schoolLevel, school, keyword, page(0起), size(默认20)
     * 返回：{ content, totalElements, totalPages, number, size }
     */
    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getPagedExamInfo(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String schoolLevel,
            @RequestParam(required = false) String school,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<ExamInfo> result = examInfoService.getPagedResults(
            category, region, schoolLevel, school, keyword, page, size);

        return ResponseEntity.ok(Map.of(
            "content",       result.getContent(),
            "totalElements", result.getTotalElements(),
            "totalPages",    result.getTotalPages(),
            "number",        result.getNumber(),
            "size",          result.getSize()
        ));
    }

    // ── 新接口：学校列表 ──────────────────────────────────────────────

    /** GET /api/exam-info/schools → ["合肥一中", "合肥一六八", ...] */
    @GetMapping("/schools")
    public ResponseEntity<List<String>> getSchools() {
        return ResponseEntity.ok(examInfoService.getSchoolList());
    }

    /** GET /api/exam-info/hot-schools?top=8 → [{school, count}, ...] */
    @GetMapping("/hot-schools")
    public ResponseEntity<List<Map<String, Object>>> getHotSchools(
            @RequestParam(defaultValue = "8") int top) {
        return ResponseEntity.ok(examInfoService.getHotSchools(top));
    }

    // ── 批量导入（供爬虫调用） ────────────────────────────────────────

    @PostMapping("/batch-import")
    public ResponseEntity<Map<String, Object>> batchImport(
            @RequestBody List<ExamInfo> items,
            @RequestHeader(value = "X-Crawler-Key", required = false) String apiKey) {
        if (!"crawler-secret-2025".equals(apiKey)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        ExamInfoService.BatchImportResult result = examInfoService.batchImport(items);
        return ResponseEntity.ok(Map.of(
            "imported", result.imported(),
            "skipped",  result.skipped(),
            "errors",   result.errors()
        ));
    }

    // ── 手动触发爬虫 ──────────────────────────────────────────────────

    /**
     * POST /api/exam-info/trigger-crawl
     * Header: X-Crawler-Key: crawler-secret-2025
     * 异步触发 Python 爬虫，立即返回 202 Accepted
     */
    @PostMapping("/trigger-crawl")
    public ResponseEntity<Map<String, Object>> triggerCrawl(
            @RequestHeader(value = "X-Crawler-Key", required = false) String apiKey) {
        if (!"crawler-secret-2025".equals(apiKey)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        crawlerService.runCrawlerAsync();
        return ResponseEntity.accepted().body(Map.of(
            "status",  "triggered",
            "message", "爬虫已在后台启动，请稍后刷新数据"
        ));
    }
}
