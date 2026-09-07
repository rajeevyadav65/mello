package com.melodia;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.data.mongodb.uri=mongodb://localhost:27017/melodia_test"
})
class MelodiaApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring context wires up (security, JPA, controllers) without errors.
    }
}
