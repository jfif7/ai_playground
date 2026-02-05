package test.demo.controller;

import test.demo.dto.SubmissionRequest;
import test.demo.model.Organization;
import tools.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application.properties")
public class SubmissionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper objectMapper;

    @Test
    void createSubmission_ValidRequest_ShouldReturnSavedSubmission() throws Exception {
        SubmissionRequest request = new SubmissionRequest();
        request.setName("John Doe");
        request.setCompanyId("COMP001");
        request.setOrganization(Organization.TSID);
        request.setInfo("Valid info string");

        mockMvc.perform(post("/api/v1/submissions")
                .header("simple-auth", "admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.organization").value("TSID"));
    }

    @Test
    void createSubmission_InvalidOrganization_ShouldReturnBadRequest() throws Exception {
        String invalidJson = """
                    {
                        "name": "Jane",
                        "companyId": "C99",
                        "organization": "INVALID_ORG",
                        "info": "Info"
                    }
                """;

        mockMvc.perform(post("/api/v1/submissions")
                .header("simple-auth", "admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createSubmission_InfoTooLong_ShouldReturnBadRequest() throws Exception {
        SubmissionRequest request = new SubmissionRequest();
        request.setName("John Doe");
        request.setCompanyId("COMP001");
        request.setOrganization(Organization.IMDB);
        // Create > 140 chars string
        request.setInfo("A".repeat(141));

        mockMvc.perform(post("/api/v1/submissions")
                .header("simple-auth", "admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.info").value("Info must be within 140 characters"));
    }
}
