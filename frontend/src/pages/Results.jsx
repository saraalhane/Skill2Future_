import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Confetti from 'react-confetti';
import './Results.css';

export default function Results() {
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLatestResult();
    }, []);

    const fetchLatestResult = async () => {
        const token = localStorage.getItem("token");
        try {
            // Fetch all results for the user
            const res = await fetch("http://127.0.0.1:8000/api/auth/quiz-results", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    // Get the most recent quiz result based on updated_at
                    const latestResult = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
                    setResultData(latestResult);
                } else {
                    setResultData(null);
                }
            } else {
                setResultData(null);
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="results-page" style={{ justifyContent: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-spinner fa-spin"></i> Chargement de vos résultats...
                </div>
            </div>
        );
    }
    
    if (!resultData) {
        return (
            <div className="results-page" style={{ justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-folder-open" style={{ fontSize: '3rem', color: '#64748b', marginBottom: '20px' }}></i>
                    <h2 style={{ color: '#f1f5f9', marginBottom: '10px' }}>Aucun résultat trouvé</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Vous n'avez pas encore terminé de quiz.</p>
                    <button className="btn-primary" onClick={() => navigate('/quiz')}>
                        Aller aux Quiz
                    </button>
                </div>
            </div>
        );
    }

    // Determine pass/fail based on score and passing_score (fallback to 70 if passing_score is not loaded)
    const passingScore = resultData.quiz?.passing_score || 70;
    const isSuccess = resultData.score >= passingScore;
    const statusClass = isSuccess ? 'success' : 'failure';

    const radarData = Object.keys(resultData.skill_analysis || {}).map(key => ({
        subject: key,
        A: resultData.skill_analysis[key],
        fullMark: 100,
    }));

    // Find strongest and weakest skills for breakdown
    const skills = Object.entries(resultData.skill_analysis || {});
    let strongestSkill = { name: 'N/A', score: 0 };
    let weakestSkill = { name: 'N/A', score: 100 };
    
    skills.forEach(([name, score]) => {
        if (score > strongestSkill.score) strongestSkill = { name, score };
        if (score < weakestSkill.score) weakestSkill = { name, score };
    });

    const sendToN8n = async () => {
        try {
            const token = localStorage.getItem("token");
            // First fetch the current user's name and email
            const userRes = await fetch("http://127.0.0.1:8000/api/auth/user", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            const userData = await userRes.json();

            const payload = {
                name: userData.name || userData.prenom + ' ' + userData.nom,
                email: userData.email,
                skill_analysis: resultData.skill_analysis,
                score: resultData.score,
                quiz_title: resultData.quiz?.title || 'Quiz'
            };

            // Send via our backend proxy to avoid CORS issues
            const proxyUrl = "http://127.0.0.1:8000/api/auth/n8n/webhook"; 
            
            const response = await fetch(proxyUrl, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(`Erreur n8n: ${errData.error || response.status}`);
            }

            alert("Données envoyées à n8n avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'envoi à n8n:", error);
            alert("Erreur lors de l'envoi à n8n. Vérifiez l'URL de votre Webhook.");
        }
    };

    return (
        <div className="results-page">
            {isSuccess && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />}
            <header className="results-header">
                <h1>Résultats et Analyse</h1>
            </header>

            <div className="results-main-layout">
                {/* Top Section */}
                <div className="results-top-section">
                    <div className="congrats-text">
                        <h2 className={statusClass}>
                            {isSuccess ? 'Félicitations!' : 'Dommage...'}
                        </h2>
                        <p>
                            {isSuccess 
                                ? `Vous avez réussi le quiz ${resultData.quiz?.title || ''}.` 
                                : `Vous n'avez pas atteint le score requis pour le quiz ${resultData.quiz?.title || ''}.`}
                        </p>
                    </div>
                    <div className={`score-circle-container ${statusClass}`}>
                        <h3>{resultData.score}%</h3>
                        <p>Score final</p>
                    </div>
                </div>

                {/* Stats row */}
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon score">
                            <i className="fas fa-bullseye"></i>
                        </div>
                        <div className="stat-info">
                            <h4>{resultData.score}%</h4>
                            <p>Votre Score</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon required">
                            <i className="fas fa-flag-checkered"></i>
                        </div>
                        <div className="stat-info">
                            <h4>{passingScore}%</h4>
                            <p>Score Requis</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon questions">
                            <i className="fas fa-list-ol"></i>
                        </div>
                        <div className="stat-info">
                            <h4>{resultData.total_questions}</h4>
                            <p>Questions Totales</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="results-actions">
                    <button className="btn-secondary" onClick={() => navigate('/dashboard')}><i className="fas fa-home"></i> Tableau de bord</button>
                    <button className="btn-primary" onClick={() => navigate('/quiz')}><i className="fas fa-list"></i> Autres Quiz</button>
                    <button className="btn-primary" style={{ background: '#ec4899', borderColor: '#ec4899' }} onClick={sendToN8n}><i className="fas fa-paper-plane"></i> Envoyer à n8n</button>
                </div>
            </div>
        </div>
    );
}
