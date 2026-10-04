package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.Result;
import com.jangombe.jangombe_backend.repository.ResultRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ResultService {

    private final ResultRepository resultRepository;

    public ResultService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    public Result createResult(Result result) {

        if (result.getCreatedAt() == null) {
            result.setCreatedAt(LocalDateTime.now());
        }

        result.setUpdatedAt(LocalDateTime.now());

        return resultRepository.save(result);
    }

    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    public Optional<Result> getResultById(Long id) {
        return resultRepository.findById(id);
    }

    public List<Result> getResultsByClass(Long classId) {
        return resultRepository.findByClassEntityId(classId);
    }

    public Optional<Result> getStudentResult(
            Long studentId,
            String academicYear,
            String term) {

        return resultRepository.findByStudentIdAndAcademicYearAndTerm(
                studentId,
                academicYear,
                term
        );
    }

    public Result updateResult(Long id, Result updatedResult) {

        Result existingResult = resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        existingResult.setStudent(updatedResult.getStudent());
        existingResult.setClassEntity(updatedResult.getClassEntity());
        existingResult.setAcademicYear(updatedResult.getAcademicYear());
        existingResult.setTerm(updatedResult.getTerm());
        existingResult.setTotalMarks(updatedResult.getTotalMarks());
        existingResult.setAverage(updatedResult.getAverage());
        existingResult.setOverallGrade(updatedResult.getOverallGrade());
        existingResult.setPosition(updatedResult.getPosition());
        existingResult.setUpdatedAt(LocalDateTime.now());

        return resultRepository.save(existingResult);
    }

    public void deleteResult(Long id) {
        resultRepository.deleteById(id);
    }

    public BigDecimal getAverageForStudent(Result result) {
        if (result == null || result.getAverage() == null) {
            return BigDecimal.ZERO;
        }

        return result.getAverage();
    }
}