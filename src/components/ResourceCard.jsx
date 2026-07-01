import React from 'react';
import { Download, ExternalLink, Play } from 'lucide-react';

export const ResourceCard = ({ item }) => {
  const isVideo = item.category === 'youtube' || item.type === 'video' || item.format === 'YouTube';

  // Transform standard Google Drive file links into direct download links
  const getDownloadLink = (link) => {
    if (!link) return '#';
    if (link.includes('file/d/')) {
      try {
        const parts = link.split('file/d/');
        if (parts.length > 1) {
          const fileId = parts[1].split('/')[0];
          return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      } catch (e) {
        console.warn('Failed to parse download link:', e);
      }
    }
    return link;
  };

  // Helper to check if string starts with http/https
  const isExternal = (link) => {
    return link && link.startsWith('http');
  };

  if (isVideo) {
    // Generate YouTube video ID from watch URL if no specific embed URL is provided
    let embedUrl = item.linkEmbd;
    if (!embedUrl && item.resource_url) {
      if (item.resource_url.includes('youtube.com/watch')) {
        try {
          const urlObj = new URL(item.resource_url);
          const videoId = urlObj.searchParams.get('v');
          if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } catch (e) {}
      } else if (item.resource_url.includes('youtu.be/')) {
        try {
          const videoId = item.resource_url.split('youtu.be/')[1]?.split('?')[0];
          if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } catch (e) {}
      }
    }

    return (
      <article className="resource-card glass-panel" style={{ padding: '16px' }}>
        <span className="course-badge">{item.course_code}</span>
        {embedUrl ? (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--border)' }}>
            <iframe
              src={embedUrl}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
          </div>
        ) : (
          item.thumbnail_url && (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--border)' }}>
              <img 
                src={item.thumbnail_url} 
                alt={item.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                loading="lazy"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'grid', placeItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)' }}>
                  <Play size={20} fill="#fff" style={{ marginLeft: '2px' }} />
                </div>
              </div>
            </div>
          )
        )}
        <h3>{item.title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Semester {item.semester}</span>
        </p>
        
        <div className="meta-tags">
          <span className="chip secondary">YouTube</span>
          {item.level && <span className="chip">{item.level}</span>}
        </div>
        
        <div className="resource-actions">
          <a
            href={item.resource_url}
            target="_blank"
            rel="noreferrer"
            className="btn primary"
            style={{ width: '100%' }}
          >
            <Play size={14} fill="currentColor" /> Watch Resource
          </a>
        </div>
      </article>
    );
  }

  // Document resource (Book, Note, Question)
  const downloadLink = getDownloadLink(item.resource_url);
  const targetAttrs = isExternal(item.resource_url) ? { target: '_blank', rel: 'noreferrer' } : {};

  // Color categories
  const getCategoryChipClass = (cat) => {
    if (cat === 'book') return 'chip accent';
    if (cat === 'note') return 'chip secondary';
    return 'chip'; // question
  };

  return (
    <article className="resource-card glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span className="course-badge">{item.course_code}</span>
        <span className={getCategoryChipClass(item.category)}>{item.category}</span>
      </div>
      <h3>{item.title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.5' }}>
        Academic material mapped to course code <strong>{item.course_code}</strong> for Semester {item.semester}.
      </p>

      <div className="meta-tags">
        <span className="chip">{item.format || 'PDF'}</span>
        {item.level && <span className="chip">{item.level}</span>}
      </div>

      <div className="resource-actions">
        <a
          href={item.resource_url}
          {...targetAttrs}
          className="btn secondary"
        >
          <ExternalLink size={14} /> Preview
        </a>
        <a
          href={downloadLink}
          {...targetAttrs}
          className="btn primary"
        >
          <Download size={14} /> Download
        </a>
      </div>
    </article>
  );
};
