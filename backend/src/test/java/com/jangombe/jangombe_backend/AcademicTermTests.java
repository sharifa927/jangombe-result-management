package com.jangombe.jangombe_backend;

import com.jangombe.jangombe_backend.util.AcademicTerm;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AcademicTermTests {

    @Test
    void normalizesCaseAndWhitespace() {
        assertThat(AcademicTerm.normalize("  term   1 ")).isEqualTo("TERM_1");
        assertThat(AcademicTerm.normalize("term_2")).isEqualTo("TERM_2");
    }

    @Test
    void rejectsUnsupportedTermsAsBadRequests() {
        assertThatThrownBy(() -> AcademicTerm.normalize("Term 3"))
                .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("Term must be Term 1 or Term 2");
    }
}