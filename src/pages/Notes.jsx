import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ResourceCard } from '../components/ResourceCard';
import { SEMESTERS } from '../data/curriculum';
import { Search } from 'lucide-react';

export const Notes = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('category', 'note');
        if (!error && data) {
          setResources(data);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
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
        <p className="eyebrow">Lecture Vault</p>
        <h1>Notes, studio sheets, and sessional packs.</h1>
        <p className="muted">
          Fast filtering helps you move from course code to study material without digging through generic folders.
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
            placeholder="Search notes by course or topic..."
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
          {filteredResources.map((note) => (
            <ResourceCard key={note.id} item={note} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
          <h3>No class notes found matching filters</h3>
          <p style={{ marginTop: '8px', fontSize: '0.88rem' }}>Check again later or contact an administrator to upload lecture notes.</p>
        </div>
      )}
    </div>
  );
};
