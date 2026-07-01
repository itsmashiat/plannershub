import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff, Lock, User, Hash, Mail } from 'lucide-react';

export const Auth = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Tabs: 'login' | 'register' | 'forgot' | 'reset-password'
  const [activeTab, setActiveTab] = useState('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roll, setRoll] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [loading, setLoading] = useState(false);

  // Check if we are in password recovery redirection from Supabase
  useEffect(() => {
    // Supabase redirects recovery email links with a hash containing access_token or type=recovery
    const hash = window.location.hash;
    const isRecovery = hash && (hash.includes('access_token') || hash.includes('type=recovery'));
    
    if (isRecovery) {
      setActiveTab('reset-password');
      showAlert('Password reset link verified. Please enter your new password.', 'info');
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      navigate(redirect);
    }
  }, [user, navigate, searchParams]);

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', type: 'error' });

    try {
      const authData = await login(email, password);
      // Wait for AuthContext session listener to query user profile details.
      // Redirect is handled by the useEffect watching `user` state.
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', type: 'error' });

    // Client-side validations
    if (!fullName.trim() || !roll.trim()) {
      showAlert('Full Name and Class Roll Number are required.');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      showAlert('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await register(email, password, fullName, roll);
      showAlert('Registration request submitted! Please notify the administrator to approve your student status.', 'success');
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setRoll('');
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Registration failed. This email or roll might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', type: 'error' });

    try {
      const redirectUrl = `${window.location.origin}/auth`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      showAlert('Password reset link has been sent to your email address.', 'success');
      setEmail('');
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Failed to send reset link. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', type: 'error' });

    if (newPassword.length < 8) {
      showAlert('New password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      showAlert('Your password has been reset successfully. Redirecting to login...', 'success');
      setTimeout(() => {
        // Clear hash and switch tab
        window.location.hash = '';
        setActiveTab('login');
        setNewPassword('');
      }, 2500);
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh', padding: '20px 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '32px' }}>
        
        {/* Navigation Tabs */}
        {activeTab !== 'reset-password' && (
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--line)', marginBottom: '24px', paddingBottom: '8px' }}>
            <button
              onClick={() => {
                setActiveTab('login');
                setAlert({ show: false, message: '', type: 'error' });
              }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: activeTab === 'login' ? 'var(--accent)' : 'var(--muted)',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: activeTab === 'login' ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setAlert({ show: false, message: '', type: 'error' });
              }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: activeTab === 'register' ? 'var(--accent)' : 'var(--muted)',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: activeTab === 'register' ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              Register
            </button>
          </div>
        )}

        {/* Alerts */}
        {alert.show && (
          <div className={`alert-banner ${alert.type}`}>
            {alert.message}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Student Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="login-email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px', paddingRight: '45px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'grid',
                    placeItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn primary" style={{ width: '100%', height: '48px', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Login Account'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="reg-name"
                  required
                  placeholder="e.g. Mashiat Masud"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-roll">Class Roll Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="reg-roll"
                  required
                  placeholder="e.g. URP-2025-001"
                  className="form-input"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Hash size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="reg-email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-pass">Choose Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="reg-pass"
                  required
                  placeholder="Minimum 8 characters"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="reg-confirm"
                  required
                  placeholder="Confirm password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn primary" style={{ width: '100%', height: '48px', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Registration Request'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotSubmit}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>Reset Password</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Enter your registered email address and we'll send you a secure link to reset your account password.
            </p>

            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="forgot-email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn primary" style={{ width: '100%', height: '48px' }} disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="btn ghost"
              style={{ width: '100%', marginTop: '10px' }}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* SET NEW PASSWORD FORM (RECOVERY FLOW) */}
        {activeTab === 'reset-password' && (
          <form onSubmit={handleResetSubmit}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>Set New Password</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Your recovery link has been verified. Enter a secure new password for your PlannersHub profile.
            </p>

            <div className="form-group">
              <label htmlFor="new-pass">Proposed Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="new-pass"
                  required
                  placeholder="Minimum 8 characters"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn primary" style={{ width: '100%', height: '48px' }} disabled={loading}>
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
