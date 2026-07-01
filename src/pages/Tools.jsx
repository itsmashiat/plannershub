import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Award, HelpCircle, ShieldAlert, Plus, Trash2 } from 'lucide-react';

export const Tools = () => {
  const [activeTool, setActiveTool] = useState('attendance');

  // Tool 1: Attendance Guard State
  const [classesHeld, setClassesHeld] = useState(30);
  const [classesAttended, setClassesAttended] = useState(22);
  const attendanceRate = classesHeld > 0 ? (classesAttended / classesHeld) * 100 : 0;
  const isEligible = attendanceRate >= 60;

  // Tool 2: Reading Tracker State
  const [readings, setReadings] = useState(() => {
    const saved = localStorage.getItem('plannershub_readings');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Kevin Lynch - Image of the City', course: 'URP 2103', status: 'Reading' },
      { id: '2', title: 'Peter Hall - Urban and Regional Planning', course: 'URP 1101', status: 'Revised' }
    ];
  });
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('URP 1101');
  const [newStatus, setNewStatus] = useState('Reading');

  useEffect(() => {
    localStorage.setItem('plannershub_readings', JSON.stringify(readings));
  }, [readings]);

  const addReading = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newRead = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      course: newCourse,
      status: newStatus
    };
    setReadings([...readings, newRead]);
    setNewTitle('');
  };

  const deleteReading = (id) => {
    setReadings(readings.filter(r => r.id !== id));
  };

  const toggleStatus = (id) => {
    setReadings(readings.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === 'Reading' ? 'Revised' : 'Reading' };
      }
      return r;
    }));
  };

  // Tool 3: Field Survey Checklist State
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Structured Questionnaires (printed & digital)', checked: false },
    { id: 'c2', label: 'Base Map of Pabna City / Survey Site', checked: true },
    { id: 'c3', label: 'Handheld GPS Device or GPS mobile app', checked: false },
    { id: 'c4', label: 'Consent Forms for resident interviews', checked: false },
    { id: 'c5', label: 'Camera / smartphone for physical mapping photos', checked: true },
    { id: 'c6', label: 'Clipboards, notebooks, & water-resistant pens', checked: false },
    { id: 'c7', label: 'First-aid kit & student identification cards', checked: true },
  ]);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Tool 4: Thesis Idea Bank Themes
  const thesisThemes = {
    climate: [
      'Evaluating urban flood resilience using hydrodynamic modeling in Pabna.',
      'Climate adaptation strategies for informal settlements along the Padma River basin.',
      'Integrating disaster risk reduction into regional planning frameworks in northern Bangladesh.'
    ],
    gis: [
      'GIS-based landfill site suitability analysis using Multi-Criteria Evaluation (MCE).',
      'Modeling urban sprawl and land use changes using cellular automata in secondary towns.',
      'Spatial distribution mapping of public utility services using Network Analysis.'
    ],
    transport: [
      'Impact of non-motorized transport integration on road capacities in Pabna central.',
      'Pedestrian safety assessment and sidewalk design recommendations for university corridors.',
      'Transit-Oriented Development (TOD) feasibility studies along regional transit hubs.'
    ],
    housing: [
      'Evaluating low-cost housing schemes for sub-urban industrial laborers.',
      'Gentrification impacts and land price dynamics in emerging regional urban centers.',
      'Assessing housing quality and liveability index criteria in secondary municipalities.'
    ]
  };
  const [selectedTheme, setSelectedTheme] = useState('climate');

  return (
    <div>
      <section className="page-hero compact">
        <p className="eyebrow">Planner Workspace</p>
        <h1>Extra tools for smoother student life.</h1>
        <p className="muted">
          Interactive helper utilities designed specifically for URP coursework, surveys, and exam reviews.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '30px', alignItems: 'start' }} className="tools-layout">
        
        {/* Side panel */}
        <aside className="glass-panel tools-sidebar" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setActiveTool('attendance')}
            className={`btn ${activeTool === 'attendance' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            <ShieldAlert size={16} /> Attendance Guard
          </button>
          <button
            onClick={() => setActiveTool('tracker')}
            className={`btn ${activeTool === 'tracker' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            <CheckSquare size={16} /> Reading Tracker
          </button>
          <button
            onClick={() => setActiveTool('checklist')}
            className={`btn ${activeTool === 'checklist' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            <Calendar size={16} /> Field Survey Kit
          </button>
          <button
            onClick={() => setActiveTool('thesis')}
            className={`btn ${activeTool === 'thesis' ? 'primary' : 'ghost'}`}
            style={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            <Award size={16} /> Thesis Idea Bank
          </button>
        </aside>

        {/* Content panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          
          {/* Tool 1: Attendance Guard */}
          {activeTool === 'attendance' && (
            <div>
              <h2 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Attendance Guard (60% Target)</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                PUST academic ordinances mandate a minimum of 60% class attendance to be eligible for term final exams.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="form-group">
                  <label htmlFor="held-classes">Total Classes Held</label>
                  <input
                    type="number"
                    id="held-classes"
                    className="form-input"
                    value={classesHeld}
                    onChange={(e) => setClassesHeld(Math.max(1, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="attended-classes">Classes Attended</label>
                  <input
                    type="number"
                    id="attended-classes"
                    className="form-input"
                    value={classesAttended}
                    onChange={(e) => setClassesAttended(Math.min(classesHeld, Math.max(0, parseInt(e.target.value) || 0)))}
                  />
                </div>
              </div>

              {/* Result Indicator */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '24px', 
                  textAlign: 'center', 
                  borderColor: isEligible ? 'var(--green)' : 'var(--red)',
                  background: isEligible ? 'var(--green-bg)' : 'var(--red-bg)'
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: isEligible ? 'var(--green)' : 'var(--red)' }}>
                  {attendanceRate.toFixed(1)}%
                </div>
                <h3 style={{ margin: '8px 0', color: '#fff' }}>
                  {isEligible ? 'Eligible for Term Finals' : 'At Risk - Under 60% Limit'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {isEligible 
                    ? `You can miss up to ${Math.floor((classesAttended - 0.6 * classesHeld) / 0.6)} more classes and stay eligible.`
                    : `You need to attend the next ${Math.ceil((0.6 * classesHeld - classesAttended) / 0.4)} classes consecutively to reach 60%.`}
                </p>
              </div>
            </div>
          )}

          {/* Tool 2: Reading Tracker */}
          {activeTool === 'tracker' && (
            <div>
              <h2 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Course Reading Tracker</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Keep track of textbook chapters, notes, or articles checked out from PlannersHub.
              </p>

              {/* Add form */}
              <form onSubmit={addReading} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '12px', alignItems: 'end', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Resource Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Site Planning Chapter 3"
                    className="form-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. URP 2103"
                    className="form-input"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    style={{ width: '120px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ width: '120px' }}
                  >
                    <option value="Reading">Reading</option>
                    <option value="Revised">Revised</option>
                  </select>
                </div>
                <button type="submit" className="btn primary" style={{ height: '46px', display: 'flex', alignItems: 'center' }}>
                  <Plus size={16} /> Add
                </button>
              </form>

              {/* Tracker List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {readings.length > 0 ? (
                  readings.map((r) => (
                    <div 
                      key={r.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: '12px 18px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.01)',
                        borderColor: 'rgba(0, 229, 255, 0.05)'
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{r.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>{r.course}</div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                          onClick={() => toggleStatus(r.id)}
                          className="chip"
                          style={{
                            cursor: 'pointer',
                            background: r.status === 'Revised' ? 'var(--green-bg)' : 'var(--blue-bg)',
                            color: r.status === 'Revised' ? 'var(--green)' : 'var(--blue)',
                            borderColor: r.status === 'Revised' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            outline: 'none'
                          }}
                        >
                          {r.status}
                        </button>
                        
                        <button
                          onClick={() => deleteReading(r.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', outline: 'none' }}
                        >
                          <Trash2 size={16} className="btn-hover-red" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px' }}>No readings tracked yet. Add one above!</div>
                )}
              </div>
            </div>
          )}

          {/* Tool 3: Field Survey Kit Checklist */}
          {activeTool === 'checklist' && (
            <div>
              <h2 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Field Survey Kit Checklist</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Prepare your gear before heading out for mapping, social questionnaires, or physical surveys.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {checklist.map((item) => (
                  <label 
                    key={item.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '14px 18px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '14px', 
                      cursor: 'pointer',
                      background: item.checked ? 'rgba(0, 229, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                      borderColor: item.checked ? 'rgba(0, 229, 255, 0.2)' : 'var(--border)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                    <span style={{ 
                      fontSize: '0.92rem', 
                      color: item.checked ? 'var(--muted)' : '#fff',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      textAlign: 'left'
                    }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tool 4: Thesis Idea Bank */}
          {activeTool === 'thesis' && (
            <div>
              <h2 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Thesis &amp; Sessional Project Ideas</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Select a planning field to browse recommended thesis topics and project scopes in Bangladesh towns.
              </p>

              {/* Theme tabs */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px' }}>
                {Object.keys(thesisThemes).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`btn ${selectedTheme === theme ? 'primary' : 'secondary'}`}
                    style={{ padding: '6px 14px', fontSize: '0.8rem', minHeight: 'auto', textTransform: 'capitalize' }}
                  >
                    {theme} planning
                  </button>
                ))}
              </div>

              {/* Topics list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {thesisThemes[selectedTheme].map((topic, i) => (
                  <div 
                    key={i} 
                    className="glass-panel" 
                    style={{ 
                      padding: '18px 20px', 
                      background: 'rgba(255,255,255,0.01)', 
                      borderColor: 'rgba(0, 229, 255, 0.05)',
                      textAlign: 'left',
                      lineHeight: '1.5'
                    }}
                  >
                    <strong style={{ display: 'block', color: 'var(--accent)', fontSize: '0.8rem', uppercase: 'true', marginBottom: '6px' }}>Topic #{i+1}</strong>
                    <span style={{ color: '#fff', fontSize: '0.95rem' }}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .btn-hover-red:hover {
          color: var(--red) !important;
        }
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
