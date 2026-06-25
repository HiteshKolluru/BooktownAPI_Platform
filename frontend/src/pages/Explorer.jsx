import { useState } from 'react'
import { GRAPHQL_URI } from '../apollo/client'
import './Explorer.css'

const EXAMPLES = [
  {
    name: 'All books',
    query: `query {
  books {
    isbn
    title
    authorId
  }
}`,
  },
  {
    name: 'Authors with their books',
    query: `query {
  authors {
    id
    firstName
    lastName
    books { title }
  }
}`,
  },
  {
    name: 'Search titles ("the")',
    query: `query {
  booksByTitleSubstring(substring: "the") {
    isbn
    title
  }
}`,
  },
  {
    name: 'Author by id',
    query: `query {
  authorById(id: 1) {
    firstName
    lastName
    books { title }
  }
}`,
  },
  {
    name: 'Add a book (mutation)',
    query: `mutation {
  addBook(input: {
    isbn: "999-0001"
    title: "A New Tale"
    authorId: 1
  }) {
    book { isbn title authorId }
  }
}`,
  },
]

export default function Explorer() {
  const [query, setQuery] = useState(EXAMPLES[0].query)
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  async function run() {
    setRunning(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(GRAPHQL_URI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const json = await res.json()
      setResult(json)
    } catch (err) {
      setError(err.message || 'Request failed. Is the backend running on :8080?')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="eyebrow">For the Curious</div>
        <h1 className="mb-0">API Explorer</h1>
        <p className="lede mt-1">
          Run live GraphQL queries against the backend. Pick an example or write your own,
          then read the raw JSON the API returns.
        </p>
        <div className="ornament" />

        <div className="wrap" style={{ marginBottom: '1rem' }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              className="btn btn-ghost btn-sm"
              onClick={() => { setQuery(ex.query); setResult(null); setError('') }}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="explorer-grid">
          <div className="explorer-pane">
            <div className="pane-head">
              <span>Query</span>
              <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>
                {running ? 'Running…' : '▶ Run'}
              </button>
            </div>
            <textarea
              className="code-area"
              spellCheck={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="explorer-pane">
            <div className="pane-head"><span>Response</span></div>
            <pre className="code-area code-result">
              {error
                ? `// ${error}`
                : result
                  ? JSON.stringify(result, null, 2)
                  : '// Run a query to see the response.'}
            </pre>
          </div>
        </div>

        <p className="faint mt-2" style={{ fontSize: '0.85rem' }}>
          Prefer the official tool? The backend also serves{' '}
          <a href="/graphiql" target="_blank" rel="noreferrer">GraphiQL</a> at{' '}
          <span className="mono">/graphiql</span>.
        </p>
      </div>
    </div>
  )
}
