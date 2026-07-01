import React, { useState, useEffect } from 'react';
import { SEMESTERS, COURSES, GRADING_SCALE } from '../data/curriculum';
import { Plus, RotateCcw, Award } from 'lucide-react';

export const Cgpa = () => {
  const [loadedSemesters, setLoadedSemesters] = useState([]);
  const [grades, setGrades] = useState({}); // { courseCode: pointValue }
  const [cgpaResult, setCgpaResult] = useState({ cgpa: 0.0, attempted: 0, standing: 'Load a semester to begin.' });

  // Load 1st semester by default
  useEffect(() => {
    loadSemester(1);
  }, []);

  // Compute CGPA when loaded semesters or grades change
  useEffect(() => {
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    loadedSemesters.forEach((semId) => {
      const semCourses = COURSES.filter((c) => c.semester === semId);
      semCourses.forEach((course) => {
        const credit = course.credits;
        const point = grades[course.code] !== undefined ? grades[course.code] : 4.0; // default A+ = 4.0
        totalWeightedPoints += credit * point;
        totalCredits += credit;
      });
    });

    const computedCgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0.0;
    const standing = getStandingMessage(computedCgpa, totalCredits);

    setCgpaResult({
      cgpa: parseFloat(computedCgpa.toFixed(2)),
      attempted: totalCredits,
      standing: standing,
    });
  }, [loadedSemesters, grades]);

  const loadSemester = (semId) => {
    if (!semId || loadedSemesters.includes(semId)) return;

    // Add to loaded list
    setLoadedSemesters([...loadedSemesters, semId].sort((a, b) => a - b));

    // Prepopulate grades for courses in this semester to default 4.0 (A+)
    const semCourses = COURSES.filter((c) => c.semester === semId);
    const newGrades = { ...grades };
    semCourses.forEach((course) => {
      if (newGrades[course.code] === undefined) {
        newGrades[course.code] = 4.0;
      }
    });
    setGrades(newGrades);
  };

  const removeSemester = (semId) => {
    setLoadedSemesters(loadedSemesters.filter((id) => id !== semId));
  };

  const handleGradeChange = (courseCode, point) => {
    setGrades({
      ...grades,
      [courseCode]: parseFloat(point),
    });
  };

  const resetAll = () => {
    setLoadedSemesters([]);
    setGrades({});
  };

  const getStandingMessage = (cgpa, totalCredits) => {
    if (totalCredits === 0) return 'Load a semester to begin.';
    if (cgpa >= 4.00) return "উফফ!!! ভাই সেইইই ভাই সেইইই! আপনার মাথায় তো ব্রেইন না, পুরা 'SuperComputer' ফিট করা! মাথা নষ্ট!";
    if (cgpa >= 3.75) return "👑 আরে ভাই ভাই ভাই! 'Bro thinks he is the main character!'... কিন্তু কথা সত্য, আপনিই মেইন ক্যারেক্টার!";
    if (cgpa >= 3.50) return "আরে ভাই ভাই ভাই! আপনার ভাবসাব দেখে মনে হচ্ছে আপনি একাই পুরো ডিপার্টমেন্ট চালান!";
    if (cgpa >= 3.25) return "রেজাল্ট দেখে পুরা 'আমি কি তাদের মতো?' ভাইব আসতেছে! টপারদের জাস্ট একটু পিছন থেকে ছুঁয়ে দিলেন আরকি!";
    if (cgpa >= 3.00) return "রেজাল্ট দেখে মনে হচ্ছে আপনি সিজিপিএ না, সিজিপিএ-র ডিসকাউন্ট রেট দেখাচ্ছেন!";
    if (cgpa >= 2.75) return "তুমি পড়াশোনা করতে চাও, কিন্তু পড়ো না। কী, রাগ করলা?";
    if (cgpa >= 2.50) return "বাল ফালাইছেন! এইটা সিজিপিএ নাকি সেন্টার ফ্রুট এর দাম?!";
    if (cgpa >= 2.25) return "সারা সেমিস্টার শুধু রিলস দেখছেন! পড়ালেখা হয় নাই।";
    if (cgpa >= 2.00) return "মারা খাওয়া' থেকে বাঁচে গেছেন!";
    return "ফেল করছস ভাই! -10,000 Aura Points 💀";
  };

  // Find remaining semesters that can be loaded
  const remainingSemesters = SEMESTERS.filter(
    (sem) => !loadedSemesters.includes(sem.id)
  );

  return (
    <div>
      <section className="page-hero compact">
        <p className="eyebrow">PUST Ordinance Scale</p>
        <h1>BURP CGPA Calculator</h1>
        <p className="muted">
          Add semesters to pre-load course codes, curriculum credits, and calculate your cumulative academic standing.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', alignItems: 'start' }} className="calculator-layout">
        {/* Course input column */}
        <div className="glass-panel" style={{ padding: '24px' }}>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                className="form-select"
                onChange={(e) => {
                  loadSemester(parseInt(e.target.value));
                  e.target.value = ''; // reset selection
                }}
                defaultValue=""
                style={{ minHeight: '40px', width: 'auto', minWidth: '220px' }}
              >
                <option value="" disabled>Load Semester Courses</option>
                {remainingSemesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.label}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={resetAll} className="btn secondary" style={{ padding: '8px 16px', minHeight: '40px' }}>
              <RotateCcw size={14} /> Reset Grid
            </button>
          </div>

          {/* Loaded Semester Blocks */}
          {loadedSemesters.length > 0 ? (
            loadedSemesters.map((semId) => {
              const semLabel = SEMESTERS.find((s) => s.id === semId)?.label;
              const semCourses = COURSES.filter((c) => c.semester === semId);
              const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

              return (
                <div
                  key={semId}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    marginBottom: '20px',
                    background: 'rgba(255,255,255,0.01)',
                    borderColor: 'rgba(0, 229, 255, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--line)' }}>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--accent)' }}>{semLabel}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '700' }}>
                        {semCredits} Credits
                      </span>
                      <button
                        onClick={() => removeSemester(semId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--red)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          outline: 'none'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {semCourses.map((course) => (
                      <div
                        key={course.code}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 0',
                          borderBottom: '1px dashed rgba(255,255,255,0.03)'
                        }}
                      >
                        <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{course.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>{course.code} &bull; {course.credits} Credits</div>
                        </div>

                        <select
                          className="form-select"
                          value={grades[course.code] !== undefined ? grades[course.code] : 4.0}
                          onChange={(e) => handleGradeChange(course.code, e.target.value)}
                          style={{ width: '90px', minHeight: '34px', padding: '0 8px', flexShrink: 0 }}
                          aria-label={`Grade for ${course.code}`}
                        >
                          {GRADING_SCALE.map((grade) => (
                            <option key={grade.letter} value={grade.point}>
                              {grade.letter} ({grade.point.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
              <Award size={48} style={{ color: 'var(--border)', marginBottom: '16px' }} />
              <h3>No Semesters Loaded</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Use the dropdown above to load your class courses.</p>
            </div>
          )}
        </div>

        {/* CGPA display side panel */}
        <aside className="glass-panel" style={{ padding: '24px', textAlign: 'center', position: 'sticky', top: '100px' }}>
          <p className="eyebrow" style={{ marginBottom: '12px' }}>Live Standing</p>
          <strong
            style={{
              display: 'block',
              fontSize: '4rem',
              fontWeight: '900',
              color: 'var(--accent)',
              lineHeight: '1',
              marginBottom: '12px',
              textShadow: '0 0 20px rgba(0,229,255,0.3)'
            }}
          >
            {cgpaResult.cgpa.toFixed(2)}
          </strong>
          <span
            style={{
              display: 'block',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#fff',
              fontWeight: '600',
              marginBottom: '20px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--line)'
            }}
          >
            {cgpaResult.standing}
          </span>
          <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: '600', uppercase: 'true' }}>
            {cgpaResult.attempted.toFixed(2)} CREDITS EARNED
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calculator-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
