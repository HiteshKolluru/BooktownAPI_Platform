package com.example.graphqlserver.controller;

import com.example.graphqlserver.dto.input.AddBookInput;
import com.example.graphqlserver.dto.output.AddBookPayload;
import com.example.graphqlserver.model.Author;
import com.example.graphqlserver.model.Book;
import com.example.graphqlserver.repository.AuthorRepository;
import com.example.graphqlserver.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import com.example.graphqlserver.dto.input.DeleteBookInput;
import com.example.graphqlserver.dto.output.DeleteBookPayload;

import java.util.List;
import java.util.Optional;

@Controller
public class BookController {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    @Autowired
    public BookController(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @QueryMapping
    public List<Book> books() {
        return bookRepository.findAll();
    }

    @QueryMapping
    public Book bookByISBN(@Argument("isbn") String isbn) {
        return bookRepository.findByIsbn(isbn).orElse(null);
    }

    @QueryMapping
    public List<Book> booksByAuthorId(@Argument("authorId") int authorId){
        // checks if id is a negative integer
        if(authorId < 0){
            throw new IllegalArgumentException("Author ID must be a positive integer or zero");
        }
        return bookRepository.findByAuthorId(authorId);
    }

    @QueryMapping
    public List<Book> booksByTitleSubstring(@Argument("substring") String substring) {
        // checking for null or empty substring
        if (substring == null || substring.trim().isEmpty()) {
            throw new IllegalArgumentException("Substring cannot be null or empty");
        }
        return bookRepository.findByTitleContainingIgnoreCase(substring);
    }
    
    @QueryMapping
    public List<String> bookTitlesByAuthorFirstName(@Argument("firstName") String firstName) {
        // Validation
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new IllegalArgumentException("First name cannot be null or empty");
        }
        
        // Find authors by first name
        List<Author> authors = authorRepository.findByFirstNameIgnoreCase(firstName);
        
        // Get all books for these authors and extract titles
        return authors.stream()
            .flatMap(author -> bookRepository.findByAuthorId(author.getId()).stream())
            .map(Book::getTitle)
            .toList();
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AddBookPayload addBook(@Argument AddBookInput input) {
        Optional<Author> authorOpt = authorRepository.findById(input.authorId());
        if (authorOpt.isEmpty()) {
            throw new IllegalArgumentException("Author with ID " + input.authorId() + " does not exist");
        }
        
        Book newBook = new Book(input.isbn(), input.title(), input.authorId());
        Book savedBook = bookRepository.save(newBook);
        
        return new AddBookPayload(savedBook);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DeleteBookPayload deleteBook(@Argument DeleteBookInput input) {
        // Validation
        if (input.isbn() == null || input.isbn().trim().isEmpty()) {
            throw new IllegalArgumentException("ISBN cannot be null or empty");
        }
        
        Optional<Book> bookOpt = bookRepository.findByIsbn(input.isbn());
        if (bookOpt.isEmpty()) {
            return new DeleteBookPayload(null);
        }
        
        bookRepository.delete(bookOpt.get());
        return new DeleteBookPayload(input.isbn());
    }
}
