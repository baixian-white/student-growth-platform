package com.education.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "scores")
@Data
public class Score {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false)
    private Double score;
    
    @Column(name = "exam_date")
    private LocalDate examDate;
    
    @Column(name = "rank")
    private Integer rank;
    
    @Column(name = "percentile")
    private Double percentile;
    
    @Column(name = "created_at")
    private LocalDate createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}
