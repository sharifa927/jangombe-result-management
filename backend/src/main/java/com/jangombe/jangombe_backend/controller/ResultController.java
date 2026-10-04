package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.entity.Result;
import com.jangombe.jangombe_backend.dto.CalculatedResultResponse;
import com.jangombe.jangombe_backend.service.ResultCalculationService;
import com.jangombe.jangombe_backend.service.ResultService;
import com.jangombe.jangombe_backend.util.AcademicTerm;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
@PreAuthorize("hasRole('ADMIN')")
public class ResultController {

    private final ResultService resultService;
    private final ResultCalculationService resultCalculationService;

    public ResultController(ResultService resultService, ResultCalculationService resultCalculationService) {
        this.resultService = resultService;
        this.resultCalculationService = resultCalculationService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<List<CalculatedResultResponse>> calculateResults(
            @RequestParam Long classId,
            @RequestParam String academicYear,
            @RequestParam String term) {
        return ResponseEntity.ok(resultCalculationService.calculate(
            classId,
            academicYear,
            AcademicTerm.normalize(term)));
    }

    @PostMapping
    public ResponseEntity<Result> createResult(
            @RequestBody Result result) {

        return ResponseEntity.ok(
                resultService.createResult(result)
        );
    }

    @GetMapping
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(
                resultService.getAllResults()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(
            @PathVariable Long id) {

        return resultService.getResultById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Result>> getByClass(
            @PathVariable Long classId) {

        return ResponseEntity.ok(
                resultService.getResultsByClass(classId)
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Result> getStudentResult(
            @PathVariable Long studentId,
            @RequestParam String academicYear,
            @RequestParam String term) {

        return resultService.getStudentResult(
                studentId,
                academicYear,
                term
        )
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(
            @PathVariable Long id,
            @RequestBody Result result) {

        try {
            return ResponseEntity.ok(
                    resultService.updateResult(id, result)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long id) {

        if (resultService.getResultById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        resultService.deleteResult(id);

        return ResponseEntity.noContent().build();
    }
}