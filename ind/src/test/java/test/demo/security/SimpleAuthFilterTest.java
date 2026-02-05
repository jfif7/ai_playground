package test.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SimpleAuthFilterTest {

    @InjectMocks
    private SimpleAuthFilter simpleAuthFilter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @AfterEach
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void doFilterInternal_WithAdminHeader_ShouldSetAdminAuth() throws Exception {
        when(request.getHeader("simple-auth")).thenReturn("admin");

        simpleAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals("admin", auth.getPrincipal());
        assertTrue(auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));

        verify(filterChain).doFilter(request, response);
    }

    @Test
    public void doFilterInternal_WithUserHeader_ShouldSetUserAuth() throws Exception {
        when(request.getHeader("simple-auth")).thenReturn("123");

        simpleAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        assertEquals(123L, auth.getPrincipal());
        assertTrue(auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));

        verify(filterChain).doFilter(request, response);
    }

    @Test
    public void doFilterInternal_WithInvalidHeader_ShouldNotSetAuth() throws Exception {
        when(request.getHeader("simple-auth")).thenReturn("invalid");

        simpleAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNull(auth);

        verify(filterChain).doFilter(request, response);
    }

    @Test
    public void doFilterInternal_WithoutHeader_ShouldNotSetAuth() throws Exception {
        when(request.getHeader("simple-auth")).thenReturn(null);

        simpleAuthFilter.doFilterInternal(request, response, filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNull(auth);

        verify(filterChain).doFilter(request, response);
    }
}
