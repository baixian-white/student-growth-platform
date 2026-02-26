package com.education.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "exam_info")
@Data
public class ExamInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String category;
    
    @Column(name = "exam_date")
    private LocalDate date;
    
    @Column(name = "deadline")
    private LocalDate deadline;
    
    @Column(name = "source")
    private String source;
    
    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "content_summary", columnDefinition = "TEXT")
    private String contentSummary;
    
    @Column(name = "importance")
    private String importance;
    
    @Column(columnDefinition = "TEXT")
    private String tags;
    
    @Column(name = "ai_recommended")
    private Boolean aiRecommended = false;
    
    @Column(name = "link")
    private String link;

    @Column(name = "source_url", unique = true, length = 1024)
    private String sourceUrl;

    @Column(name = "region")
    private String region;
    
    @Column(name = "created_at")
    private LocalDate createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}
