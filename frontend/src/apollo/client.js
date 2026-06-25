import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getToken } from '../auth/token'

// In dev, vite proxies `/graphql` to the Spring Boot backend on :8080
// (see vite.config.js). In a future deployment, override this with
// VITE_GRAPHQL_URI at build time.
const uri = import.meta.env.VITE_GRAPHQL_URI || '/graphql'

const httpLink = new HttpLink({ uri })

// Attach the JWT (if present) as a Bearer token on every request.
const authLink = setContext((_, { headers }) => {
  const token = getToken()
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Book:   { keyFields: ['isbn'] },
      Author: { keyFields: ['id'] },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
})

export { uri as GRAPHQL_URI }
