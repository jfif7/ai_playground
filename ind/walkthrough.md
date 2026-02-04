# Spring Boot Form Submission Demo App Walkthrough

## Overview
This demo application is a Spring Boot Backend for handling form submissions. It is designed with a layered architecture and adheres to modern best practices including:
- **Layered Architecture**: Controller -> Service -> Repository
- **DTO Pattern**: Separation of API models (`SubmissionRequest`) and Database Entities (`Submission`).
- **Data Validation**: Using Jakarta Validation constraints (`@NotBlank`, `@Size`) and `Enum` validation.
- **Global Exception Handling**: Centralized error handling for clean API responses.
- **Database Integration**: Configured for MariaDB (Production) and H2 (Testing).

## Verification Results

### Automated Tests
All automated tests passed successfully using the `maven:3.9-eclipse-temurin-17` Docker container from the root directory.

**Summary:**
- **Tests Run**: 5
- **Failures**: 0
- **Errors**: 0
- **Skipped**: 0

**Test Suites:**
1.  **`SubmissionControllerIntegrationTest`**:
    -   `createSubmission_ValidRequest_ShouldReturnSavedSubmission`: Verified successful submission flow with DB persistence.
    -   `createSubmission_InvalidOrganization_ShouldReturnBadRequest`: Verified validation for invalid organization values.
    -   `createSubmission_InfoTooLong_ShouldReturnBadRequest`: Verified `@Size(max=140)` validation on the `info` field.
2.  **`SubmissionServiceTest`**:
    -   `createSubmission_ShouldSaveAndReturnSubmission`: Verified business logic mapping from DTO to Entity.
3.  **`DemoApplicationTests`**:
    -   `contextLoads`: Verified that the Spring Application Context loads successfully (configured to use H2).

### How to Run Tests
Since `mvn` is not installed on the host, use Docker:

```bash
docker run --rm -v $(pwd):/app -w /app maven:3.9-eclipse-temurin-17 mvn test
```

## Key Components

### 1. API Endpoint
**POST** `api/v1/submissions`

**Request Body:**
```json
{
  "name": "John Doe",
  "companyId": "COMP123",
  "organization": "AAID",
  "info": "This is a test submission."
}
```

**Constraints:**
- `organization`: Must be one of `AAID`, `TSID`, `IMDB`.
- `info`: Max 140 characters.

### 2. Validation Logic
Validation is applied on the DTO `SubmissionRequest` and enforced in the Controller using `@Valid`.

```java
package test.demo.dto;

@Data
public class SubmissionRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Organization is required")
    private Organization organization;

    @Size(max = 140, message = "Info must be within 140 characters")
    private String info;
}
```

### 3. Exception Handling
`GlobalExceptionHandler` catches `MethodArgumentNotValidException` and returns a map of field errors, ensuring the client gets specific feedback on what went wrong.

```json
{
    "organization": "Organization is required",
    "info": "Info must be within 140 characters"
}
```
