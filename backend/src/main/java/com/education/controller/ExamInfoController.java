package com.education.controller;

import com.education.entity.ExamInfo;
import com.education.service.ExamInfoService;
import lombok.RequiredArgsConstructor;
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
    
    @GetMapping
    public ResponseEntity<List<ExamInfo>> getAllExamInfo(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String keyword) {
        if (category != null || region != null || keyword != null) {
            return ResponseEntity.ok(examInfoService.searchWithFilters(category, region, keyword));
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

    @PostMapping("/batch-import")
    public ResponseEntity<Map<String, Object>> batchImport(
            @RequestBody List<ExamInfo> items,
            @RequestHeader(value = "X-Crawler-Key", required = false) String apiKey) {
        // Simple API key validation
        if (!"crawler-secret-2025".equals(apiKey)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        ExamInfoService.BatchImportResult result = examInfoService.batchImport(items);
        return ResponseEntity.ok(Map.of(
            "imported", result.imported(),
            "skipped", result.skipped(),
            "errors", result.errors()
        ));
    }
}
