package test.demo.service;

import test.demo.dto.SubmissionRequest;
import test.demo.model.Submission;
import test.demo.model.TeamMember;
import test.demo.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

        if (request.getTeamMembers() != null) {
            List<TeamMember> members = request.getTeamMembers().stream()
                    .map(dto -> TeamMember.builder()
                            .name(dto.getName())
                            .companyId(dto.getCompanyId())
                            .submission(submission)
                            .build())
                    .collect(Collectors.toList());
            submission.getTeamMembers().addAll(members);
        }

        return repository.save(submission);
    }
}
