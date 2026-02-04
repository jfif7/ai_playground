package test.demo.dto;

import test.demo.model.Organization;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SubmissionRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Company ID is required")
    private String companyId;

    @NotNull(message = "Organization is required")
    private Organization organization;

    @Size(max = 140, message = "Info must be within 140 characters")
    private String info;
}
