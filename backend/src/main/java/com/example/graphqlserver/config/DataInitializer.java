package com.example.graphqlserver.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.graphqlserver.model.Author;
import com.example.graphqlserver.model.Book;
import com.example.graphqlserver.repository.AuthorRepository;
import com.example.graphqlserver.repository.BookRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(BookRepository bookRepository, AuthorRepository authorRepository) {
        return args -> {
            // Idempotent seed: with a persistent DB (RDS Postgres, ddl-auto=update)
            // the app restarts without wiping data, so only seed when empty.
            // For local H2 (create-drop) the table is always empty on startup anyway.
            if (authorRepository.count() > 0) {
                return;
            }

            // Authors
            List<Author> authors = Arrays.asList(
                new Author(0, "Robert", "Frost", null),
                new Author(0, "Martin", "Fowler", null),
                new Author(0, "Kevin", "Gary", null)
            );
            authorRepository.saveAll(authors);
            
            // to get their auto generated IDs
            List<Author> savedAuthors = authorRepository.findAll();
            
            // Books
            List<Book> books = Arrays.asList(
                new Book("123456789", "The Road Not Taken", savedAuthors.get(0).getId()),
                new Book("987654321", "To Kill a Mockingbird", savedAuthors.get(1).getId()),
                new Book("456789123", "The Great Gatsby", savedAuthors.get(2).getId())
            );
            bookRepository.saveAll(books);
            
            // add books to each of the authors.
            savedAuthors.get(0).setBooks(bookRepository.findByAuthorId(savedAuthors.get(0).getId()));
            savedAuthors.get(1).setBooks(bookRepository.findByAuthorId(savedAuthors.get(1).getId()));
            savedAuthors.get(2).setBooks(bookRepository.findByAuthorId(savedAuthors.get(2).getId()));
            authorRepository.saveAll(savedAuthors);
        };
    }
}
