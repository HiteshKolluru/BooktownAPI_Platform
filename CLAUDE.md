# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this project is

The **Booktown API Platform** is a portfolio project that grows a Spring Boot GraphQL
API (originally SER421 Lab — "GraphQL APIs" at ASU) into a full-stack, cloud-deployed,
security-hardened application. See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for
the 5-phase roadmap (Frontend → AWS → Security → Cybersecurity → CI/CD). **Phase 1
(Frontend) is the current focus.**

## Repository layout

```
BooktownAPI_Platform/
├── README.md                 # Public-facing project overview
├── IMPLEMENTATION_PLAN.md    # 5-phase roadmap & vision
├── CLAUDE.md                 # This file
├── .gitignore
├── backend/                  # Unified Spring Boot GraphQL API (JPA + H2) — TRACKED
├── frontend/                 # Phase 1 React app (Vite + Apollo) — TRACKED
├── Activity1/                # DEPRECATED lab v1 — to be removed (git-ignored)
└── Activity2/                # DEPRECATED lab v2 — to be removed (git-ignored)
```

> [!IMPORTANT]
> `backend/` and `frontend/` are the live, tracked projects. `Activity1/` and
> `Activity2/` are the original ASU lab projects — superseded by `backend/` and slated
> for removal. They remain **git-ignored** (each has its own nested `.git`). The `*.pdf`
> lab handout is also ignored.

## Backend (`backend/`)

The single, consolidated backend. It was built from **Activity 2** (Spring Data JPA + H2),
which is a functional **superset** of Activity 1 — same GraphQL schema and the same
queries/mutations, just backed by a real (in-memory) database instead of a hardcoded
`ArrayList`. Nothing functional from Activity 1 was lost.

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
- Stray `#AuthorRepository.java#` files are Emacs autosave artifacts — not source.
- H2 uses `ddl-auto=create-drop`, so data resets on every restart (seeded by
  `DataInitializer`). In Phase 2, H2 → RDS PostgreSQL.
- Once `Activity1/`/`Activity2/` are removed, drop their lines from `.gitignore`.
- Keep this file and IMPLEMENTATION_PLAN.md updated as phases complete.
