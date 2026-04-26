import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import html2pdf from 'html2pdf.js';
import './CertificateView.css';

export default function CertificateView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [score, setScore] = useState(0);
    const [dateObtained, setDateObtained] = useState('');
    const [loading, setLoading] = useState(true);
    const certificateRef = useRef(null);

    const categoryNames = {
        'sql': 'SQL',
        'html': 'HTML',
        'css': 'CSS',
        'javascript': 'JavaScript',
        'php': 'PHP',
        'python': 'Python'
    };

    const category = categoryNames[id?.toLowerCase()] || id?.toUpperCase() || 'Skill2Future';
    const courseName = `Certificat en ${category}`;
    const userName = user && user.name ? user.name : (user && user.prenom && user.nom ? `${user.prenom} ${user.nom}` : 'Apprenant Certifié');

    useEffect(() => {
        const fetchBestScore = async () => {
            const token = localStorage.getItem("token");
            if (!token) { setLoading(false); return; }
            try {
                // Fetch all quizzes to match category
                const qRes = await fetch("http://127.0.0.1:8000/api/auth/quizzes", { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }});
                if (!qRes.ok) throw new Error();
                const quizzes = await qRes.json();
                
                // Fetch results
                const rRes = await fetch("http://127.0.0.1:8000/api/auth/quiz-results", { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }});
                if (!rRes.ok) throw new Error();
                const results = await rRes.json();
                
                // Find quizzes matching this category
                const catQuizzes = quizzes.filter(q => q.category.toLowerCase() === category.toLowerCase());
                const catQuizIds = catQuizzes.map(q => q.id);
                
                // Find highest result for these quizzes
                const relevantResults = results.filter(r => catQuizIds.includes(r.quiz_id));
                if (relevantResults.length > 0) {
                    const bestResult = relevantResults.sort((a,b) => b.score - a.score)[0];
                    setScore(bestResult.score);
                    
                    const dateStr = new Date(bestResult.updated_at).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    });
                    setDateObtained(dateStr);
                } else {
                    // Fallback if no result found
                    setDateObtained(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }));
                }
            } catch (err) {
                console.error("Error fetching score:", err);
                setDateObtained(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }));
            } finally {
                setLoading(false);
            }
        };
        fetchBestScore();
    }, [category]);

    const handleDownloadPdf = () => {
        const element = certificateRef.current;
        const opt = {
            margin:       0,
            filename:     `certificat_${category.toLowerCase()}_${userName.replace(' ', '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(element).save();
    };

    if (loading) {
        return <div className="certificate-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div style={{color: '#94a3b8', fontSize: '1.2rem'}}><i className="fas fa-spinner fa-spin"></i> Préparation du certificat...</div></div>;
    }

    return (
        <div className="certificate-container">
            <div className="certificate-actions no-print">
                <button onClick={() => navigate(-1)} className="btn-back">
                    <i className="fas fa-arrow-left"></i> Retour
                </button>
                <button onClick={handleDownloadPdf} className="btn-print">
                    <i className="fas fa-file-pdf"></i> Télécharger PDF
                </button>
            </div>

            <div className="certificate-wrapper" ref={certificateRef}>
                <div className="certificate-body">
                    <div className="certificate-border">
                        <div className="certificate-content">
                            <div className="cert-header">
                                <div className="cert-logo">
                                    <i className="fas fa-graduation-cap"></i> Skill2Future
                                </div>
                                <h2>Certificat de Réussite</h2>
                            </div>
                            
                            <div className="cert-text">
                                <p className="cert-present">Ce certificat est fièrement décerné à</p>
                                <h1 className="cert-name">{userName}</h1>
                                <p className="cert-description">
                                    pour avoir réussi avec succès l'évaluation finale et démontré ses compétences en :
                                </p>
                                <h3 className="cert-course">{courseName}</h3>
                                <p className="cert-score">Score d'évaluation : <strong>{score}%</strong></p>
                            </div>

                            <div className="cert-footer">
                                <div className="cert-signature">
                                    <div className="signature-line">
                                        <span className="signature-font">Skill2Future</span>
                                    </div>
                                    <p>Équipe Pédagogique</p>
                                </div>
                                <div className="cert-seal">
                                    <div className="seal-outer">
                                        <div className="seal-inner">
                                            <i className="fas fa-award"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="cert-date">
                                    <div className="signature-line date-line">
                                        {dateObtained}
                                    </div>
                                    <p>Date d'obtention</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
