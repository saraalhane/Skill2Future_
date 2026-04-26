import React, { useState, useEffect } from 'react';
import './Notifications.css';

export default function Notifications() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/announcements", {
                headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
            });
            if (res.ok) {
                setAnnouncements(await res.json());
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="notifications-page"><div className="loading-state">Chargement des notifications...</div></div>;

    return (
        <div className="notifications-page">
            <header className="page-header">
                <h1>Notifications & Annonces</h1>
                <p>Restez informé des dernières nouveautés et mises à jour de Skill2Future.</p>
            </header>

            <div className="notifications-list">
                {announcements.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-bell-slash"></i>
                        <p>Vous n'avez aucune nouvelle notification.</p>
                    </div>
                ) : (
                    announcements.map((ann, index) => {
                        const isUrgent = ann.type === 'urgent';
                        const isSuccess = ann.type === 'success';
                        const isWarning = ann.type === 'warning';
                        
                        let icon = 'fa-info-circle';
                        let colorClass = 'info';
                        
                        if (isUrgent) { icon = 'fa-exclamation-circle'; colorClass = 'urgent'; }
                        else if (isSuccess) { icon = 'fa-check-circle'; colorClass = 'success'; }
                        else if (isWarning) { icon = 'fa-exclamation-triangle'; colorClass = 'warning'; }

                        return (
                            <div key={ann.id} className={`notification-card ${colorClass}`}>
                                <div className="notification-icon">
                                    <i className={`fas ${icon}`}></i>
                                </div>
                                <div className="notification-content">
                                    <div className="notification-header">
                                        <h3>{ann.title}</h3>
                                        <span className="notification-date">{new Date(ann.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="notification-message">{ann.message}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
