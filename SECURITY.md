# Security Overview & Findings — Booktown API Platform

This document records the **Phase 4 (Cybersecurity)** work: an automated vulnerability
scan of the live deployment, the remediations applied, monitoring/alerting, and a list of
accepted risks with rationale. It complements the app-level controls added in **Phase 3**.

- **Target:** `https://d2jp9hcegs2w8v.cloudfront.net` (production)
- **Scanner:** OWASP ZAP (baseline scan — spider + passive rules)
- **Date:** 2026-06-25
- **Result:** **0 high/critical, 0 failures.** Header warnings reduced **12 → 8** after remediation; remaining items are informational or accepted with rationale.

---

## Defense-in-depth summary

```
            CloudFront (HTTPS, security headers, TLS)
                 │
   ┌─────────────┴───────────────┐
   │                             │
 S3 (private, OAC)        EC2 :8080  ── Spring Security ──► RDS (private subnet/SG)
 React app                GraphQL API     • JWT auth (admin)
                                          • RBAC: reads public, writes ROLE_ADMIN
                                          • query-depth limit, rate limiting
                                          • introspection disabled in prod
```

| Layer | Control |
|---|---|
| Network | RDS reachable only from the EC2 security group; EC2 `:8080` reachable only from CloudFront's managed prefix list; SSH only from the admin IP |
| Transport | HTTPS everywhere (CloudFront), **HSTS** `max-age=63072000; includeSubDomains; preload` |
| Edge / browser | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP |
| Application | Spring Security + JWT; write mutations require `ROLE_ADMIN`; per-IP rate limiting; GraphQL query-depth cap; schema introspection disabled in prod |
| Secrets | DB password, admin password, and JWT secret are environment variables on the host — never in the repo |
| Monitoring | CloudWatch alarms (5xx error rate, request spike) → SNS email |

---

## Scan findings & remediation

### Fixed — missing HTTP security headers
The static site originally returned **no** security headers. Remediated with a **CloudFront
Response Headers Policy** (`booktown-security-headers`) attached to all cache behaviors:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-XSS-Protection` | `0` (modern guidance — rely on CSP, not the legacy auditor) |

> The CSP intentionally allows `fonts.googleapis.com` / `fonts.gstatic.com` (Google Fonts)
> and `'unsafe-inline'` for styles (React inline-style attributes), while keeping
> `script-src 'self'` and `connect-src 'self'` (same-origin GraphQL).

### Application-level controls (Phase 3, verified during this scan)
- **AuthN/AuthZ:** unauthenticated write mutations return `FORBIDDEN`; bad credentials return `UNAUTHORIZED`. Confirmed via CloudFront.
- **Introspection:** `__schema` queries are blocked under the `prod` profile.
- **Rate limiting:** per-IP fixed-window limiter (120 req/min default).
- **Query depth:** capped (12) to mitigate nested-query DoS.

---

## Accepted risks (with rationale)

| Finding | Why accepted |
|---|---|
| `Server: AmazonS3` version leak | Set by CloudFront/S3; cannot be removed via CloudFront. Low value to an attacker. |
| Storable/cacheable content, "retrieved from cache", cache-control | Expected and desirable for static SPA assets served via CDN. |
| "Modern Web Application" | Informational — the site is a React SPA. |
| Subresource Integrity (SRI) missing | Assets are same-origin, content-hashed Vite bundles (not third-party CDN scripts); SRI adds little. |
| Cross-Origin-Embedder-Policy missing | **By design** — `COEP: require-corp` would block Google Fonts (cross-origin, no CORP). Not required for this app's threat model. |
| CSP "directive with no fallback" [10055] | Minor; can be tightened by adding `form-action 'self'; frame-src 'none'`. No forms post cross-origin today. |

---

## Edge WAF (optional, not currently deployed)

An AWS WAF Web ACL on CloudFront (AWS managed OWASP rule sets + a rate-based rule) was
evaluated and **intentionally left off to stay within budget** (~$8–10/mo). It can be
enabled on demand:
- `AWSManagedRulesCommonRuleSet`, `AWSManagedRulesKnownBadInputsRuleSet`
- Rate-based rule (e.g. 2000 req / 5 min / IP)
- WAF metrics → CloudWatch

---

## Reproduce the scan

```bash
docker run --rm -t -v "$PWD:/zap/wrk:rw" ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t https://d2jp9hcegs2w8v.cloudfront.net -r zap-report.html -I
```
