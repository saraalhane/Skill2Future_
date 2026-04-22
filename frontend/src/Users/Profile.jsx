import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        bio: '',
        objectif: 'Devenir développeur Full Stack'
    });

    // Update form data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                prenom: user.prenom || (user.name ? user.name.split(' ')[0] : ''),
                nom: user.nom || (user.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : ''),
                email: user.email || '',
                bio: user.bio || 'Passionnée par le développement web, je souhaite devenir développeuse Full Stack.',
                objectif: user.objectif || 'Devenir développeur Full Stack'
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                alert("Profil mis à jour avec succès!");
            } else {
                alert("Erreur: " + (data.message || data.error));
            }
        } catch (err) {
            alert("Erreur de connexion.");
        }
    };

    const getInitials = () => {
        if (user && user.name) {
            const parts = user.name.split(' ');
            if (parts.length > 1) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return parts[0].substring(0, 2).toUpperCase();
        }
        return 'SD'; // Fallback to SD if no user
    };

    return (
        <div className="profile-container">
            {/* Banner */}
            <div className="profile-banner">
                <div className="banner-content">
                    <div className="avatar-circle">
                        {getInitials()}
                    </div>
                    <div className="user-info">
                        <h1 className="user-name">{formData.prenom} {formData.nom}</h1>
                        <p className="user-email">{formData.email}</p>
                        <div className="user-badges">
                            <span className="badge-item"><i className="fas fa-fire"></i> 12 jours consécutifs</span>
                            <span className="badge-item"><i className="fas fa-star"></i> Niveau Intermédiaire</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-grid">
                {/* Left Column */}
                <div className="profile-main">
                    {/* Edit Profile Card */}
                    <div className="card edit-profile-card">
                        <h2 className="card-title">Modifier le profil</h2>
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group-profile">
                                <label>Prénom</label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-profile">
                                <label>Nom</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-profile">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="form-group-profile">
                                <label>Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} className="form-control" rows="3"></textarea>
                            </div>
                            <div className="form-group-profile">
                                <label>Objectif</label>
                                <select name="objectif" value={formData.objectif} onChange={handleChange} className="form-control dropdown">
                                    <option value="Devenir développeur Full Stack">Devenir développeur Full Stack</option>
                                    <option value="Maîtriser le Front-End">Maîtriser le Front-End</option>
                                    <option value="Apprendre le Back-End">Apprendre le Back-End</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary">
                                <i className="fas fa-save"></i> Enregistrer
                            </button>
                        </form>
                    </div>

                    {/* Competences Card */}
                    <div className="card competences-card">
                        <div className="card-header-flex">
                            <h2 className="card-title">Compétences</h2>
                            <button className="btn-outline">Ajouter</button>
                        </div>

                        <div className="skill-item">
                            <div className="skill-info">
                                <span>HTML5</span>
                                <span>85%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <div className="skill-info">
                                <span>CSS3</span>
                                <span>70%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <div className="skill-info">
                                <span>JavaScript</span>
                                <span>45%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div className="skill-item">
                            <div className="skill-info">
                                <span>Python</span>
                                <span>30%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="profile-sidebar">
                    {/* Stats Card */}
                    <div className="card stats-card">
                        <h2 className="card-title">Statistiques</h2>
                        <div className="stat-list">
                            <div className="stat-item">
                                <div className="stat-label">
                                    <i className="fas fa-book" style={{ color: '#0d6efd' }}></i> Leçons
                                </div>
                                <div className="stat-val">24</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">
                                    <i className="fas fa-question-circle" style={{ color: '#198754' }}></i> Quiz
                                </div>
                                <div className="stat-val">18</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">
                                    <i className="fas fa-fire" style={{ color: '#ffc107' }}></i> Jours consécutifs
                                </div>
                                <div className="stat-val">12</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">
                                    <i className="fas fa-certificate" style={{ color: '#0dcaf0' }}></i> Certificats
                                </div>
                                <div className="stat-val">1</div>
                            </div>
                        </div>
                    </div>

                    {/* Badges Card */}
                    <div className="card badges-card">
                        <h2 className="card-title">Badges</h2>
                        <div className="badges-grid">
                            <div className="badge-box">
                                <div className="badge-icon" style={{ backgroundColor: '#fff3cd', color: '#ffc107' }}>
                                    <i className="fas fa-trophy"></i>
                                </div>
                                <span>Premier Quiz</span>
                            </div>
                            <div className="badge-box">
                                <div className="badge-icon" style={{ backgroundColor: '#e2e3e5', color: '#6c757d' }}>
                                    <i className="fas fa-fire"></i>
                                </div>
                                <span>Série 7 jours</span>
                            </div>
                            <div className="badge-box">
                                <div className="badge-icon" style={{ backgroundColor: '#f8d7da', color: '#d9534f' }}>
                                    <i className="fas fa-star"></i>
                                </div>
                                <span>5 Quiz</span>
                            </div>
                            <div className="badge-box locked">
                                <div className="badge-icon">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <span>Verrouillé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
