package com.example.graphqlserver.repository;

import com.example.graphqlserver.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    
    List<Book> findByAuthorId(int authorId);
    
    // Find book by ISBN (same as findById, but more explicit)
    Optional<Book> findByIsbn(String isbn);
    
    // Find books by title containing substring (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String substring);

}
