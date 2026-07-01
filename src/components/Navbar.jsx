import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getFirstName = (fullName) => {
    if (!fullName) return 'Student';
    return fullName.trim().split(' ')[0];
  };

  const navLinks = [
    { path: '/books', label: 'Books' },
    { path: '/notes', label: 'Notes' },
    { path: '/questions', label: 'Questions' },
    { path: '/ytresources', label: 'YT Resources' },
    { path: '/cgpa', label: 'CGPA' },
    { path: '/tools', label: 'Tools' },
  ];

  return (
    <>
      <header className="navbar">
        <Link to="/" className="brand" onClick={() => setIsOpen(false)}>
          <span className="brand-mark">PH</span>
          <div className="brand-name">
            <strong>PlannersHub</strong>
            <small>PUST URP</small>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `btn secondary ${isActive ? 'active' : ''}`}
                  style={{ padding: '6px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldAlert size={14} /> Admin
                </NavLink>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', borderLeft: '1px solid var(--line)', paddingLeft: '12px' }}>
                <Link to="/dashboard" style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.88rem' }}>
                  Hi, {getFirstName(user.full_name)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn ghost"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', minHeight: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="btn primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem', minHeight: 'auto', marginLeft: '10px' }}
            >
              Login / Register
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle button */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{ display: 'grid' }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`scrim ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
      <aside className={`mobile-menu-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="brand" onClick={() => setIsOpen(false)}>
            <span className="brand-mark">PH</span>
            <div className="brand-name">
              <strong>PlannersHub</strong>
            </div>
          </Link>
          <button className="menu-toggle" onClick={() => setIsOpen(false)} style={{ display: 'grid' }}>
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `btn secondary ${isActive ? 'active' : ''}`}
                  style={{ margin: '8px 0', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldAlert size={16} /> Admin Control Panel
                </NavLink>
              )}
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '1rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <LayoutDashboard size={18} /> Student: {user.full_name}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="btn ghost"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--red)' }}
                >
                  <LogOut size={16} /> Logout Student
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="btn primary"
              style={{ marginTop: '20px', textAlign: 'center' }}
            >
              Login / Register
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};
