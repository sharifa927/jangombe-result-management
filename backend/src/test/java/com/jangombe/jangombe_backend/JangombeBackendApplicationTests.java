package com.jangombe.jangombe_backend;

import com.jangombe.jangombe_backend.entity.User;
import com.jangombe.jangombe_backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class JangombeBackendApplicationTests {

	@Autowired
	private CorsConfigurationSource corsConfigurationSource;

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void dashboardEndpointReturnsLiveSummaryForAuthenticatedAdmin() throws Exception {
		MockHttpSession session = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"admin@gmail.com\",\"password\":\"admin123\"}"))
			.andExpect(status().isOk())
			.andReturn()
			.getRequest()
			.getSession(false);

		mockMvc.perform(get("/api/submissions/dashboard").session(session))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.stats").exists())
			.andExpect(jsonPath("$.recentSubmissions").isArray());
	}

	@Test
	void apiRejectsRequestsWithoutLoginSession() throws Exception {
		mockMvc.perform(get("/api/students"))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void corsAllowsLocalhostDevelopmentPorts() {
		MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/auth/login");
		request.addHeader("Origin", "http://localhost:40209");

		CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);

		assertThat(config).isNotNull();
		assertThat(config.getAllowedOriginPatterns())
			.contains("http://localhost:*", "http://127.0.0.1:*");
	}

	@Test
	void supportsLegacyPlainTextPasswords() {
		String password = "legacy-pass-123";
		User user = new User();
		user.setUsername("legacy-user@example.com");
		user.setPassword(password);
		user.setRole("TEACHER");

		assertThat(userService.isPasswordValid(password, user.getPassword())).isTrue();
		assertThat(passwordEncoder.matches(password, passwordEncoder.encode(password))).isTrue();
	}

	@Test
	void developmentAccountsCanLogInWithTheirExpectedRoles() throws Exception {
		mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"admin@gmail.com\",\"password\":\"admin123\"}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.role").value("ADMIN"));

		mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"teacher@gmail.com\",\"password\":\"teacher123\"}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.role").value("TEACHER"));
	}

	@Test
	void teachersCannotManageRostersOrAccessResults() throws Exception {
		MockHttpSession teacherSession = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"teacher@gmail.com\",\"password\":\"teacher123\"}"))
			.andExpect(status().isOk())
			.andReturn()
			.getRequest()
			.getSession(false);

		mockMvc.perform(post("/api/students")
				.session(teacherSession)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"admissionNumber\":\"AUTH-TEST\",\"firstName\":\"Test\",\"lastName\":\"Student\",\"classEntity\":{\"id\":1}}"))
			.andExpect(status().isForbidden());

		mockMvc.perform(get("/api/results").session(teacherSession))
			.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/results/calculate")
				.session(teacherSession)
				.param("classId", "1")
				.param("academicYear", "2026")
				.param("term", "Term 1"))
			.andExpect(status().isForbidden());
	}

	@Test
	void adminCanCallResultCalculationEndpoint() throws Exception {
		MockHttpSession adminSession = (MockHttpSession) mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"admin@gmail.com\",\"password\":\"admin123\"}"))
			.andExpect(status().isOk())
			.andReturn()
			.getRequest()
			.getSession(false);

		mockMvc.perform(post("/api/results/calculate")
				.session(adminSession)
				.param("classId", "1")
				.param("academicYear", "2026")
				.param("term", "Term 1"))
			.andExpect(status().isOk());
	}

}
