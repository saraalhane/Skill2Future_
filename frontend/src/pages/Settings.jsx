import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

export default function Settings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        notifications_email: true,
        notifications_quiz: true,
        notifications_courses: false,
        public_profile: true,
        show_progress: true,
        language: 'fr',
        theme: 'light',
        timezone: 'Europe/Paris'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/settings", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    notifications_email: Boolean(data.notifications_email),
                    notifications_quiz: Boolean(data.notifications_quiz),
                    notifications_courses: Boolean(data.notifications_courses),
                    public_profile: Boolean(data.public_profile),
                    show_progress: Boolean(data.show_progress),
                    language: data.language || 'fr',
                    theme: data.theme || 'light',
                    timezone: data.timezone || 'Europe/Paris'
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (field) => {
        const newSettings = { ...settings, [field]: !settings[field] };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const handleChange = async (e) => {
        const newSettings = { ...settings, [e.target.name]: e.target.value };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const saveSettings = async (dataToSave) => {
        const token = localStorage.getItem("token");
        try {
            await fetch("http://127.0.0.1:8000/api/auth/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(dataToSave)
            });
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    if (loading) return <div>Chargement des paramètres...</div>;

    return (
        <div className="settings-page">
            <header className="settings-header">
                <h1>Paramètres</h1>
                <div className="notification-badge">
                    <i className="fas fa-bell" style={{ fontSize: '20px', color: '#6c757d' }}></i>
                    <span className="badge">3</span>
                </div>
            </header>

            <div className="settings-content">
                {/* Notifications */}
                <div className="settings-card">
                    <h2 className="card-title"><i className="fas fa-bell" style={{ color: '#0d6efd' }}></i> Notifications</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Notifications par email</h4>
                            <p>Recevoir des emails pour les mises à jour et rappels</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.notifications_email} onChange={() => handleToggle('notifications_email')} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Rappels de quiz</h4>
                            <p>Recevoir des rappels pour compléter vos quiz</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.notifications_quiz} onChange={() => handleToggle('notifications_quiz')} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Nouveaux cours</h4>
                            <p>Être notifié lors de la publication de nouveaux cours</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.notifications_courses} onChange={() => handleToggle('notifications_courses')} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                {/* Paramètres d'Administration (Seulement pour les Admins) */}
                {user?.role === 'admin' && (
                    <div className="settings-card" style={{ borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.02)' }}>
                        <h2 className="card-title" style={{ color: '#ef4444' }}><i className="fas fa-server"></i> Administration du Système</h2>
                        
                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Mode Maintenance</h4>
                                <p>Bloquer l'accès à la plateforme (sauf pour les admins)</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider" style={{ background: '#ef4444' }}></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Inscriptions Ouvertes</h4>
                                <p>Autoriser les nouveaux utilisateurs à créer des comptes</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Sauvegarde de la base de données</h4>
                                <p>Télécharger une copie complète de la base de données</p>
                            </div>
                            <button className="btn-action" style={{ background: '#10b981', color: '#fff', border: 'none' }}><i className="fas fa-database"></i> Sauvegarder</button>
                        </div>
                    </div>
                )}

                {/* Sécurité et Confidentialité */}
                <div className="settings-card">
                    <h2 className="card-title"><i className="fas fa-shield-alt" style={{ color: '#0d6efd' }}></i> Sécurité et Confidentialité</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Profil public</h4>
                            <p>Autoriser les autres utilisateurs à voir votre profil</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.public_profile} onChange={() => handleToggle('public_profile')} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Afficher le progrès</h4>
                            <p>Permettre la visibilité de votre progression</p>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={settings.show_progress} onChange={() => handleToggle('show_progress')} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Changer le mot de passe</h4>
                            <p>Modifier votre mot de passe</p>
                        </div>
                        <button className="btn-action"><i className="fas fa-key"></i> Changer</button>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Authentification à deux facteurs</h4>
                            <p>Ajouter une couche de sécurité supplémentaire</p>
                        </div>
                        <button className="btn-action"><i className="fas fa-lock"></i> Activer</button>
                    </div>
                </div>

                {/* Préférences */}
                <div className="settings-card">
                    <h2 className="card-title"><i className="fas fa-sliders-h" style={{ color: '#0d6efd' }}></i> Préférences</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Langue</h4>
                            <p>Choisir la langue de l'interface</p>
                        </div>
                        <select name="language" className="settings-select" value={settings.language} onChange={handleChange}>
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Thème</h4>
                            <p>Choisir le thème de l'interface</p>
                        </div>
                        <select name="theme" className="settings-select" value={settings.theme} onChange={handleChange}>
                            <option value="light">Clair</option>
                            <option value="dark">Sombre</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Fuseau horaire</h4>
                            <p>Pour les rappels et notifications</p>
                        </div>
                        <select name="timezone" className="settings-select" value={settings.timezone} onChange={handleChange}>
                            <option value="Europe/Paris">GMT+1 (Paris)</option>
                            <option value="GMT">GMT</option>
                        </select>
                    </div>
                </div>

                {/* Zone Dangereuse */}
                <div className="settings-card danger-zone">
                    <h2 className="card-title"><i className="fas fa-exclamation-triangle"></i> Zone Dangereuse</h2>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Exporter mes données</h4>
                            <p>Télécharger toutes vos données et progression</p>
                        </div>
                        <button className="btn-action"><i className="fas fa-download"></i> Exporter</button>
                    </div>

                    {user?.role !== 'admin' && (
                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Supprimer le compte</h4>
                                <p>Cette action est irréversible. Toutes vos données seront perdues.</p>
                            </div>
                            <button className="btn-danger"><i className="fas fa-trash-alt"></i> Supprimer</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
