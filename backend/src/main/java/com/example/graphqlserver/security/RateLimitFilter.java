package com.example.graphqlserver.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lightweight, dependency-free per-IP rate limiter using a fixed 1-minute window.
 * Behind CloudFront the real client IP arrives in X-Forwarded-For.
 */
@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private final int maxPerMinute;
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    public RateLimitFilter(@Value("${app.security.rate-limit-per-minute}") int maxPerMinute) {
        this.maxPerMinute = maxPerMinute;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req,
                                    @NonNull HttpServletResponse res,
                                    @NonNull FilterChain chain) throws ServletException, IOException {
        String ip = clientIp(req);
        long minute = System.currentTimeMillis() / 60_000L;
        Window w = windows.compute(ip, (k, cur) -> (cur == null || cur.minute != minute) ? new Window(minute) : cur);

        if (w.count.incrementAndGet() > maxPerMinute) {
            res.setStatus(429);
            res.setContentType("application/json");
            res.getWriter().write("{\"errors\":[{\"message\":\"Rate limit exceeded. Please slow down.\"}]}");
            return;
        }
        chain.doFilter(req, res);
    }

    private String clientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }

    private static final class Window {
        final long minute;
        final AtomicInteger count = new AtomicInteger(0);
        Window(long minute) { this.minute = minute; }
    }
}
