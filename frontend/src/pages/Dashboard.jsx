import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_BOOKS, GET_AUTHORS } from '../graphql/queries'
import BookCard from '../components/BookCard'
import { Loading, ErrorState } from '../components/States'
import './Dashboard.css'

function Stat({ value, label }) {
  return (
    <motion.div className="stat card" whileHover={{ y: -3 }}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  )
}

export default function Dashboard() {
  const books = useQuery(GET_BOOKS)
  const authors = useQuery(GET_AUTHORS)

  const loading = books.loading || authors.loading
  const error = books.error || authors.error

  const bookList = books.data?.books || []
  const authorList = authors.data?.authors || []
  const authorName = (id) => {
    const a = authorList.find((x) => String(x.id) === String(id))
    return a ? `${a.firstName} ${a.lastName}` : null
  }
  const featured = bookList.slice(0, 8)

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <div>
            <div className="eyebrow">A GraphQL Bookstore</div>
            <h1>Welcome to <span className="hero-accent">Booktown</span>.</h1>
            <p className="lede">
              A handsome catalog of books and the authors who wrote them — served over a
              Spring Boot GraphQL API and browsed through this React storefront.
            </p>
            <div className="wrap mt-2">
              <Link to="/books" className="btn btn-primary">Browse the shelves</Link>
              <Link to="/explorer" className="btn btn-ghost">Try the API</Link>
            </div>
          </div>
        </section>

        {error && <ErrorState error={error} />}
        {!error && loading && <Loading />}

        {!error && !loading && (
          <>
            <section className="section">
              <div className="grid grid-stats">
                <Stat value={bookList.length} label="Books in the catalog" />
                <Stat value={authorList.length} label="Authors on record" />
                <Stat value={new Set(bookList.map((b) => b.authorId)).size} label="Authors with books" />
              </div>
            </section>

            <section className="section">
              <div className="row-between">
                <h2 className="mb-0">From the shelves</h2>
                <Link to="/books" className="muted">View all →</Link>
              </div>
              <div className="ornament" />
              <div className="grid grid-books">
                {featured.map((b, i) => (
                  <BookCard key={b.isbn} book={b} authorName={authorName(b.authorId)} index={i} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
