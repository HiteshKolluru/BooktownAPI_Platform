package com.example.graphqlserver.config;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.ErrorType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

/**
 * Maps Spring Security exceptions to clean GraphQL errors so clients get a clear
 * message instead of a generic INTERNAL_ERROR.
 */
@Component
public class SecurityExceptionResolver extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        if (ex instanceof AuthenticationException) {
            return GraphqlErrorBuilder.newError(env)
                    .errorType(ErrorType.UNAUTHORIZED)
                    .message("Invalid username or password.")
                    .build();
        }
        if (ex instanceof AccessDeniedException) {
            return GraphqlErrorBuilder.newError(env)
                    .errorType(ErrorType.FORBIDDEN)
                    .message("You must be logged in as an admin to perform this action.")
                    .build();
        }
        return null;
    }
}
