import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Certifications.css';

export default function Certifications() {
    const [quizzes, setQuizzes] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch all quizzes
                const quizzesRes = await fetch("http://127.0.0.1:8000/api/auth/quizzes", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
                let quizzesData = [];
                if (quizzesRes.ok) {
                    quizzesData = await quizzesRes.json();
                    setQuizzes(quizzesData);
                }

                // Fetch user results
                const resultsRes = await fetch("http://127.0.0.1:8000/api/auth/quiz-results", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
                if (resultsRes.ok) {
                    const resultsData = await resultsRes.json();
                    setResults(resultsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="certifications-page" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Chargement de vos certifications...
                </div>
            </div>
        );
    }

    // Process data to find obtained vs available certifications
    // A certification is obtained if the max score for that quiz >= passing_score
    const obtainedCerts = [];
    const availableCerts = [];

    quizzes.forEach(quiz => {
        const passingScore = quiz.passing_score || 70;
        // Find the best result for this quiz
        const quizResults = results.filter(r => r.quiz_id === quiz.id);
        const bestScore = quizResults.length > 0 
            ? Math.max(...quizResults.map(r => r.score)) 
            : null;

        if (bestScore !== null && bestScore >= passingScore) {
            // Find the date of the successful result
            const passingResult = quizResults.find(r => r.score === bestScore);
            const dateStr = new Date(passingResult.updated_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            obtainedCerts.push({
                ...quiz,
                bestScore,
                dateObtained: dateStr
            });
        } else {
            availableCerts.push({
                ...quiz,
                bestScore: bestScore !== null ? bestScore : 0
            });
        }
    });

    return (
        <div className="certifications-page">
            <header className="page-header">
                <h1>Mes Certifications</h1>
                <div className="notification-icon">
                    <i className="fas fa-trophy"></i>
                    <span className="badge">{obtainedCerts.length}</span>
                </div>
            </header>

            <div className="certifications-content">
                {/* Certifications obtenues section */}
                <section className="cert-section">
                    <div className="section-header">
                        <h2><i className="fas fa-medal" style={{ color: '#fbbf24', marginRight: '8px' }}></i> Certifications obtenues</h2>
                        <span className="count-badge">{obtainedCerts.length}/{quizzes.length}</span>
                    </div>

                    {obtainedCerts.length === 0 ? (
                        <div style={{ color: '#94a3b8', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            Vous n'avez pas encore obtenu de certification. Complétez un quiz avec succès pour débloquer votre premier certificat!
                        </div>
                    ) : (
                        <div className="cert-grid">
                            {obtainedCerts.map((cert) => (
                                <div className="cert-card obtained" key={cert.id}>
                                    <div className="cert-icon-wrapper obtained-icon">
                                        <i className="fas fa-certificate"></i>
                                    </div>
                                    <h3>{cert.title}</h3>
                                    <p>Certificat en {cert.category}</p>
                                    <div className="cert-meta">
                                        <span><i className="far fa-calendar-alt"></i> {cert.dateObtained}</span>
                                        <span><i className="fas fa-star" style={{ color: '#fbbf24' }}></i> Score: {cert.bestScore}%</span>
                                    </div>
                                    <Link to={`/certificate/${cert.category.toLowerCase()}`} className="btn-download" style={{ textDecoration: 'none' }}>
                                        <i className="fas fa-eye"></i> Voir le certificat
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Certifications disponibles section */}
                <section className="cert-section">
                    <div className="section-header">
                        <h2><i className="fas fa-lock" style={{ color: '#94a3b8', marginRight: '8px' }}></i> Certifications à débloquer</h2>
                    </div>

                    {availableCerts.length === 0 ? (
                        <div style={{ color: '#94a3b8', padding: '20px' }}>
                            Félicitations! Vous avez obtenu toutes les certifications disponibles.
                        </div>
                    ) : (
                        <div className="cert-grid">
                            {availableCerts.map(cert => {
                                const passingScore = cert.passing_score || 70;
                                const progressPct = Math.min(100, Math.round((cert.bestScore / passingScore) * 100));
                                
                                return (
                                    <div className="cert-card locked available" key={cert.id}>
                                        <div className="cert-icon-wrapper">
                                            <i className="fas fa-lock"></i>
                                        </div>
                                        <h3>{cert.title}</h3>
                                        <p>Requis: {passingScore}%</p>
                                        <div className="progress-container">
                                            <div className="progress-info">
                                                <span>Meilleur Score</span>
                                                <span className="progress-value">{cert.bestScore}%</span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: progressPct > 0 ? '#6366f1' : '#475569' }}></div>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn-action" 
                                            onClick={() => navigate('/quiz')}
                                            style={{ cursor: 'pointer', background: 'rgba(99, 102, 241, 0.1)', color: '#8b5cf6', border: '1px solid rgba(99, 102, 241, 0.2)' }}
                                        >
                                            <i className="fas fa-play"></i> Tenter le Quiz
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Info section */}
                <section className="info-section" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div className="info-icon" style={{ fontSize: '2rem', color: '#3b82f6' }}>
                        <i className="fas fa-info-circle"></i>
                    </div>
                    <div className="info-content">
                        <h3 style={{ margin: '0 0 8px 0', color: '#f1f5f9' }}>Comment obtenir une certification ?</h3>
                        <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.5' }}>Pour obtenir une certification, accédez à la page des <strong>Quiz</strong> et réussissez le test d'évaluation avec un score supérieur ou égal au score requis indiqué pour chaque technologie.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
