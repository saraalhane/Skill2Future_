import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CoursePlayer.css';

const API = 'http://127.0.0.1:8000/api/auth';

const LESSON_CONTENT = {
  video:    { icon: 'fas fa-play-circle', label: 'Vidéo',    color: '#6366f1' },
  article:  { icon: 'fas fa-file-alt',   label: 'Article',   color: '#10b981' },
  exercise: { icon: 'fas fa-code',       label: 'Exercice',  color: '#f59e0b' },
};

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');

  // ── Fetch course data ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchCourse();
    fetchComments();
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/courses/${id}/player`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Impossible de charger le cours.');
      const data = await res.json();
      setCourse(data);
      setCompletedIds(data.completed_ids || []);
      // Expand first module by default, activate first lesson
      if (data.modules?.length > 0) {
        setExpandedModules([data.modules[0].id]);
        setActiveLesson(data.modules[0].lessons[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API}/comments?course_id=${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (res.ok) {
        setComments(await res.json());
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || commenting) return;
    setCommenting(true);
    try {
      const res = await fetch(`${API}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: id,
          lesson_id: activeLesson?.id || null,
          content: newComment
        }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setCommenting(false);
    }
  };

  // ── Computed values ────────────────────────────────────────────────────────
  const allLessons = course ? course.modules.flatMap(m => m.lessons) : [];
  const progress = course ? course.progress : 0;
  const xp = completedIds.length * 50;
  const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = allLessons[currentIndex - 1] || null;
  const nextLesson = allLessons[currentIndex + 1] || null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const markComplete = async () => {
    if (!activeLesson || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/courses/${id}/complete-lesson`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lesson_id: activeLesson.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompletedIds(prev =>
          prev.includes(activeLesson.id) ? prev : [...prev, activeLesson.id]
        );
        // Update displayed progress
        setCourse(prev => prev ? { ...prev, progress: data.progress, status: data.status } : prev);
        // Auto-advance to next lesson
        if (nextLesson) {
          setActiveLesson(nextLesson);
        } else if (data.certificate_unlocked) {
          alert("Félicitations ! Vous avez terminé le cours à 100% et débloqué votre certificat ! 🎉");
          navigate('/certifications');
        } else if (data.progress === 100) {
          alert("Cours terminé !");
        }
      }
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    } finally {
      setSaving(false);
    }
  };

  const getLessonTypeInfo = (type) => LESSON_CONTENT[type] || LESSON_CONTENT.video;

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="player-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#6366f1', marginBottom: 16 }}></i>
          <p>Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="player-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: 16 }}></i>
          <p>{error || 'Cours introuvable.'}</p>
          <button onClick={() => navigate('/learning')} style={{ marginTop: 16, padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            ← Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="player-page">
      {/* Top Bar */}
      <header className="player-topbar">
        <div className="topbar-left">
          <button className="topbar-btn" onClick={() => navigate('/learning')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="topbar-btn" onClick={() => setSidebarOpen(o => !o)}>
            <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
          </button>
          <div className="topbar-course-info">
            <span className="topbar-course-title">{course.title}</span>
            <span className="topbar-instructor">
              <i className="fas fa-user-tie"></i> {course.instructor}
            </span>
          </div>
        </div>
        <div className="topbar-center">
          <div className="topbar-progress">
            <div className="topbar-progress-bar">
              <div className="topbar-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span>{progress}% complété</span>
          </div>
        </div>
        <div className="topbar-right">
          <div className="xp-badge">
            <i className="fas fa-star"></i> {xp} XP
          </div>
        </div>
      </header>

      <div className="player-body">
        {/* Sidebar */}
        <aside className={`player-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-summary">
            <span>{completedIds.length}/{allLessons.length} leçons</span>
            <div className="sidebar-prog-bar">
              <div className="sidebar-prog-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="modules-list">
            {course.modules.map(module => (
              <div key={module.id} className="module-block">
                <button
                  className={`module-header-btn ${expandedModules.includes(module.id) ? 'expanded' : ''}`}
                  onClick={() => toggleModule(module.id)}
                >
                  <span className="module-title">{module.title}</span>
                  <i className={`fas fa-chevron-${expandedModules.includes(module.id) ? 'up' : 'down'}`}></i>
                </button>
                {expandedModules.includes(module.id) && (
                  <div className="lessons-list">
                    {module.lessons.map(lesson => {
                      const typeInfo = getLessonTypeInfo(lesson.type);
                      const isDone = completedIds.includes(lesson.id);
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          className={`lesson-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                          onClick={() => setActiveLesson(lesson)}
                        >
                          <div className="lesson-check">
                            {isDone
                              ? <i className="fas fa-check-circle"></i>
                              : <i className="far fa-circle"></i>
                            }
                          </div>
                          <div className="lesson-info">
                            <span className="lesson-name">{lesson.title}</span>
                            <span className="lesson-meta">
                              <i className={typeInfo.icon} style={{ color: typeInfo.color }}></i>
                              {lesson.duration}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="player-main">
          <div className="content-area">
            {/* Content based on lesson type */}
            {activeLesson?.type === 'video' && (
              <div className="video-wrapper">
                {activeLesson.video_url ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={activeLesson.video_url} 
                    title={activeLesson.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '16px' }}
                  ></iframe>
                ) : (
                  <div className="video-placeholder">
                    <div className="video-play-btn"><i className="fas fa-play"></i></div>
                    <div className="video-overlay-info">
                      <span><i className="fas fa-video"></i> {activeLesson.title}</span>
                      <span><i className="fas fa-clock"></i> {activeLesson.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeLesson?.type === 'article' && (
              <div className="article-content">
                <div className="article-header">
                  <i className="fas fa-file-alt"></i>
                  <h2>{activeLesson.title}</h2>
                </div>
                <div className="article-body">
                  <p>Dans cette leçon, nous allons explorer les concepts fondamentaux de <strong>{activeLesson.title}</strong>.</p>
                  <h3>Concepts clés</h3>
                  <ul>
                    <li>Comprendre la structure et les composants principaux</li>
                    <li>Appliquer les bonnes pratiques de l'industrie</li>
                    <li>Réaliser des exercices pratiques pour consolider vos acquis</li>
                    <li>Explorer des cas d'usage réels en production</li>
                  </ul>
                  <h3>Exemple</h3>
                  <pre><code>{`/* Exemple de base */\n.container {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}`}</code></pre>
                </div>
              </div>
            )}
            {activeLesson?.type === 'exercise' && (
              <div className="exercise-content">
                <div className="exercise-header">
                  <i className="fas fa-code"></i>
                  <h2>{activeLesson.title}</h2>
                  <span className="exercise-difficulty">Intermédiaire</span>
                </div>
                <div className="exercise-instructions">
                  <h3><i className="fas fa-list-check"></i> Instructions</h3>
                  <ol>
                    <li>Créez un nouveau fichier dans votre environnement de développement</li>
                    <li>Implémentez les fonctionnalités décrites</li>
                    <li>Testez votre code avec les cas de test fournis</li>
                    <li>Soumettez votre solution pour validation</li>
                  </ol>
                </div>
                <div className="code-editor-placeholder">
                  <div className="editor-topbar">
                    <div className="editor-dots">
                      <span style={{ background: '#ff5f57' }}></span>
                      <span style={{ background: '#febc2e' }}></span>
                      <span style={{ background: '#28c840' }}></span>
                    </div>
                    <span>solution.js</span>
                  </div>
                  <div className="editor-body">
                    <span className="editor-hint">// Écrivez votre solution ici...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson header */}
            {activeLesson && (
              <div className="lesson-header-bar">
                <div className="lesson-title-block">
                  <span className={`lesson-type-badge type-${activeLesson.type}`}>
                    <i className={getLessonTypeInfo(activeLesson.type).icon}></i>
                    {getLessonTypeInfo(activeLesson.type).label}
                  </span>
                  <h1>{activeLesson.title}</h1>
                  <p className="lesson-duration">
                    <i className="fas fa-clock"></i> {activeLesson.duration}
                  </p>
                </div>
              </div>
            )}

            {/* Q&A Section */}
            <div className="qa-section" style={{ marginTop: '40px', background: '#1a1f2e', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-comments" style={{ color: '#6366f1' }}></i> Questions & Réponses
              </h3>
              
              <div className="qa-input-area" style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    placeholder="Posez une question ou partagez une réflexion..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                      onClick={submitComment}
                      disabled={!newComment.trim() || commenting}
                      style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: (!newComment.trim() || commenting) ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: (!newComment.trim() || commenting) ? 0.5 : 1 }}
                    >
                      {commenting ? 'Envoi...' : 'Publier'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="qa-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comments.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', margin: '20px 0' }}>Aucune question pour l'instant. Soyez le premier !</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0 }}>
                        {c.user?.name ? c.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold', color: '#e2e8f0' }}>{c.user?.name || 'Utilisateur'}</span>
                          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        {c.lesson_id && (
                          <div style={{ display: 'inline-block', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                            <i className="fas fa-tag"></i> Leçon {c.lesson_id}
                          </div>
                        )}
                        <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.5' }}>{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Navigation footer */}
          <div className="nav-footer">
            <button
              className="nav-btn prev-btn"
              onClick={() => prevLesson && setActiveLesson(prevLesson)}
              disabled={!prevLesson}
            >
              <i className="fas fa-arrow-left"></i> Précédent
            </button>
            <button
              className="nav-btn complete-btn"
              onClick={markComplete}
              disabled={saving}
            >
              {saving
                ? <><i className="fas fa-spinner fa-spin"></i> Enregistrement...</>
                : completedIds.includes(activeLesson?.id)
                  ? <><i className="fas fa-check"></i> Terminée ✓</>
                  : <><i className="fas fa-check-circle"></i> Marquer comme terminée</>
              }
            </button>
            <button
              className="nav-btn next-btn"
              onClick={() => nextLesson && setActiveLesson(nextLesson)}
              disabled={!nextLesson}
            >
              Suivant <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
