package com.education.service;

import com.education.entity.ExamInfo;
import com.education.repository.ExamInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}
