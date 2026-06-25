import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Authors from './pages/Authors'
import Explorer from './pages/Explorer'
import About from './pages/About'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function Page({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"          element={<Page><Dashboard /></Page>} />
            <Route path="/books"     element={<Page><Books /></Page>} />
            <Route path="/authors"   element={<Page><Authors /></Page>} />
            <Route path="/explorer"  element={<Page><Explorer /></Page>} />
            <Route path="/about"     element={<Page><About /></Page>} />
            <Route path="*"          element={<Page><Dashboard /></Page>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
