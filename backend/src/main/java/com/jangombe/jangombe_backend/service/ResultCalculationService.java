package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.dto.CalculatedResultResponse;
import com.jangombe.jangombe_backend.entity.Mark;
import com.jangombe.jangombe_backend.entity.Result;
import com.jangombe.jangombe_backend.repository.MarkRepository;
import com.jangombe.jangombe_backend.repository.ResultRepository;
import com.jangombe.jangombe_backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ResultCalculationService {

    private final MarkRepository markRepository;
    private final SubmissionRepository submissionRepository;
        private final ResultRepository resultRepository;

    public ResultCalculationService(
            MarkRepository markRepository,
                        SubmissionRepository submissionRepository,
                        ResultRepository resultRepository) {
        this.markRepository = markRepository;
        this.submissionRepository = submissionRepository;
                this.resultRepository = resultRepository;
    }

    public List<CalculatedResultResponse> calculate(Long classId, String academicYear, String term) {
        Set<String> approvedAssignments = submissionRepository
                .findByClassEntityIdAndAcademicYearAndTermAndStatus(classId, academicYear, term, "APPROVED")
                .stream()
                .map(submission -> assignmentKey(submission.getTeacher().getId(), submission.getSubject().getId()))
                .collect(Collectors.toSet());

        Map<Long, List<Mark>> marksByStudent = markRepository.findByClassEntityId(classId).stream()
                .filter(mark -> academicYear.equals(mark.getAcademicYear()) && term.equals(mark.getTerm()))
                .filter(mark -> approvedAssignments.contains(assignmentKey(
                        mark.getTeacher().getId(), mark.getSubject().getId())))
                .collect(Collectors.groupingBy(mark -> mark.getStudent().getId(), LinkedHashMap::new, Collectors.toList()));

        List<CalculatedResultResponse> results = new ArrayList<>();
        for (List<Mark> studentMarks : marksByStudent.values()) {
            Mark firstMark = studentMarks.get(0);
            BigDecimal total = studentMarks.stream()
                    .map(Mark::getMarks)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal average = total.divide(BigDecimal.valueOf(studentMarks.size()), 2, RoundingMode.HALF_UP);
            List<CalculatedResultResponse.SubjectResult> subjects = studentMarks.stream()
                    .map(mark -> new CalculatedResultResponse.SubjectResult(
                            mark.getSubject().getId(),
                            mark.getSubject().getName(),
                            mark.getMarks(),
                            grade(mark.getMarks())))
                    .toList();

            results.add(new CalculatedResultResponse(
                    firstMark.getStudent().getId(),
                    (firstMark.getStudent().getFirstName() + " " + firstMark.getStudent().getLastName()).trim(),
                    firstMark.getStudent().getAdmissionNumber(),
                    total,
                    average,
                    grade(average),
                    0,
                    subjects));
        }

        results.sort(Comparator.comparing(CalculatedResultResponse::average).reversed()
                .thenComparing(CalculatedResultResponse::studentName));
        List<CalculatedResultResponse> rankedResults = new ArrayList<>();
        for (int index = 0; index < results.size(); index++) {
            CalculatedResultResponse result = results.get(index);
            rankedResults.add(new CalculatedResultResponse(
                    result.studentId(),
                    result.studentName(),
                    result.admissionNumber(),
                    result.totalMarks(),
                    result.average(),
                    result.overallGrade(),
                    index + 1,
                    result.subjects()));
        }
                persistResults(rankedResults, marksByStudent, classId, academicYear, term);
        return rankedResults;
    }

        private void persistResults(
                        List<CalculatedResultResponse> results,
                        Map<Long, List<Mark>> marksByStudent,
                        Long classId,
                        String academicYear,
                        String term) {
                for (CalculatedResultResponse calculated : results) {
                        List<Mark> studentMarks = marksByStudent.get(calculated.studentId());
                        if (studentMarks == null || studentMarks.isEmpty()) continue;

                        Result result = resultRepository
                                        .findByStudentIdAndAcademicYearAndTerm(calculated.studentId(), academicYear, term)
                                        .orElseGet(Result::new);
                        result.setStudent(studentMarks.get(0).getStudent());
                        result.setClassEntity(studentMarks.get(0).getClassEntity());
                        result.setAcademicYear(academicYear);
                        result.setTerm(term);
                        result.setTotalMarks(calculated.totalMarks());
                        result.setAverage(calculated.average());
                        result.setOverallGrade(calculated.overallGrade());
                        result.setPosition(calculated.position());
                        resultRepository.save(result);
                }
        }

    private String assignmentKey(Long teacherId, Long subjectId) {
        return teacherId + ":" + subjectId;
    }

    private String grade(BigDecimal marks) {
        if (marks.compareTo(BigDecimal.valueOf(75)) >= 0) return "A";
        if (marks.compareTo(BigDecimal.valueOf(65)) >= 0) return "B";
        if (marks.compareTo(BigDecimal.valueOf(45)) >= 0) return "C";
        if (marks.compareTo(BigDecimal.valueOf(30)) >= 0) return "D";
        return "F";
    }
}