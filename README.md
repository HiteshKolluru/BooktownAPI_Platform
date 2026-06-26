# 📚 Booktown API Platform

[![CI/CD](https://github.com/HiteshKolluru/BooktownAPI_Platform/actions/workflows/ci.yml/badge.svg)](https://github.com/HiteshKolluru/BooktownAPI_Platform/actions/workflows/ci.yml)
&nbsp;**Live demo → https://d2jp9hcegs2w8v.cloudfront.net**

A full-stack GraphQL bookstore — a React storefront over a Spring Boot GraphQL API,
backed by PostgreSQL, deployed on AWS with JWT auth and a CI/CD pipeline.

## Tech

- **Frontend:** JavaScript / React (Vite, Apollo Client)
- **Backend:** Java 17 / Spring Boot 3 (Spring for GraphQL, Spring Security + JWT, Spring Data JPA)
- **Database:** PostgreSQL (AWS RDS) in production, H2 in local dev
- **Cloud (AWS):** EC2 (API), RDS (database), S3 + CloudFront (frontend, HTTPS), CloudWatch (monitoring)
- **CI/CD:** GitHub Actions — tests + JaCoCo coverage on every push, auto-deploy to AWS on `main`
