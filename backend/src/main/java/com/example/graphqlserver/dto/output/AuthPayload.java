package com.example.graphqlserver.dto.output;

public record AuthPayload(String token, String username, long expiresInMs) {
}
