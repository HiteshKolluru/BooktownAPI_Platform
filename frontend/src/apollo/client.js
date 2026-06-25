import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// In dev, vite proxies `/graphql` to the Spring Boot backend on :8080
// (see vite.config.js). In a future deployment, override this with
// VITE_GRAPHQL_URI at build time.
const uri = import.meta.env.VITE_GRAPHQL_URI || '/graphql'

export const client = new ApolloClient({
  link: new HttpLink({ uri }),
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
