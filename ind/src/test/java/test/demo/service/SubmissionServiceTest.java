package test.demo.service;

import test.demo.dto.SubmissionRequest;
import test.demo.model.Organization;
import test.demo.model.Submission;
import test.demo.repository.SubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {

    @Mock
    private SubmissionRepository repository;

    @InjectMocks
    private SubmissionService service;

    private SubmissionRequest request;

    @BeforeEach
    void setUp() {
        request = new SubmissionRequest();
        request.setName("Test User");
        request.setCompanyId("C123");
        request.setOrganization(Organization.AAID);
        request.setInfo("Test Info");
    }

    @Test
    void createSubmission_ShouldSaveAndReturnSubmission() {
        Submission savedSubmission = Submission.builder()
                .id(1L)
                .name(request.getName())
                .companyId(request.getCompanyId())
                .organization(request.getOrganization())
                .info(request.getInfo())
                .build();

        when(repository.save(any(Submission.class))).thenReturn(savedSubmission);

        Submission result = service.createSubmission(request);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test User", result.getName());
        assertEquals("C123", result.getCompanyId());
        assertEquals(Organization.AAID, result.getOrganization());
        assertEquals("Test Info", result.getInfo());

        verify(repository).save(any(Submission.class));
    }
}
