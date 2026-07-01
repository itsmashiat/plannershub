import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { isSupabaseConfigured } from './supabaseClient';

// Import Pages
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Books } from './pages/Books';
import { Notes } from './pages/Notes';
import { Questions } from './pages/Questions';
import { YtResources } from './pages/YtResources';
import { Cgpa } from './pages/Cgpa';
import { Tools } from './pages/Tools';
import { Admin } from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {!isSupabaseConfigured && (
          <div 
            style={{ 
              background: 'var(--red-bg)', 
              color: 'var(--red)', 
              border: '1px solid rgba(244, 63, 94, 0.2)', 
              padding: '10px 16px', 
              fontSize: '0.85rem', 
              textAlign: 'center', 
              borderRadius: '8px', 
              marginTop: '16px',
              fontWeight: '600',
              lineHeight: '1.4'
            }}
          >
            ⚠️ Supabase credentials are missing. Rename <code>.env.example</code> to <code>.env</code> and fill in your keys, then restart the local Vite dev server.
          </div>
        )}
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cgpa" element={<Cgpa />} />
            <Route path="/tools" element={<Tools />} />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Books />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ytresources"
              element={
                <ProtectedRoute>
                  <YtResources />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Only Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
