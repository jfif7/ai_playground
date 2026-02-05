---
description: Develops Spring Boot applications
---

## Tools and dependencies

- Spring 4.0.1
- Maven 3.9
- Java 17

### Testing
- MockMvc

### Database
- H2

## Run project
```bash
docker-compose up -d --build
```

## Test project
```bash
docker run --rm -v $(pwd):/app -w /app maven:3.9-eclipse-temurin-17 mvn test
```