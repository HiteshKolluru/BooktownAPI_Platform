package com.example.graphqlserver.controller;

import com.example.graphqlserver.dto.input.LoginInput;
import com.example.graphqlserver.dto.output.AuthPayload;
import com.example.graphqlserver.security.JwtService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;

import java.util.List;

/**
 * Authentication entry point. `login` is intentionally public (no @PreAuthorize)
 * so anyone can exchange credentials for a JWT.
 */
@Controller
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwt;

    public AuthController(AuthenticationManager authManager, JwtService jwt) {
        this.authManager = authManager;
        this.jwt = jwt;
    }

    @MutationMapping
    public AuthPayload login(@Argument LoginInput input) {
        if (input == null || input.username() == null || input.password() == null) {
            throw new BadCredentialsException("Username and password are required");
        }
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.username(), input.password()));
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        String token = jwt.generate(auth.getName(), roles);
        return new AuthPayload(token, auth.getName(), jwt.getExpirationMs());
    }
}
