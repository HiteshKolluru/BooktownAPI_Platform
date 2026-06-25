import './About.css'

const STACK = [
  { group: 'Frontend', items: ['React', 'Vite', 'Apollo Client', 'Framer Motion', 'Vanilla CSS'] },
  { group: 'Backend', items: ['Spring Boot 3', 'Spring for GraphQL', 'Spring Data JPA', 'Java 17'] },
  { group: 'Data', items: ['H2 (in-memory)', 'GraphQL schema'] },
]

const PHASES = [
  { n: 1, name: 'Frontend', note: 'React storefront over the GraphQL API', active: true },
  { n: 2, name: 'AWS Cloud', note: 'EC2 + RDS Postgres + S3/CloudFront' },
  { n: 3, name: 'Security', note: 'Spring Security, JWT, query depth limits' },
  { n: 4, name: 'Cybersecurity', note: 'OWASP ZAP, AWS WAF, CloudWatch' },
  { n: 5, name: 'CI/CD + Testing', note: 'GitHub Actions, JUnit, JaCoCo' },
]

export default function About() {
  return (
    <div className="page">
      <div className="container about">
        <div className="eyebrow">The Story</div>
        <h1>About Booktown</h1>
        <p className="lede">
          Booktown started life as an ASU SER421 GraphQL lab and is growing into a
          full-stack, cloud-deployed, security-hardened portfolio platform. This storefront
          is <strong>Phase 1</strong>.
        </p>

        <div className="ornament" />

        <section className="section">
          <h2>Architecture</h2>
          <div className="arch card">
            <div className="arch-node">React + Apollo<span>this app</span></div>
            <div className="arch-arrow">→ GraphQL →</div>
            <div className="arch-node">Spring Boot<span>/graphql</span></div>
            <div className="arch-arrow">→ JPA →</div>
            <div className="arch-node">H2 Database<span>in-memory</span></div>
          </div>
        </section>

        <section className="section">
          <h2>Tech stack</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {STACK.map((s) => (
              <div key={s.group} className="card" style={{ padding: '1.1rem 1.25rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>{s.group}</h3>
                <div className="wrap">
                  {s.items.map((i) => <span key={i} className="badge badge-muted">{i}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>The roadmap</h2>
          <ol className="roadmap">
            {PHASES.map((p) => (
              <li key={p.n} className={p.active ? 'active' : ''}>
                <span className="phase-num">{p.n}</span>
                <div>
                  <strong>{p.name}</strong>{p.active && <span className="badge" style={{ marginLeft: '0.5rem' }}>current</span>}
                  <div className="muted" style={{ fontSize: '0.9rem' }}>{p.note}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
