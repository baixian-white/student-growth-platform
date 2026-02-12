package com.education.controller;

import com.education.entity.ExamInfo;
import com.education.service.ExamInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam-info")
@RequiredArgsConstructor
public class ExamInfoController {
    
    private final ExamInfoService examInfoService;
    
    @GetMapping
    public ResponseEntity<List<ExamInfo>> getAllExamInfo() {
        return ResponseEntity.ok(examInfoService.getAllExamInfo());
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
}
