package test.demo.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = { test.demo.DemoApplication.class, test.demo.controller.TestController.class })
@AutoConfigureMockMvc
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void whenNoHeader_then401() throws Exception {
        mockMvc.perform(get("/test"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void whenAdminHeader_then200() throws Exception {
        mockMvc.perform(get("/test")
                .header("simple-auth", "admin"))
                .andExpect(status().isOk());
    }

    @Test
    public void whenUserHeader_then200() throws Exception {
        mockMvc.perform(get("/test")
                .header("simple-auth", "123"))
                .andExpect(status().isOk());
    }

    @Test
    public void whenInvalidUserHeader_then401() throws Exception {
        mockMvc.perform(get("/test")
                .header("simple-auth", "abc"))
                .andExpect(status().isForbidden());
    }
}
