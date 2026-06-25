package com.example.graphqlserver.config;

import graphql.analysis.MaxQueryDepthInstrumentation;
import graphql.execution.instrumentation.Instrumentation;
import graphql.schema.visibility.NoIntrospectionGraphqlFieldVisibility;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

/**
 * GraphQL-layer hardening: cap query depth (DoS guard) everywhere, and disable
 * schema introspection in production only.
 */
@Configuration
public class GraphQlSecurityConfig {

    @Bean
    public Instrumentation maxQueryDepthInstrumentation(
            @Value("${app.graphql.max-query-depth}") int maxDepth) {
        return new MaxQueryDepthInstrumentation(maxDepth);
    }

    @Bean
    @Profile("prod")
    public RuntimeWiringConfigurer disableIntrospectionInProd() {
        return wiring -> wiring.fieldVisibility(
                NoIntrospectionGraphqlFieldVisibility.NO_INTROSPECTION_FIELD_VISIBILITY);
    }
}
