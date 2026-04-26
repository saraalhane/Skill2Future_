import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

export default function Quiz() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizData, setQuizData] = useState(null);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const navigate = useNavigate();

    // Fetch the list of quizzes when the component mounts
    useEffect(() => {
        fetchQuizzesList();
    }, []);

    // Timer effect for the active quiz
    useEffect(() => {
        if (quizData && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (quizData && timeLeft === 0) {
            handleSubmit();
        }
    }, [quizData, timeLeft]);

    const fetchQuizzesList = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/quizzes", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                const data = await res.json();
                setQuizzes(data);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = async (quizId) => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/auth/quizzes/${quizId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                const data = await res.json();
                setQuizData(data);
                setSelectedQuiz(quizId);
                setCurrentQuestionIndex(0);
                setAnswers({});
                if (data.time_limit) {
                    setTimeLeft(data.time_limit * 60);
                } else {
                    setTimeLeft(15 * 60); // default 15 minutes
                }
            }
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionId) => {
        setAnswers({
            ...answers,
            [quizData.questions[currentQuestionIndex].id]: optionId
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        
        // Calculate exact score based on correct answers
        let correctAnswersCount = 0;
        quizData.questions.forEach(question => {
            const selectedOptionId = answers[question.id];
            if (selectedOptionId) {
                const selectedOption = question.options.find(o => o.id === selectedOptionId);
                // `is_correct` is 1 or true if correct
                if (selectedOption && selectedOption.is_correct) {
                    correctAnswersCount++;
                }
            }
        });
        
        const score = Math.round((correctAnswersCount / quizData.questions.length) * 100);
        
        const resultData = {
            quiz_id: quizData.id,
            score: score,
            total_questions: quizData.questions.length,
            skill_analysis: {
                [quizData.category]: score, // Focus the analysis on the category
                "HTML": 80,
                "CSS": 75,
                "JavaScript": 60,
                "PHP": 50,
                "Python": 45,
                "SQL": 70
            }
        };

        try {
            await fetch("http://127.0.0.1:8000/api/auth/quiz-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(resultData)
            });
            
            navigate('/results');
        } catch (error) {
            console.error("Error submitting quiz:", error);
            navigate('/results');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading && !quizData && quizzes.length === 0) {
        return (
            <div className="quiz-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Chargement des quiz...
                </div>
            </div>
        );
    }

    // Group quizzes by category (normalized casing)
    const categorizedQuizzes = quizzes.reduce((acc, quiz) => {
        let catName = quiz.category || 'Général';
        catName = catName.charAt(0).toUpperCase() + catName.slice(1).toLowerCase();
        
        if (catName.toLowerCase() === 'html') catName = 'HTML';
        if (catName.toLowerCase() === 'css') catName = 'CSS';
        if (catName.toLowerCase() === 'sql') catName = 'SQL';
        if (catName.toLowerCase() === 'php') catName = 'PHP';
        if (catName.toLowerCase() === 'javascript' || catName.toLowerCase() === 'js') catName = 'JavaScript';

        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(quiz);
        return acc;
    }, {});

    // Helper for category colors (similar to admin)
    const getCategoryColor = (category) => {
        const cat = category.toLowerCase();
        if (cat.includes('java') && !cat.includes('javascript')) return { bg: 'linear-gradient(135deg, #ef4444, #b91c1c)', icon: 'fas fa-coffee' };
        if (cat.includes('python')) return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: 'fab fa-python' };
        if (cat.includes('javascript') || cat.includes('js') || cat.includes('react')) return { bg: 'linear-gradient(135deg, #eab308, #ca8a04)', icon: 'fab fa-js' };
        if (cat.includes('html') || cat.includes('css')) return { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: 'fab fa-html5' };
        if (cat.includes('sql') || cat.includes('data')) return { bg: 'linear-gradient(135deg, #10b981, #059669)', icon: 'fas fa-database' };
        if (cat.includes('cyber')) return { bg: 'linear-gradient(135deg, #ec4899, #db2777)', icon: 'fas fa-shield-alt' };
        return { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', icon: 'fas fa-layer-group' };
    };

    // MODE: LIST CATEGORIES
    if (!selectedQuiz && !selectedCategory) {
        return (
            <div className="quiz-page" style={{ padding: '40px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '50px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f1f5f9', marginBottom: '10px' }}>
                        Catégories de Quiz
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Choisissez une technologie pour tester vos connaissances</p>
                </header>

                {Object.keys(categorizedQuizzes).length === 0 && !loading && (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>Aucun quiz disponible pour le moment.</div>
                )}

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '30px',
                    maxWidth: '1200px',
                    width: '100%'
                }}>
                    {Object.entries(categorizedQuizzes).map(([category, catQuizzes]) => {
                        const style = getCategoryColor(category);
                        return (
                            <div key={category} 
                                onClick={() => setSelectedCategory(category)}
                                style={{
                                    background: '#1a1f2e',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}
                                className="quiz-card-hover"
                            >
                                <div style={{ background: style.bg, padding: '40px 20px', textAlign: 'center' }}>
                                    <i className={style.icon} style={{ fontSize: '3rem', color: '#fff', marginBottom: '15px' }}></i>
                                    <h2 style={{ color: '#fff', margin: 0, fontSize: '1.6rem' }}>{category}</h2>
                                </div>
                                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>{catQuizzes.length} Quiz disponible{catQuizzes.length > 1 ? 's' : ''}</span>
                                    <button style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Voir <i className="fas fa-arrow-right" style={{ marginLeft: '5px' }}></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // MODE: LIST QUIZZES FOR A SELECTED CATEGORY
    if (!selectedQuiz && selectedCategory) {
        const catQuizzes = categorizedQuizzes[selectedCategory] || [];
        
        return (
            <div className="quiz-page" style={{ padding: '40px', overflowY: 'auto' }}>
                <div style={{ maxWidth: '1200px', width: '100%' }}>
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1rem', cursor: 'pointer', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-arrow-left"></i> Retour aux catégories
                    </button>
                    
                    <header style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <i className={getCategoryColor(selectedCategory).icon} style={{ color: '#6366f1' }}></i> 
                            Quiz {selectedCategory}
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Sélectionnez un quiz pour commencer</p>
                    </header>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {catQuizzes.map(q => (
                            <div key={q.id} style={{
                                background: '#1a1f2e',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                cursor: 'pointer'
                            }}
                            className="quiz-card-hover"
                            onClick={() => startQuiz(q.id)}
                            >
                                <h3 style={{ fontSize: '1.3rem', color: '#f1f5f9', margin: '0 0 10px 0' }}>{q.title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', flex: 1, margin: 0, lineHeight: '1.5' }}>
                                    {q.description || "Aucune description disponible pour ce quiz."}
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                                    <span style={{ 
                                        background: 'rgba(16, 185, 129, 0.1)', 
                                        color: '#34d399', 
                                        padding: '6px 12px', 
                                        borderRadius: '8px', 
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        <i className="fas fa-bullseye"></i> Score requis: {q.passing_score}%
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600' }}>
                                        <i className="fas fa-stopwatch"></i> {q.time_limit} min
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // MODE: PLAY ACTIVE QUIZ
    if (loading || !quizData) {
        return (
            <div className="quiz-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Préparation du quiz...
                </div>
            </div>
        );
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const letters = ['A', 'B', 'C', 'D'];

    return (
        <div className="quiz-page">
            <header className="quiz-header">
                <h1>{quizData.category} - {quizData.title}</h1>
                <div className="quiz-timer">
                    {formatTime(timeLeft)}
                </div>
            </header>

            <div className="quiz-card">
                <div className="quiz-progress-container">
                    <div className="quiz-progress-bar-bg">
                        <div 
                            className="quiz-progress-fill" 
                            style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
                        ></div>
                    </div>
                    <div className="quiz-progress-text">
                        {currentQuestionIndex + 1} / {quizData.questions.length}
                    </div>
                </div>

                <h2 className="quiz-question">{currentQuestion.text}</h2>

                <div className="quiz-options">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = answers[currentQuestion.id] === option.id;
                        return (
                            <div 
                                key={option.id} 
                                className={`quiz-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(option.id)}
                            >
                                <div className="option-letter">{letters[index]}</div>
                                <div className="option-text">{option.text}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="quiz-navigation">
                    {currentQuestionIndex > 0 ? (
                        <button className="btn-prev" onClick={handlePrev}>← Précédent</button>
                    ) : <div></div>}
                    
                    {currentQuestionIndex < quizData.questions.length - 1 ? (
                        <button className="btn-next" onClick={handleNext}>Suivant →</button>
                    ) : (
                        <button className="btn-finish" onClick={handleSubmit}>Terminer le quiz</button>
                    )}
                </div>
            </div>
        </div>
    );
}
