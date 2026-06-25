import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During development the frontend proxies GraphQL requests to the Spring Boot
// backend (Activity 2 — JPA/H2) running on localhost:8080. This avoids CORS
// issues and lets the app call a same-origin `/graphql` endpoint.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/graphql': 'http://localhost:8080',
      '/graphiql': 'http://localhost:8080',
      '/h2-console': 'http://localhost:8080',
    },
  },
})
