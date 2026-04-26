import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Learning.css';

export default function Learning() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tous');

    useEffect(() => {
        fetchCourses();
        fetchAnnouncements();
    }, []);

    const fetchCourses = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/courses", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCourses(data);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/announcements", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) setAnnouncements(await res.json());
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const filteredCourses = courses.filter(course => {
        if (activeTab === 'tous') return true;
        if (activeTab === 'en_cours') return course.status === 'en_cours';
        if (activeTab === 'termine') return course.status === 'termine';
        if (activeTab === 'non_commence') return course.status === 'non_commence' || course.status === 'verrouille';
        return true;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'en_cours':
                return <div className="status-badge en_cours"><i className="fas fa-play-circle"></i> En cours</div>;
            case 'termine':
                return <div className="status-badge termine"><i className="fas fa-check-circle"></i> Terminé</div>;
            case 'verrouille':
                return <div className="status-badge verrouille"><i className="fas fa-lock"></i> Verrouillé</div>;
            case 'non_commence':
            default:
                return null;
        }
    };

    if (loading) return <div>Chargement de vos cours...</div>;

    return (
        <div className="learning-page">
            <header className="learning-header">
                <h1>Apprentissage</h1>
                <a href="/notifications" className="notification-badge" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <i className="fas fa-bell"></i>
                    {announcements.length > 0 && <span className="badge">{announcements.length}</span>}
                </a>
            </header>

            <div className="learning-tabs">
                <button className={`tab-btn ${activeTab === 'tous' ? 'active' : ''}`} onClick={() => setActiveTab('tous')}>Tous</button>
                <button className={`tab-btn ${activeTab === 'en_cours' ? 'active' : ''}`} onClick={() => setActiveTab('en_cours')}>En cours</button>
                <button className={`tab-btn ${activeTab === 'termine' ? 'active' : ''}`} onClick={() => setActiveTab('termine')}>Terminés</button>
                <button className={`tab-btn ${activeTab === 'non_commence' ? 'active' : ''}`} onClick={() => setActiveTab('non_commence')}>Non commencés</button>
            </div>

            <div className="courses-grid">
                {filteredCourses.map(course => (
                    <div
                        key={course.id}
                        className={`course-card ${course.status === 'termine' ? 'finished' : ''}`}
                        onClick={() => navigate(`/course/${course.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="course-header" style={{ padding: 0, height: '140px', overflow: 'hidden', position: 'relative' }}>
                            {course.thumbnail_url ? (
                                <img src={`http://127.0.0.1:8000${course.thumbnail_url}`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: course.color_bg || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className={course.icon || 'fas fa-book'} style={{ fontSize: '3rem', color: 'white' }}></i>
                                </div>
                            )}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px 15px 10px' }}>
                                <span className="status-chip" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>
                                    {course.category || 'Général'}
                                </span>
                            </div>
                        </div>
                        <div className="course-info" style={{ padding: '15px' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#1e293b' }}>{course.title}</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{course.lessons_count || 0} leçons • {course.level || 'Débutant'}</p>
                        </div>

                        <div className="course-progress">
                            <div className="progress-header">
                                <span className="progress-label">Progression</span>
                                <span className="progress-value">{course.progress}%</span>
                            </div>
                            <div className="course-progress-bar">
                                <div className="course-progress-fill" style={{ width: `${course.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="course-footer">
                            {getStatusBadge(course.status)}
                            <button
                                className="course-cta-btn"
                                onClick={e => { e.stopPropagation(); navigate(`/course/${course.id}`); }}
                            >
                                {course.status === 'termine'
                                    ? <><i className="fas fa-redo"></i> Revoir</>  
                                    : <><i className="fas fa-play"></i> {course.progress > 0 ? 'Continuer' : 'Commencer'}</>
                                }
                            </button>
                        </div>
                    </div>
                ))}
                {filteredCourses.length === 0 && (
                    <p>Aucun cours trouvé dans cette catégorie.</p>
                )}
            </div>
        </div>
    );
}
