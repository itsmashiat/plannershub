import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { BookOpen, FileText, HelpCircle, Video, Calculator, Calendar, ArrowRight, UserCheck } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        if (!error && data) {
          setRecentResources(data);
        }
      } catch (err) {
        console.error('Failed to load recent resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const getFirstName = (fullName) => {
    if (!fullName) return 'Student';
    return fullName.trim().split(' ')[0];
  };

  const quickLinks = [
    { title: 'Books Library', description: 'Browse and download core textbooks.', path: '/books', icon: <BookOpen size={20} /> },
    { title: 'Lecture Notes', description: 'Access revision guides and lab slides.', path: '/notes', icon: <FileText size={20} /> },
    { title: 'Exam Questions', description: 'View previous year question archives.', path: '/questions', icon: <HelpCircle size={20} /> },
    { title: 'YouTube Tutorials', description: 'Watch recommended study videos.', path: '/ytresources', icon: <Video size={20} /> },
    { title: 'Smart CGPA', description: 'Preloaded semester course calculators.', path: '/cgpa', icon: <Calculator size={20} /> },
    { title: 'Planner Tools', description: 'Calculate attendance eligibility & checklists.', path: '/tools', icon: <Calendar size={20} /> },
  ];

  return (
    <div>
      {/* Welcome & Profile Summary Section */}
      <section className="glass-panel" style={{ padding: '32px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', background: 'linear-gradient(135deg, var(--panel), rgba(0, 229, 255, 0.03))' }}>
        <div>
          <p className="eyebrow">Academic Hub</p>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}>Welcome back, {getFirstName(user?.full_name)}!</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            Your student account is fully approved. You have full access to curriculum resources and libraries.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 20px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--green-bg)', color: 'var(--green)', display: 'grid', placeItems: 'center' }}>
            <UserCheck size={20} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--green)' }}>Approved Student</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>Roll: {user?.roll}</div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '20px' }}>Quick Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {quickLinks.map((link) => (
            <Link key={link.title} to={link.path} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease' }}>
              <div style={{ color: 'var(--accent)', marginBottom: '12px', display: 'inline-flex', width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 229, 255, 0.08)', alignItems: 'center', justifyContent: 'center' }}>
                {link.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px', color: '#fff' }}>{link.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.4', marginBottom: '14px' }}>{link.description}</p>
              <span style={{ marginTop: 'auto', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Portal <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Resources */}
      <section>
        <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '20px' }}>Recently Uploaded</h2>
        {loading ? (
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Scanning recent materials...</div>
        ) : recentResources.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {recentResources.map((res) => {
              let path = '/books';
              if (res.category === 'note') path = '/notes';
              else if (res.category === 'question') path = '/questions';
              else if (res.category === 'youtube') path = '/ytresources';

              return (
                <div key={res.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="course-badge" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent)' }}>{res.course_code}</span>
                    <span className="chip" style={{ fontSize: '0.65rem' }}>{res.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#fff' }}>{res.title}</h3>
                  <Link to={path} className="btn secondary" style={{ marginTop: 'auto', padding: '8px 12px', fontSize: '0.78rem', justifyContent: 'center' }}>
                    View in {res.category.toUpperCase()}
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
            No resources uploaded yet. Ask the admin to add resource cards.
          </div>
        )}
      </section>
    </div>
  );
};
