package test.demo.controller;

import tools.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import test.demo.dto.SubmissionRequest;
import test.demo.model.Organization;
import test.demo.model.Submission;
import test.demo.service.SubmissionService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubmissionController.class)
class SubmissionControllerUnitTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SubmissionService service;

    @Autowired
    private JsonMapper objectMapper;

    @Test
    void createSubmission_ShouldReturn200_WhenValid() throws Exception {
        // Given
        SubmissionRequest request = new SubmissionRequest();
        request.setName("Unit Test User");
        request.setCompanyId("C999");
        request.setOrganization(Organization.AAID);
        request.setInfo("Short info");

        Submission mockSubmission = Submission.builder()
                .id(1L)
                .name("Unit Test User")
                .organization(Organization.AAID)
                .build();

        // When (Mocking the service layer completely)
        when(service.createSubmission(any(SubmissionRequest.class))).thenReturn(mockSubmission);

        // Then
        mockMvc.perform(post("/api/v1/submissions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Unit Test User"));
    }
}
