import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { COURSES, SEMESTERS } from '../data/curriculum';
import { Search, BookOpen, FileText, HelpCircle, Video, Calculator, Calendar, ArrowRight, Lock } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dbResources, setDbResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch resources from Supabase for search index (public data can be searched, but locked for guest click)
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*');
        if (!error && data) {
          setDbResources(data);
        }
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Handle live search matching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.trim().toLowerCase();

    // 1. Search static courses
    const matchedCourses = COURSES.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query)
    ).map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: `${c.code} - ${c.credits} Credits`,
      type: 'course',
      path: '/cgpa',
    }));

    // 2. Search resources from DB
    const matchedResources = dbResources.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.course_code.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query)
    ).map((r) => {
      let path = '/books';
      if (r.category === 'note') path = '/notes';
      else if (r.category === 'question') path = '/questions';
      else if (r.category === 'youtube') path = '/ytresources';

      return {
        id: r.id,
        title: r.title,
        subtitle: `${r.course_code} - ${r.category.toUpperCase()}`,
        type: 'resource',
        category: r.category,
        path: path,
      };
    });

    setSearchResults([...matchedCourses, ...matchedResources].slice(0, 6));
  }, [searchQuery, dbResources]);

  const sumSemesterCredits = (semesterId) => {
    const semCourses = COURSES.filter((c) => c.semester === semesterId);
    return semCourses.reduce((sum, c) => sum + c.credits, 0);
  };

  const handleResultClick = (result) => {
    if (result.type === 'resource' && (!user || user.status !== 'approved')) {
      navigate(`/auth?redirect=${encodeURIComponent(result.path)}`);
    } else {
      navigate(result.path);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ textAlign: 'center', padding: '60px 0 40px' }}>
        <p className="eyebrow" style={{ animation: 'pulse 2s infinite' }}>Navigating Your Planning Degree</p>
        <h1 style={{ fontSize: '3rem', maxWidth: '900px', margin: '0 auto 20px', lineHeight: '1.15' }}>
          Your compass for navigating courses, resources, and academic success.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
          Find textbooks, sessional notes, previous exam questions, curated YouTube tracks, and semester-aware CGPA calculators in a clean portal built for planners.
        </p>

        {/* Dynamic Search Box */}
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 30px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by course code, title, or category..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '48px',
                paddingRight: '20px',
                fontSize: '1.05rem',
                height: '52px',
                borderRadius: '12px',
                borderColor: searchQuery ? 'var(--accent)' : 'var(--border)'
              }}
            />
            <Search
              size={20}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
            />
          </div>

          {/* Search Dropdown */}
          <div className={`search-results-container glass-panel ${searchResults.length > 0 ? 'visible' : ''}`} style={{ textAlign: 'left', background: 'var(--panel-strong)' }}>
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="search-result-item"
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
              >
                <strong>
                  {result.title}
                  {result.type === 'resource' && (!user || user.status !== 'approved') && (
                    <Lock size={12} style={{ color: 'var(--red)', marginLeft: '6px' }} />
                  )}
                </strong>
                <span>{result.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/books" className="btn primary">
            Browse Library
          </Link>
          <Link to="/cgpa" className="btn secondary">
            Calculate CGPA
          </Link>
        </div>
      </section>

      {/* Program Statistics Band */}
      <section 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          padding: '24px',
          margin: '40px 0',
          textAlign: 'center',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}
      >
        <div>
          <strong style={{ display: 'block', fontSize: '2rem', color: 'var(--accent)' }}>8</strong>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: '600', uppercase: 'true' }}>Semesters</span>
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '2rem', color: 'var(--accent)' }}>161.5</strong>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: '600', uppercase: 'true' }}>Total Credits</span>
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '2rem', color: 'var(--accent)' }}>PUST</strong>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: '600', uppercase: 'true' }}>Official Curriculum</span>
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '2rem', color: 'var(--accent)' }}>URP</strong>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: '600', uppercase: 'true' }}>Books + Notes + Tools</span>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ margin: '60px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="eyebrow">Student Friendly Features</p>
          <h2 style={{ fontSize: '2rem' }}>Everything connected to your courses.</h2>
        </div>
        
        <div className="resource-grid">
          <Link to="/books" className="glass-panel resource-card">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}><BookOpen size={28} /></div>
            <h3>Stored Books</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Organized textbooks and reference PDFs mapped directly to course codes.
            </p>
          </Link>
          <Link to="/notes" className="glass-panel resource-card">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}><FileText size={28} /></div>
            <h3>Class Notes</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Lecture notes, sessional checklists, and quick revision material.
            </p>
          </Link>
          <Link to="/questions" className="glass-panel resource-card">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}><HelpCircle size={28} /></div>
            <h3>Previous Questions</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Semester archives and exam practice guides grouped by year and course.
            </p>
          </Link>
          <Link to="/ytresources" className="glass-panel resource-card">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}><Video size={28} /></div>
            <h3>YouTube Resources</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Curated sessional video tutorials and lectures for tricky courses like GIS.
            </p>
          </Link>
          <Link to="/cgpa" className="glass-panel resource-card">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}><Calculator size={28} /></div>
            <h3>Smart CGPA</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Preloads URP courses with exact credits and computes PUST ordinance grades.
            </p>
          </Link>
          <Link to="/tools" className="glass-panel resource-card">
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}><Calendar size={28} /></div>
            <h3>Planner Tools</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Attendance eligibility calculators, deadlines, and field kit survey checklists.
            </p>
          </Link>
        </div>
      </section>

      {/* Curriculum Preview Section */}
      <section className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', padding: '40px', margin: '60px 0' }}>
        <div>
          <p className="eyebrow">Curriculum Intelligence</p>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#fff' }}>Built around the BURP path.</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '24px' }}>
            The landing page matches the syllabus database used in the CGPA calculator and resource categories. Every single PDF and video reference maps back to a specific class code.
          </p>
          <Link to="/tools" className="btn secondary" style={{ gap: '8px' }}>
            See Student Tools <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SEMESTERS.slice(0, 4).map((sem) => (
            <div 
              key={sem.id} 
              className="glass-panel" 
              style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.01)',
                borderColor: 'rgba(0, 229, 255, 0.05)'
              }}
            >
              <strong style={{ fontSize: '0.95rem' }}>{sem.label}</strong>
              <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '700' }}>
                {sumSemesterCredits(sem.id)} Credits
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section 
          className="glass-panel" 
          style={{
            textAlign: 'center',
            padding: '50px 30px',
            margin: '60px 0 20px',
            background: 'linear-gradient(135deg, rgba(12, 15, 30, 0.95), rgba(124, 58, 237, 0.05))',
            borderTop: '2px solid var(--accent)'
          }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Join the PlannersHub Directory</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 30px', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Submit a registration request with your student details. Once an administrator approves your status, you'll unlock the download keys for textbooks, archives, and files.
          </p>
          <Link to="/auth" className="btn primary">
            Request Portal Access
          </Link>
        </section>
      )}
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; text-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
