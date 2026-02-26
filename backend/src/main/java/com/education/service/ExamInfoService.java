package com.education.service;

import com.education.entity.ExamInfo;
import com.education.repository.ExamInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExamInfoService {
    
    private final ExamInfoRepository examInfoRepository;
    
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

    public List<ExamInfo> searchWithFilters(String category, String region, String keyword) {
        return examInfoRepository.findWithFilters(
            (category == null || category.isEmpty()) ? null : category,
            (region == null || region.isEmpty()) ? null : region,
            (keyword == null || keyword.isEmpty()) ? null : keyword
        );
    }

    @Transactional
    public BatchImportResult batchImport(List<ExamInfo> items) {
        int imported = 0;
        int skipped = 0;
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

    public record BatchImportResult(int imported, int skipped, List<String> errors) {}
}
