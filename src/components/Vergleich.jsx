import { useState, useRef, useCallback } from 'react';
import {
  getYoutubeThumbnail,
  formatDate,
  addVideoMarker,
  removeVideoMarker,
} from '../data';
import SpeedControl from './SpeedControl';
import { sendSpeedToYoutube, seekToYoutube } from '../youtubeUtils';

export default function Vergleich({ data, onDataChange }) {
  const [selectedProjectId, setSelectedProjectId] = useState(data.projects[0]?.id || '');
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const [refPlaying, setRefPlaying] = useState(false);
  const [ownPlaying, setOwnPlaying] = useState(false);

  const [refSpeed, setRefSpeed] = useState(1.0);
  const [ownSpeed, setOwnSpeed] = useState(1.0);

  const [markerNote, setMarkerNote] = useState('');
  const [markerTime, setMarkerTime] = useState('');

  const refIframeRef = useRef(null);
  const ownIframeRef = useRef(null);

  const selectedProject = data.projects.find((p) => p.id === selectedProjectId);
  const selectedVideo = selectedProject?.practiceVideos.find((v) => v.id === selectedVideoId)
    || selectedProject?.practiceVideos[0] || null;

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setSelectedVideoId(null);
    setRefPlaying(false);
    setOwnPlaying(false);
  };

  const handleSelectVideo = (id) => {
    setSelectedVideoId(id);
    setOwnPlaying(false);
  };

  const handleRefLoad = () => {
    setTimeout(() => sendSpeedToYoutube(refIframeRef.current, refSpeed), 600);
  };

  const handleOwnLoad = () => {
    setTimeout(() => sendSpeedToYoutube(ownIframeRef.current, ownSpeed), 600);
  };

  const handlePlayBoth = () => {
    if (!refPlaying) setRefPlaying(true);
    if (!ownPlaying) setOwnPlaying(true);
  };

  const handleAddMarker = useCallback(() => {
    if (!selectedVideo) return;
    const t = parseFloat(markerTime);
    if (isNaN(t) || t < 0) return;
    const next = addVideoMarker(selectedVideo.id, { time: t, note: markerNote.trim() });
    onDataChange(next);
    setMarkerNote('');
    setMarkerTime('');
  }, [selectedVideo, markerTime, markerNote, onDataChange]);

  const handleRemoveMarker = useCallback((markerId) => {
    if (!selectedVideo) return;
    const next = removeVideoMarker(selectedVideo.id, markerId);
    onDataChange(next);
  }, [selectedVideo, onDataChange]);

  const handleJumpToMarker = useCallback((time) => {
    seekToYoutube(ownIframeRef.current, time);
    if (!ownPlaying) setOwnPlaying(true);
  }, [ownPlaying]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Get refreshed video with markers from data
  const liveVideo = selectedProject?.practiceVideos.find(
    (v) => v.id === (selectedVideo?.id)
  ) || selectedVideo;

  return (
    <div style={{ padding: '0 0 32px' }}>
      {/* Header */}
      <div style={{ padding: '28px 16px 16px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Analyse & Verbesserung
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
          Vergleich
        </h1>
      </div>

      {/* Project Selector */}
      <div style={{ padding: '0 16px 12px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Referenzvideo wählen
        </p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {data.projects.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProject(p.id)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 20,
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: selectedProjectId === p.id ? 'var(--color-primary)' : 'var(--color-surface)',
                color: selectedProjectId === p.id ? '#fff' : 'var(--color-text-muted)',
                boxShadow: 'var(--shadow-card)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {selectedProject ? (
        <>
          {/* ── Top: Referenzvideo ── */}
          <div style={{ padding: '0 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Referenzvideo
              </p>
              <SpeedControl iframeRef={refIframeRef} speed={refSpeed} onSpeedChange={(s) => { setRefSpeed(s); sendSpeedToYoutube(refIframeRef.current, s); }} />
            </div>
            <div style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', background: '#000' }}>
              {refPlaying ? (
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    ref={refIframeRef}
                    src={`https://www.youtube.com/embed/${selectedProject.demoVideoId}?autoplay=1&enablejsapi=1`}
                    title="Referenzvideo"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; gyroscope"
                    allowFullScreen
                    onLoad={handleRefLoad}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <div
                  onClick={() => setRefPlaying(true)}
                  style={{ position: 'relative', paddingTop: '56.25%', cursor: 'pointer', background: '#EFF6FF', overflow: 'hidden' }}
                >
                  <img
                    src={getYoutubeThumbnail(selectedProject.demoVideoId)}
                    alt="Referenzvideo"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-primary)" style={{ marginLeft: 4 }}>
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                    Referenz
                  </div>
                </div>
              )}
            </div>

            {/* Playback controls */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button
                onClick={() => setRefPlaying(!refPlaying)}
                style={ctrlBtnStyle(refPlaying)}
              >
                {refPlaying ? <PauseIcon /> : <PlayIcon />}
                <span>{refPlaying ? 'Pause' : 'Abspielen'}</span>
              </button>
            </div>
          </div>

          {/* ── Bottom: Eigenes Video ── */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Eigenes Übungsvideo
              </p>
              {liveVideo && <SpeedControl iframeRef={ownIframeRef} speed={ownSpeed} onSpeedChange={(s) => { setOwnSpeed(s); sendSpeedToYoutube(ownIframeRef.current, s); }} />}
            </div>

            {/* Practice video selector */}
            {selectedProject.practiceVideos.length > 0 ? (
              <>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
                  {selectedProject.practiceVideos.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVideo(v.id)}
                      style={{
                        flexShrink: 0,
                        padding: '5px 12px',
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: (liveVideo?.id === v.id) ? 'var(--color-primary-light)' : 'var(--color-surface)',
                        color: (liveVideo?.id === v.id) ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                        boxShadow: 'var(--shadow-card)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>

                {liveVideo && (
                  <>
                    <div style={{ borderRadius: 'var(--border-radius-md)', overflow: 'hidden', background: '#000' }}>
                      {ownPlaying ? (
                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                          <iframe
                            ref={ownIframeRef}
                            src={`https://www.youtube.com/embed/${liveVideo.videoId}?autoplay=1&enablejsapi=1`}
                            title={liveVideo.title}
                            frameBorder="0"
                            allow="autoplay; encrypted-media; gyroscope"
                            allowFullScreen
                            onLoad={handleOwnLoad}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => setOwnPlaying(true)}
                          style={{ position: 'relative', paddingTop: '56.25%', cursor: 'pointer', background: '#EFF6FF', overflow: 'hidden' }}
                        >
                          <img
                            src={getYoutubeThumbnail(liveVideo.videoId)}
                            alt={liveVideo.title}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.16)' }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--color-text)" style={{ marginLeft: 3 }}>
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                            </div>
                          </div>
                          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text)' }}>
                            {formatDate(liveVideo.date)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Own video controls */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => setOwnPlaying(!ownPlaying)}
                        style={ctrlBtnStyle(ownPlaying)}
                      >
                        {ownPlaying ? <PauseIcon /> : <PlayIcon />}
                        <span>{ownPlaying ? 'Pause' : 'Abspielen'}</span>
                      </button>
                      <button
                        onClick={handlePlayBoth}
                        style={ctrlBtnStyle(false, true)}
                      >
                        <PlayIcon />
                        <span>Beide abspielen</span>
                      </button>
                    </div>

                    {/* ── Marker System ── */}
                    <div style={{ marginTop: 20, background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '16px', boxShadow: 'var(--shadow-card)' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        Marker (Zeitstempel)
                      </p>

                      {/* Add marker */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <input
                          type="number"
                          placeholder="Zeit (s)"
                          value={markerTime}
                          onChange={(e) => setMarkerTime(e.target.value)}
                          min="0"
                          step="1"
                          style={{
                            width: 80, padding: '9px 10px', borderRadius: 10, border: '1.5px solid var(--color-surface-raised)',
                            background: 'var(--color-surface-raised)', fontSize: '0.88rem', color: 'var(--color-text)',
                            outline: 'none', fontFamily: 'inherit', flexShrink: 0,
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Notiz zum Marker …"
                          value={markerNote}
                          onChange={(e) => setMarkerNote(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddMarker()}
                          style={{
                            flex: 1, padding: '9px 12px', borderRadius: 10, border: '1.5px solid var(--color-surface-raised)',
                            background: 'var(--color-surface-raised)', fontSize: '0.88rem', color: 'var(--color-text)',
                            outline: 'none', fontFamily: 'inherit',
                          }}
                        />
                        <button
                          onClick={handleAddMarker}
                          style={{
                            padding: '9px 14px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700,
                            background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0,
                          }}
                        >+</button>
                      </div>

                      {/* Marker list */}
                      {(liveVideo.markers || []).length === 0 ? (
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>
                          Noch keine Marker. Zeit in Sekunden eingeben und Notiz hinzufügen.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {(liveVideo.markers || []).map((marker) => (
                            <div
                              key={marker.id}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: 'var(--color-surface-raised)', borderRadius: 10, padding: '10px 12px',
                              }}
                            >
                              <button
                                onClick={() => handleJumpToMarker(marker.time)}
                                style={{
                                  flexShrink: 0,
                                  background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)',
                                  border: 'none', borderRadius: 20, padding: '4px 10px',
                                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                                  fontFamily: 'monospace',
                                }}
                              >
                                ▶ {formatTime(marker.time)}
                              </button>
                              <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                                {marker.note || <em style={{ color: 'var(--color-text-muted)' }}>Kein Text</em>}
                              </span>
                              <button
                                onClick={() => handleRemoveMarker(marker.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4, display: 'flex', flexShrink: 0 }}
                                aria-label="Marker entfernen"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--border-radius-md)', padding: '32px 20px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>💪</div>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>Noch keine Übungsvideos</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Füge ein Übungsvideo zu diesem Referenzvideo hinzu, um den Vergleich zu nutzen.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ padding: '48px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎬</div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Kein Referenzvideo</p>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Erstelle zuerst ein Referenzvideo.</p>
        </div>
      )}
    </div>
  );
}

function ctrlBtnStyle(active, secondary = false) {
  return {
    flex: secondary ? 2 : 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '10px 0', borderRadius: 10, fontSize: '0.82rem', fontWeight: 600,
    border: secondary ? '1.5px solid var(--color-primary)' : 'none',
    cursor: 'pointer',
    background: secondary ? 'transparent' : (active ? 'var(--color-primary)' : 'var(--color-surface)'),
    color: secondary ? 'var(--color-primary)' : (active ? '#fff' : 'var(--color-text-muted)'),
    boxShadow: secondary ? 'none' : 'var(--shadow-card)',
    transition: 'all 0.2s',
  };
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
