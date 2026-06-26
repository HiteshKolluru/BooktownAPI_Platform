# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this project is

The **Booktown API Platform** is a portfolio project that grows a Spring Boot GraphQL
API (originally SER421 Lab — "GraphQL APIs" at ASU) into a full-stack, cloud-deployed,
security-hardened application. See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for
the 5-phase roadmap (Frontend → AWS → Security → Cybersecurity → CI/CD). **All five
phases are complete**; the app is live on AWS with CI/CD.

## Repository layout

```
BooktownAPI_Platform/
├── README.md                 # Public-facing project overview
├── IMPLEMENTATION_PLAN.md    # 5-phase roadmap & vision
├── SECURITY.md               # Phase 4 security findings & remediation
├── CLAUDE.md                 # This file
├── .gitignore
├── .github/workflows/ci.yml  # CI/CD pipeline
├── backend/                  # Spring Boot GraphQL API (JPA, JWT security) — TRACKED
└── frontend/                 # React app (Vite + Apollo) — TRACKED
```

> [!NOTE]
> Local-only (git-ignored) files: `DEPLOY_AWS.md` and `HOW_TO_RUN.md` (ops runbooks) and
> `booktown-key.pem` (EC2 SSH key). The original `Activity1/`/`Activity2/` ASU lab projects
> have been removed — `backend/` superseded them.

## Backend (`backend/`)

The consolidated backend, originally built from the ASU lab's JPA + H2 activity and since
extended with Spring Security (JWT), rate limiting, and a Postgres `prod` profile for AWS.
Local dev uses in-memory H2; production uses RDS PostgreSQL.

| | |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.0.1 |
| API | Spring for GraphQL |
| Data layer | Spring Data JPA + H2 (in-memory) |
| Build | Gradle (wrapper) |

### Java package structure (`com.example.graphqlserver`)

- `GraphqlServerApplication` — Spring Boot entry point
- `GraphiqlController` — serves the GraphiQL IDE
- `model/` — `Author`, `Book` (JPA entities)
- `repository/` — `AuthorRepository`, `BookRepository` (Spring Data JPA)
- `controller/` — `AuthorController`, `BookController` (GraphQL `@QueryMapping` / `@MutationMapping`)
- `dto/input/` — `AddAuthorInput`, `AddBookInput`, etc.
- `dto/output/` — `AddAuthorPayload`, `AddBookPayload`, etc.
- `config/DataInitializer` — seeds H2 on startup

### GraphQL schema location

`backend/src/main/resources/graphql/schema.graphqls`

**Queries:** `authors`, `authorById(id)`, `books`, `bookByISBN(isbn)`,
`booksByAuthorId(authorId)`, `booksByTitleSubstring(substring)`,
`authorsByLastName(lastName)`, `bookTitlesByAuthorFirstName(firstName)`

**Mutations:** `addAuthor(input)`, `addBook(input)`,
`updateAuthorLastName(input)` (returns old last name / null),
`deleteBook(input)` (returns ISBN / null)

**Core types:** `Book { isbn, title, authorId }`, `Author { id, firstName, lastName, books }`

### Running the backend

```bash
cd backend
./gradlew bootRun
```

Starts on **http://localhost:8080**.

| URL | Purpose |
|---|---|
| `POST /graphql` | GraphQL API endpoint |
| `/graphiql` | Interactive GraphQL IDE |
| `/h2-console` | H2 console — JDBC URL `jdbc:h2:mem:booktowndb`, user `sa`, no password |

Run tests: `./gradlew test` (JUnit 5 via `useJUnitPlatform()`).

## Frontend (`frontend/`)

Vite + React + Apollo Client storefront. **Vintage bookstore aesthetic** — cream/paper
tones, serif headings (Playfair Display / Lora), amber accents — defined as a CSS design
system in `src/index.css`.

```bash
cd frontend
npm install      # first time only
npm run dev      # http://localhost:5173
```

- During dev, Vite proxies `/graphql`, `/graphiql`, `/h2-console` to the backend on
  `localhost:8080` (see `frontend/vite.config.js`), so the app calls a same-origin
  `/graphql`. Override the endpoint for deployment with `VITE_GRAPHQL_URI`.
- Pages: Dashboard, Books (search + add/delete), Authors (filter, add, edit last name,
  titles-by-first-name), API Explorer (live query runner), About.
- GraphQL operations live in `src/graphql/{queries,mutations}.js`; Apollo client in
  `src/apollo/client.js`.

## Conventions & notes for future work

- Both `backend/` and `frontend/` ship Gradle/npm projects. The Gradle wrapper jar
  (`backend/gradle/wrapper/gradle-wrapper.jar`) **must stay committed** — the root
  `.gitignore` ignores `*.jar`, but `backend/.gitignore` re-includes the wrapper.
- Local H2 uses `ddl-auto=create-drop` (data resets each restart, re-seeded idempotently by
  `DataInitializer`); the `prod` profile uses RDS PostgreSQL with `ddl-auto=update`.
- Security: writes require a JWT with `ROLE_ADMIN` (`@PreAuthorize`); reads are public.
  Admin/JWT/DB secrets come from env vars, never the repo. Introspection is off in prod.
- CI/CD: pushes/PRs run tests + JaCoCo; pushes to `main` auto-deploy the frontend to
  S3 + CloudFront via GitHub OIDC. Backend redeploy is the documented `scp` in `DEPLOY_AWS.md`.
- Keep this file, README.md, and IMPLEMENTATION_PLAN.md in sync as things change.
