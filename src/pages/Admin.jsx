import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { COURSES, SEMESTERS } from '../data/curriculum';
import { Users, FileText, UserPlus, UserCheck, ShieldAlert, Check, X, Trash2, Search, Plus } from 'lucide-react';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('requests');
  
  // Database States
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [counts, setCounts] = useState({ totalUsers: 0, approved: 0, pending: 0, resources: 0 });

  // Form States for Adding Resource
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('book');
  const [resCourseCode, setResCourseCode] = useState('URP 1101');
  const [resSemester, setResSemester] = useState(1);
  const [resUrl, setResUrl] = useState('');
  const [resFormat, setResFormat] = useState('PDF');
  const [resLevel, setResLevel] = useState('Core');
  const [resThumbnailUrl, setResThumbnailUrl] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [resSearchQuery, setResSearchQuery] = useState('');

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  // Fetch all administrative data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      const pending = userData.filter(u => u.status === 'pending');
      const approved = userData.filter(u => u.status === 'approved' && u.role !== 'admin');
      
      setPendingUsers(pending);
      setApprovedUsers(approved);

      // 2. Fetch Resources
      const { data: resData, error: resError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (resError) throw resError;
      
      setResources(resData);

      // 3. Compute Counts
      setCounts({
        totalUsers: userData.length,
        approved: userData.filter(u => u.status === 'approved').length,
        pending: pending.length,
        resources: resData.length
      });

    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      showAlert(err.message || 'Failed to load panel details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Update course options when semester changes in form
  useEffect(() => {
    const semCourses = COURSES.filter(c => c.semester === parseInt(resSemester));
    if (semCourses.length > 0) {
      setResCourseCode(semCourses[0].code);
    } else {
      setResCourseCode('Mixed');
    }
  }, [resSemester]);

  // Handle Approve User
  const handleApproveUser = async (userId, name) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'approved' })
        .eq('id', userId);
      
      if (error) throw error;
      
      showAlert(`Student account approved for ${name}.`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
      showAlert(`Approval failed: ${err.message}`, 'error');
    }
  };

  // Handle Reject User
  const handleRejectUser = async (userId, name) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'rejected' })
        .eq('id', userId);
      
      if (error) throw error;
      
      showAlert(`Student account rejected/revoked for ${name}.`, 'error');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      showAlert(`Rejection failed: ${err.message}`, 'error');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete profile for ${name}?`)) return;
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      showAlert(`Student profile record deleted for ${name}.`, 'error');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      showAlert(`Deletion failed: ${err.message}`, 'error');
    }
  };

  // Handle Upload Resource Card
  const handleAddResource = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!resTitle.trim() || !resUrl.trim()) {
      showAlert('Resource Title and Resource Link are required.', 'error');
      setLoading(false);
      return;
    }

    try {
      const newResource = {
        title: resTitle.trim(),
        course_code: resCourseCode,
        semester: parseInt(resSemester),
        category: resCategory,
        resource_url: resUrl.trim(),
        thumbnail_url: resCategory === 'youtube' ? (resThumbnailUrl.trim() || `https://img.youtube.com/vi/${getYouTubeVideoId(resUrl)}/0.jpg`) : null
      };

      const { error } = await supabase
        .from('resources')
        .insert([newResource]);

      if (error) throw error;

      showAlert(`Resource "${resTitle}" added successfully!`);
      // Reset form
      setResTitle('');
      setResUrl('');
      setResThumbnailUrl('');
      setResFormat('PDF');
      setResLevel('Core');
      
      fetchAdminData();
    } catch (err) {
      console.error(err);
      showAlert(`Failed to upload resource: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Resource
  const handleDeleteResource = async (resId, title) => {
    if (!window.confirm(`Are you sure you want to remove resource card references for "${title}"?`)) return;
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resId);
      
      if (error) throw error;
      
      showAlert(`Removed resource: "${title}"`, 'error');
      fetchAdminData();
    } catch (err) {
      console.error(err);
      showAlert(`Failed to delete resource: ${err.message}`, 'error');
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return '';
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    return '';
  };

  // Filter resources list in tab 3
  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(resSearchQuery.toLowerCase()) ||
    res.course_code.toLowerCase().includes(resSearchQuery.toLowerCase()) ||
    res.category.toLowerCase().includes(resSearchQuery.toLowerCase())
  );

  return (
    <div>
      <section className="page-hero compact">
        <p className="eyebrow">Control Center</p>
        <h1>Admin Dashboard</h1>
        <p className="muted">Authorize student portal registrations and manage core syllabus links in real-time.</p>
      </section>

      {/* Stats Counter Banner */}
      <section 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: 'var(--accent)', background: 'rgba(0, 229, 255, 0.08)', width: '48px', height: '48px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
            <Users size={24} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600' }}>TOTAL USERS</div>
            <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{counts.totalUsers}</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: 'var(--green)', background: 'var(--green-bg)', width: '48px', height: '48px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
            <UserCheck size={24} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600' }}>APPROVED STUDENTS</div>
            <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{counts.approved}</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: 'var(--red)', background: 'var(--red-bg)', width: '48px', height: '48px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
            <UserPlus size={24} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600' }}>PENDING REQUESTS</div>
            <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{counts.pending}</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: 'var(--accent-secondary)', background: 'rgba(124, 58, 237, 0.08)', width: '48px', height: '48px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>
            <FileText size={24} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600' }}>TOTAL RESOURCES</div>
            <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{counts.resources}</strong>
          </div>
        </div>
      </section>

      {/* Feedback Alert */}
      {alert.show && (
        <div className={`alert-banner ${alert.type}`} style={{ marginBottom: '24px' }}>
          {alert.message}
        </div>
      )}

      {/* Main Admin Console Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', alignItems: 'start' }} className="tools-layout">
        
        {/* Navigation Sidebar */}
        <nav className="glass-panel tools-sidebar" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('requests')}
            className={`btn ${activeTab === 'requests' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            Pending Requests ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`btn ${activeTab === 'add' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            Add New Resource
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`btn ${activeTab === 'manage' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            Manage Resources ({counts.resources})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`btn ${activeTab === 'users' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            Approved Directory ({approvedUsers.length})
          </button>
        </nav>

        {/* Content Card Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          
          {/* TAB 1: PENDING REQUESTS */}
          {activeTab === 'requests' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px', textAlign: 'left' }}>Pending Student Requests</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'left' }}>
                Approve new student accounts to grant resource library access keys.
              </p>

              {pendingUsers.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--accent)' }}>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Name</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Roll Number</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Email</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map(req => (
                        <tr key={req.id} style={{ borderBottom: '1px solid var(--line)' }}>
                          <td style={{ padding: '14px 8px', fontWeight: '700', color: '#fff' }}>{req.full_name}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--muted)' }}>{req.roll}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--muted)' }}>{req.email}</td>
                          <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => handleApproveUser(req.id, req.full_name)}
                                className="btn primary"
                                style={{ padding: '6px 12px', minHeight: '32px', fontSize: '0.75rem' }}
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button
                                onClick={() => handleRejectUser(req.id, req.full_name)}
                                className="btn danger"
                                style={{ padding: '6px 12px', minHeight: '32px', fontSize: '0.75rem' }}
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '30px 0', color: 'var(--muted)', textAlign: 'center' }}>No pending student registration requests found.</div>
              )}
            </div>
          )}

          {/* TAB 2: ADD NEW RESOURCE */}
          {activeTab === 'add' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px', textAlign: 'left' }}>Add Course Resource Card</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'left' }}>
                Submit books, class lecture slides, previous questions, or YouTube video playlists.
              </p>

              <form onSubmit={handleAddResource} style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="res-title">Resource Title</label>
                    <input
                      type="text"
                      id="res-title"
                      className="form-input"
                      placeholder="e.g. QGIS Full Course for Beginners"
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="res-cat">Resource Category</label>
                    <select
                      id="res-cat"
                      className="form-select"
                      value={resCategory}
                      onChange={(e) => setResCategory(e.target.value)}
                    >
                      <option value="book">Book Library</option>
                      <option value="note">Class Notes / Slide</option>
                      <option value="question">Previous Question</option>
                      <option value="youtube">YouTube Recommendation</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="res-sem">Syllabus Semester</label>
                    <select
                      id="res-sem"
                      className="form-select"
                      value={resSemester}
                      onChange={(e) => setResSemester(e.target.value)}
                    >
                      {SEMESTERS.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="res-course">Course Mapped Code</label>
                    <select
                      id="res-course"
                      className="form-select"
                      value={resCourseCode}
                      onChange={(e) => setResCourseCode(e.target.value)}
                    >
                      {COURSES.filter(c => c.semester === parseInt(resSemester)).map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                      ))}
                      <option value="Mixed">Mixed Course (General)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="res-format">File Format</label>
                    <input
                      type="text"
                      id="res-format"
                      className="form-input"
                      placeholder="e.g. PDF, DOCX, YouTube"
                      value={resFormat}
                      onChange={(e) => setResFormat(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="res-level">Level/Tag</label>
                    <select
                      id="res-level"
                      className="form-select"
                      value={resLevel}
                      onChange={(e) => setResLevel(e.target.value)}
                    >
                      <option value="Core">Core</option>
                      <option value="Recommended">Recommended</option>
                      <option value="Exam Focus">Exam Focus</option>
                      <option value="Fieldwork">Fieldwork</option>
                      <option value="Practice">Practice</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="res-url">Google Drive / YouTube Watch Link</label>
                  <input
                    type="url"
                    id="res-url"
                    className="form-input"
                    placeholder="https://drive.google.com/file/d/... or https://youtube.com/watch?v=..."
                    value={resUrl}
                    onChange={(e) => setResUrl(e.target.value)}
                  />
                </div>

                {resCategory === 'youtube' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="res-thumb">Custom Thumbnail Link (Optional)</label>
                    <input
                      type="url"
                      id="res-thumb"
                      className="form-input"
                      placeholder="e.g. https://img.youtube.com/vi/.../0.jpg"
                      value={resThumbnailUrl}
                      onChange={(e) => setResThumbnailUrl(e.target.value)}
                    />
                  </div>
                )}

                <button type="submit" className="btn primary" style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }} disabled={loading}>
                  <Plus size={16} /> Upload Resource Card
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MANAGE RESOURCES */}
          {activeTab === 'manage' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px', textAlign: 'left' }}>Manage Current Resources</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'left' }}>
                Review, filter, and delete card links uploaded to student libraries.
              </p>

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Filter resources by title, type, course or tag..."
                  className="form-input"
                  value={resSearchQuery}
                  onChange={(e) => setResSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px', minHeight: '40px' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              </div>

              {filteredResources.length > 0 ? (
                <div style={{ overflowX: 'auto', maxHeight: '450px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--accent)' }}>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Category</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Title</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Course</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Semester</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResources.map((res) => (
                        <tr key={res.id} style={{ borderBottom: '1px solid var(--line)' }}>
                          <td style={{ padding: '12px 8px' }}><span className="chip" style={{ fontSize: '0.65rem' }}>{res.category}</span></td>
                          <td style={{ padding: '12px 8px', fontWeight: '700', color: '#fff', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{res.title}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--muted)', fontSize: '0.85rem' }}>{res.course_code}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--muted)', fontSize: '0.85rem' }}>Sem {res.semester}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteResource(res.id, res.title)}
                              className="btn danger"
                              style={{ padding: '4px 8px', minHeight: 'auto', fontSize: '0.72rem' }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '30px 0', color: 'var(--muted)', textAlign: 'center' }}>No resources found matching search query.</div>
              )}
            </div>
          )}

          {/* TAB 4: APPROVED DIRECTORY */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px', textAlign: 'left' }}>Approved Students Directory</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'left' }}>
                Students in this directory have active permission to view books, notes, questions, and watch course recommendations.
              </p>

              {approvedUsers.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--accent)' }}>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Name</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Roll</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800' }}>Email</th>
                        <th style={{ padding: '12px 8px', fontWeight: '800', textAlign: 'right' }}>Revoke</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedUsers.map(student => (
                        <tr key={student.id} style={{ borderBottom: '1px solid var(--line)' }}>
                          <td style={{ padding: '14px 8px', fontWeight: '700', color: '#fff' }}>{student.full_name}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--muted)' }}>{student.roll}</td>
                          <td style={{ padding: '14px 8px', color: 'var(--muted)' }}>{student.email}</td>
                          <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => handleRejectUser(student.id, student.full_name)}
                                className="btn danger"
                                style={{ padding: '6px 12px', minHeight: '32px', fontSize: '0.75rem' }}
                              >
                                Revoke Access
                              </button>
                              <button
                                onClick={() => handleDeleteUser(student.id, student.full_name)}
                                className="btn ghost"
                                style={{ padding: '6px 12px', minHeight: '32px', fontSize: '0.75rem', color: 'var(--red)', border: 'none' }}
                                aria-label="Delete profile"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '30px 0', color: 'var(--muted)', textAlign: 'center' }}>No approved students registered yet.</div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tools-layout {
            grid-template-columns: 1fr !important;
          }
          .tools-sidebar {
            flex-direction: row !important;
            overflow-x: auto;
            white-space: nowrap;
          }
          .tools-sidebar button {
            flex: 0 0 auto;
          }
        }
      `}</style>
    </div>
  );
};
