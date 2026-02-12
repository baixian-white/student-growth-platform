package com.education.service;

import com.education.entity.Student;
import com.education.entity.Score;
import com.education.repository.StudentRepository;
import com.education.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {
    
    private final StudentRepository studentRepository;
    private final ScoreRepository scoreRepository;
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    public List<Score> getStudentScores(Long studentId) {
        return scoreRepository.findByStudentId(studentId);
    }
    
    @Transactional
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }
    
    @Transactional
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        student.setName(studentDetails.getName());
        student.setGrade(studentDetails.getGrade());
        student.setClassName(studentDetails.getClassName());
        student.setTotalScore(studentDetails.getTotalScore());
        student.setAverageScore(studentDetails.getAverageScore());
        
        return studentRepository.save(student);
    }
    
    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    
    public List<Student> searchStudents(String keyword) {
        return studentRepository.findByNameContaining(keyword);
    }
}
