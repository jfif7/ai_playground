package test.demo.controller;

import test.demo.dto.SubmissionRequest;
import test.demo.model.Submission;
import test.demo.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService service;

    @PostMapping
    public ResponseEntity<Submission> createSubmission(@Valid @RequestBody SubmissionRequest request) {
        Submission created = service.createSubmission(request);
        return ResponseEntity.ok(created);
    }
}
