# Booktown GraphQL API Platform

A Spring Boot GraphQL API for managing a bookstore's books and authors. Built as part of **SER421 — Lab: GraphQL APIs** at Arizona State University.

## Overview

This project implements a full GraphQL API over the classic Booktown database with two separate implementations:

| | Activity 1 | Activity 2 |
|---|---|---|
| **Backend** | In-memory static data (no database) | Spring Data JPA + H2 embedded database |
| **Spring Boot** | 3.0.1 | 3.0.1 |
| **Java** | 17 | 17 |
| **Data** | `ArrayList` with hardcoded seed data | JPA entities loaded via `CommandLineRunner` |

## GraphQL API Endpoints

### Queries

| Query | Description |
|---|---|
| `authors` | Get all authors |
| `authorById(id)` | Get an author by ID |
| `books` | Get all books |
| `bookByISBN(isbn)` | Get a book by ISBN |
| `booksByAuthorId(authorId)` | Get books by a specific author |
| `booksByTitleSubstring(substring)` | Search books by title substring (case-insensitive) |
| `authorsByLastName(lastName)` | Find authors by last name |
| `bookTitlesByAuthorFirstName(firstName)` | Get book titles written by authors with a given first name |

### Mutations

| Mutation | Description |
|---|---|
| `addAuthor(input)` | Add a new author |
| `addBook(input)` | Add a new book |
| `updateAuthorLastName(input)` | Update an author's last name by ID — returns old last name if successful, null otherwise |
| `deleteBook(input)` | Delete a book by ISBN — returns ISBN if successful, null otherwise |

## Getting Started

### Prerequisites

- **JDK 17+** installed
- **Gradle** (wrapper included, no install needed)

### Running Activity 1 (In-Memory)

```bash
cd Activity1/BooktownGraphQl
./gradlew bootRun
```

### Running Activity 2 (JPA + H2)

```bash
cd Activity2/BooktownGraphQl
./gradlew bootRun
```

Both activities start on **http://localhost:8080**.

### Endpoints

| URL | Description |
|---|---|
| `POST /graphql` | GraphQL API endpoint |
| `/graphiql` | Interactive GraphQL IDE for testing queries |
| `/h2-console` | H2 database console (Activity 2 only) |

## Example Queries

```graphql
# Get all books with their authors
query {
  books {
    isbn
    title
    authorId
  }
}

# Search books by title
query {
  booksByTitleSubstring(substring: "Great") {
    isbn
    title
    authorId
  }
}

# Update an author's last name
mutation {
  updateAuthorLastName(input: {
    id: 0
    newLastName: "NewLastName"
  }) {
    oldLastName
    author {
      id
      firstName
      lastName
    }
  }
}
```

## Testing

Postman collections with positive and negative test cases are included in each activity folder. Test coverage includes:

- Valid queries returning expected data
- Queries with non-existent IDs (returns empty lists or null)
- Negative IDs and invalid inputs (returns validation errors)
- Invalid GraphQL syntax
- Empty/missing parameters

## Project Structure

```
BooktownAPI_Platform/
├── README.md
├── Activity1/           # In-memory GraphQL API (own git repo)
│   └── BooktownGraphQl/
└── Activity2/           # JPA + H2 GraphQL API (own git repo)
    └── BooktownGraphQl/
```

> **Note:** Activity1 and Activity2 each have their own `.git` repos and are excluded from this root repository's tracking.
