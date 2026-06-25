package com.example.graphqlserver.controller;

import com.example.graphqlserver.dto.input.AddAuthorInput;
import com.example.graphqlserver.dto.input.UpdateAuthorLastNameInput;
import com.example.graphqlserver.dto.output.AddAuthorPayload;
import com.example.graphqlserver.dto.output.UpdateAuthorLastNamePayload;
import com.example.graphqlserver.model.Author;
import com.example.graphqlserver.model.Book;
import com.example.graphqlserver.repository.AuthorRepository;
import com.example.graphqlserver.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class AuthorController {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    @Autowired
    public AuthorController(AuthorRepository authorRepository, BookRepository bookRepository) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
    }

    @QueryMapping
    public List<Author> authors() {
        return authorRepository.findAll();
    }

    @QueryMapping
    public Author authorById(@Argument("id") int id) {
        return authorRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Author> authorsByLastName(@Argument("lastName") String lastName) {
        // checking for null or empty lastName
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("Last name cannot be null or empty");
        }
        return authorRepository.findByLastNameIgnoreCase(lastName);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AddAuthorPayload addAuthor(@Argument AddAuthorInput input) {
        Author newAuthor = new Author();
        newAuthor.setFirstName(input.firstName());
        newAuthor.setLastName(input.lastName());
        
        Author savedAuthor = authorRepository.save(newAuthor);
        return new AddAuthorPayload(savedAuthor);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UpdateAuthorLastNamePayload updateAuthorLastName(@Argument UpdateAuthorLastNameInput input) {
        // Validation
        if (input.id() < 0) {
            throw new IllegalArgumentException("Author ID cannot be negative");
        }
        if (input.newLastName() == null || input.newLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("New last name cannot be null or empty");
        }
        
        Author author = authorRepository.findById(input.id()).orElse(null);
        if (author == null) {
            return new UpdateAuthorLastNamePayload(null);
        }
        
        String oldLastName = author.getLastName();
        author.setLastName(input.newLastName());
        authorRepository.save(author);
        
        return new UpdateAuthorLastNamePayload(oldLastName);
    }

    // Schema mapping to resolve books for an author
    @SchemaMapping(typeName = "Author", field = "books")
    public List<Book> books(Author author) {
        return bookRepository.findByAuthorId(author.getId());
    }
}
