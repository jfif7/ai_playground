package test.demo.service;

import test.demo.dto.SubmissionRequest;
import test.demo.model.Submission;
import test.demo.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository repository;

    public Submission createSubmission(SubmissionRequest request) {
        Submission submission = Submission.builder()
                .name(request.getName())
                .companyId(request.getCompanyId())
                .organization(request.getOrganization())
                .info(request.getInfo())
                .build();
        return repository.save(submission);
    }
}
