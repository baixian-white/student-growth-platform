package com.education.service;

import com.education.entity.TeamMember;
import com.education.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamMemberService {
    
    private final TeamMemberRepository teamMemberRepository;
    
    public List<TeamMember> getAllTeamMembers() {
        return teamMemberRepository.findAll();
    }
    
    public Optional<TeamMember> getTeamMemberById(Long id) {
        return teamMemberRepository.findById(id);
    }
}
