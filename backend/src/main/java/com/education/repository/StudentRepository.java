package com.education.repository;

import com.education.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByGrade(String grade);
    List<Student> findByClassName(String className);
    List<Student> findByNameContaining(String name);
}
