import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid rgba(0, 229, 255, 0.1)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 1. Check if logged in at all
  if (!user) {
    return (
      <div className="lock-screen-container">
        <div className="lock-card glass-panel">
          <div className="lock-icon">
            <span style={{ fontSize: '2rem' }}>🔒</span>
          </div>
          <h2>Restricted Academic Portal</h2>
          <p>
            Access to syllabus libraries, lecture notes, question archives, and recommended 
            videos is locked for guest users. Please register or login with your student credentials.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace state={{ from: location }} />
          </div>
        </div>
      </div>
    );
  }

  // 2. Check Admin Only routes
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="lock-screen-container">
        <div className="lock-card glass-panel" style={{ borderTopColor: 'var(--red)' }}>
          <div className="lock-icon" style={{ background: 'var(--red-bg)', color: 'var(--red)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
            <span style={{ fontSize: '2rem' }}>🚫</span>
          </div>
          <h2>Unauthorized Access</h2>
          <p>You do not have administrative permissions to access this control dashboard panel.</p>
          <a href="/" className="btn secondary">Back to Home</a>
        </div>
      </div>
    );
  }

  // 3. Check student approval status
  if (user.role !== 'admin') {
    if (user.status === 'pending') {
      return (
        <div className="lock-screen-container">
          <div className="lock-card glass-panel" style={{ borderTopColor: 'var(--blue)' }}>
            <div className="lock-icon" style={{ background: 'var(--blue-bg)', color: 'var(--blue)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '2rem' }}>⏳</span>
            </div>
            <h2>Account Pending Approval</h2>
            <p>
              Hi {user.full_name}, your account registration (Roll: {user.roll}) was successfully submitted. 
              An administrator needs to approve your student status before you can access course documents.
            </p>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              We'll activate your access shortly.
            </div>
          </div>
        </div>
      );
    }

    if (user.status === 'rejected') {
      return (
        <div className="lock-screen-container">
          <div className="lock-card glass-panel" style={{ borderTopColor: 'var(--red)' }}>
            <div className="lock-icon" style={{ background: 'var(--red-bg)', color: 'var(--red)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
              <span style={{ fontSize: '2rem' }}>❌</span>
            </div>
            <h2>Account Access Revoked</h2>
            <p>
              Your registration request has been rejected or revoked by the administrators. 
              Please contact the department admin office if this is an error.
            </p>
          </div>
        </div>
      );
    }
  }

  // User is approved (or is admin). Proceed to render component.
  return children;
};
