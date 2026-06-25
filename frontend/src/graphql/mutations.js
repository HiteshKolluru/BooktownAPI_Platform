import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($input: LoginInput) {
    login(input: $input) {
      token
      username
      expiresInMs
    }
  }
`

export const ADD_BOOK = gql`
  mutation AddBook($input: AddBookInput) {
    addBook(input: $input) {
      book {
        isbn
        title
        authorId
      }
    }
  }
`

export const DELETE_BOOK = gql`
  mutation DeleteBook($input: DeleteBookInput) {
    deleteBook(input: $input) {
      isbn
    }
  }
`

export const ADD_AUTHOR = gql`
  mutation AddAuthor($input: AddAuthorInput) {
    addAuthor(input: $input) {
      author {
        id
        firstName
        lastName
      }
    }
  }
`

export const UPDATE_AUTHOR_LASTNAME = gql`
  mutation UpdateAuthorLastName($input: UpdateAuthorLastNameInput) {
    updateAuthorLastName(input: $input) {
      oldLastName
    }
  }
`
