package com.example.graphqlserver;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.graphql.test.tester.HttpGraphQlTester;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Full-stack tests over HTTP (random port) so the JWT filter, method security,
 * and GraphQL layer are all exercised end-to-end. Uses the default profile
 * (in-memory H2, default admin/admin credentials).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiIntegrationTests {

    @LocalServerPort
    int port;

    private HttpGraphQlTester anon() {
        WebTestClient client = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port + "/graphql")
                .build();
        return HttpGraphQlTester.create(client);
    }

    private String adminToken() {
        return anon().document("""
                        mutation { login(input: {username: "admin", password: "admin"}) { token } }
                        """)
                .execute()
                .path("login.token").entity(String.class).get();
    }

    private HttpGraphQlTester admin() {
        String token = adminToken();
        return anon().mutate().header("Authorization", "Bearer " + token).build();
    }

    // ---- Public reads ----

    @Test
    void books_query_is_public_and_returns_seed_data() {
        anon().document("{ books { isbn title authorId } }")
                .execute()
                .path("books").entityList(Object.class).hasSizeGreaterThan(0);
    }

    @Test
    void authors_query_is_public() {
        anon().document("{ authors { id firstName lastName } }")
                .execute()
                .path("authors").entityList(Object.class).hasSizeGreaterThan(0);
    }

    // ---- Authentication ----

    @Test
    void login_with_valid_credentials_returns_token() {
        anon().document("""
                        mutation { login(input: {username: "admin", password: "admin"}) { token username } }
                        """)
                .execute()
                .path("login.token").entity(String.class).satisfies(t -> assertThat(t).isNotBlank())
                .path("login.username").entity(String.class).isEqualTo("admin");
    }

    @Test
    void login_with_bad_credentials_is_unauthorized() {
        anon().document("""
                        mutation { login(input: {username: "admin", password: "wrong"}) { token } }
                        """)
                .execute()
                .errors()
                .satisfy(errors -> assertThat(errors)
                        .anyMatch(e -> e.getMessage().toLowerCase().contains("invalid")));
    }

    // ---- Authorization on writes ----

    @Test
    void addBook_without_token_is_forbidden() {
        anon().document("""
                        mutation { addBook(input: {isbn: "no-auth", title: "X", authorId: 1}) { book { isbn } } }
                        """)
                .execute()
                .errors()
                .satisfy(errors -> assertThat(errors)
                        .anyMatch(e -> e.getMessage().toLowerCase().contains("admin")));
    }

    @Test
    void addBook_then_deleteBook_with_admin_token_succeeds() {
        HttpGraphQlTester admin = admin();
        admin.document("""
                        mutation { addBook(input: {isbn: "ci-test-1", title: "CI Test", authorId: 1}) { book { isbn title } } }
                        """)
                .execute()
                .path("addBook.book.isbn").entity(String.class).isEqualTo("ci-test-1");

        admin.document("""
                        mutation { deleteBook(input: {isbn: "ci-test-1"}) { isbn } }
                        """)
                .execute()
                .path("deleteBook.isbn").entity(String.class).isEqualTo("ci-test-1");
    }

    @Test
    void searchBooksByTitleSubstring_works() {
        anon().document("""
                        { booksByTitleSubstring(substring: "the") { isbn title } }
                        """)
                .execute()
                .path("booksByTitleSubstring").entityList(Object.class).satisfies(list ->
                        assertThat(list).isNotNull());
    }
}
