# Booktown Backend — Spring Boot GraphQL API

The unified backend for the **Booktown API Platform**. A Spring Boot GraphQL API for
managing books and authors, backed by Spring Data JPA over an in-memory H2 database.

> This is the single, consolidated backend. It supersedes the original `Activity1`
> (in-memory `ArrayList` data) and `Activity2` (JPA + H2) lab projects — it carries the
> full feature set of both, built on the JPA/H2 data layer.

## Stack

| | |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.0.1 |
| API | Spring for GraphQL |
| Data | Spring Data JPA + H2 (in-memory) |
| Build | Gradle (wrapper included) |

## Running

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

The H2 schema uses `ddl-auto=create-drop` and is re-seeded on every startup by
[`config/DataInitializer`](src/main/java/com/example/graphqlserver/config/DataInitializer.java).

Run the tests:

```bash
./gradlew test
```

## GraphQL schema

Defined in
[`src/main/resources/graphql/schema.graphqls`](src/main/resources/graphql/schema.graphqls).

### Queries

| Query | Description |
|---|---|
| `authors` | All authors |
| `authorById(id)` | Author by ID |
| `books` | All books |
| `bookByISBN(isbn)` | Book by ISBN |
| `booksByAuthorId(authorId)` | Books by a given author |
| `booksByTitleSubstring(substring)` | Title search (case-insensitive) |
| `authorsByLastName(lastName)` | Authors by last name (case-insensitive) |
| `bookTitlesByAuthorFirstName(firstName)` | Titles written by authors with a first name |

### Mutations

| Mutation | Description |
|---|---|
| `addAuthor(input)` | Add a new author |
| `addBook(input)` | Add a new book (author must exist) |
| `updateAuthorLastName(input)` | Update an author's last name — returns old last name, or null if not found |
| `deleteBook(input)` | Delete a book by ISBN — returns ISBN, or null if not found |

### Example queries

```graphql
# All authors with their books
query {
  authors {
    id
    firstName
    lastName
    books { isbn title }
  }
}

# Search books by title
query {
  booksByTitleSubstring(substring: "the") {
    isbn
    title
    authorId
  }
}

# Add a book
mutation {
  addBook(input: { isbn: "999-0001", title: "A New Tale", authorId: 1 }) {
    book { isbn title authorId }
  }
}
```

A Postman collection ([`bookStore.postman_collection.json`](bookStore.postman_collection.json))
is included for convenience.

## Package layout (`com.example.graphqlserver`)

- `GraphqlServerApplication` — Spring Boot entry point
- `GraphiqlController` — serves the GraphiQL IDE
- `model/` — `Author`, `Book` (JPA entities)
- `repository/` — `AuthorRepository`, `BookRepository` (Spring Data JPA)
- `controller/` — `AuthorController`, `BookController` (`@QueryMapping` / `@MutationMapping`)
- `dto/input/`, `dto/output/` — GraphQL input/payload records
- `config/DataInitializer` — seeds H2 on startup
