package com.education.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "team_members")
@Data
public class TeamMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String role;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String tags;
}
