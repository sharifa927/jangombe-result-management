package com.jangombe.jangombe_backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class ResultConstraintMigration {

    @Bean
    ApplicationRunner allowMultipleResultsPerStudent(JdbcTemplate jdbcTemplate) {
        return args -> jdbcTemplate.execute("""
                DO $$
                DECLARE single_student_constraint text;
                BEGIN
                    SELECT constraint_info.conname INTO single_student_constraint
                    FROM pg_constraint constraint_info
                    JOIN pg_attribute student_column
                      ON student_column.attrelid = constraint_info.conrelid
                     AND student_column.attname = 'student_id'
                    WHERE constraint_info.conrelid = to_regclass('results')
                      AND constraint_info.contype = 'u'
                      AND constraint_info.conkey = ARRAY[student_column.attnum]::smallint[];

                    IF single_student_constraint IS NOT NULL THEN
                        EXECUTE format('ALTER TABLE results DROP CONSTRAINT %I', single_student_constraint);
                    END IF;
                END $$
                """);
    }
}