import { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <header
        style={{
          padding: '1.5rem 1rem',
          borderBottom: '1px solid #222',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ margin: 0, fontWeight: 600 }}>Frethan Procurement Platform</h2>

          <nav style={{ marginTop: '0.7rem', display: 'flex', gap: '1.5rem' }}>
            <Link style={{ fontSize: '1rem', opacity: 0.7 }} to="/">Home</Link>
            <Link style={{ fontSize: '1rem', opacity: 0.7 }} to="/login">Login</Link>
            <Link style={{ fontSize: '1rem', opacity: 0.7 }} to="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main
        style={{
          padding: '2rem 1rem',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
