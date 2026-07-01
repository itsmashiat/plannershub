import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ResourceCard } from '../components/ResourceCard';
import { SEMESTERS } from '../data/curriculum';
import { Search } from 'lucide-react';

export const YtResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'youtube');
        if (!error && data) {
          setResources(data);
        }
      } catch (err) {
        console.error('Error fetching youtube resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.course_code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSemester =
      semesterFilter === 'all' || String(res.semester) === semesterFilter;

    return matchesSearch && matchesSemester;
  });

  return (
    <div>
      <section className="page-hero compact">
        <p className="eyebrow">YouTube Resources</p>
        <h1>Video recommendations mapped to URP courses.</h1>
        <p className="muted">
          Access curated video playlists, software guides, and tutorials mapped directly to course codes.
        </p>
      </section>

      {/* Filter toolbar */}
      <section 
        className="glass-panel" 
        style={{
          padding: '16px 20px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '32px'
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Filter by title or course code..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', minHeight: '42px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        </div>
        
        <select
          className="form-select"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          style={{ width: 'auto', minWidth: '220px', minHeight: '42px' }}
        >
          <option value="all">All Semesters</option>
          {SEMESTERS.map((sem) => (
            <option key={sem.id} value={sem.id}>
              {sem.label}
            </option>
          ))}
        </select>
      </section>

      {/* Resource grid list */}
      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '30vh' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(0, 229, 255, 0.1)',
            borderTopColor: 'var(--accent)',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="resource-grid">
          {filteredResources.map((video) => (
            <ResourceCard key={video.id} item={video} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <h3>No recommended videos found matching filters</h3>
          <p style={{ marginTop: '8px', fontSize: '0.88rem' }}>Check again later or contact an administrator to upload YouTube resources.</p>
        </div>
      )}
    </div>
  );
};
