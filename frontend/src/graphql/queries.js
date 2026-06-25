import { gql } from '@apollo/client'

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      isbn
      title
      authorId
    }
  }
`

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      firstName
      lastName
      books {
        isbn
        title
      }
    }
  }
`

export const GET_BOOK_BY_ISBN = gql`
  query GetBookByISBN($isbn: String) {
    bookByISBN(isbn: $isbn) {
      isbn
      title
      authorId
    }
  }
`

export const GET_AUTHOR_BY_ID = gql`
  query GetAuthorById($id: ID) {
    authorById(id: $id) {
      id
      firstName
      lastName
      books {
        isbn
        title
      }
    }
  }
`

export const SEARCH_BOOKS_BY_TITLE = gql`
  query BooksByTitleSubstring($substring: String) {
    booksByTitleSubstring(substring: $substring) {
      isbn
      title
      authorId
    }
  }
`

export const GET_BOOKS_BY_AUTHOR = gql`
  query BooksByAuthorId($authorId: ID) {
    booksByAuthorId(authorId: $authorId) {
      isbn
      title
      authorId
    }
  }
`

export const SEARCH_AUTHORS_BY_LASTNAME = gql`
  query AuthorsByLastName($lastName: String) {
    authorsByLastName(lastName: $lastName) {
      id
      firstName
      lastName
      books {
        isbn
        title
      }
    }
  }
`

export const TITLES_BY_AUTHOR_FIRSTNAME = gql`
  query BookTitlesByAuthorFirstName($firstName: String) {
    bookTitlesByAuthorFirstName(firstName: $firstName)
  }
`
