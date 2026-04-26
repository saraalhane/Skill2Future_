import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell as BarCell, XAxis as BarXAxis, YAxis as BarYAxis, Tooltip as BarTooltip,
  PieChart, Pie, Cell as PieCell, Tooltip as PieTooltip
} from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchAnnouncements();
    }, []);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/dashboard", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            });
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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

    if (loading) return <div>Chargement du tableau de bord...</div>;
    if (!data) return <div>Erreur de chargement.</div>;

    const { stats, charts, recent_activity, recommendations } = data;
    const unreadCount = announcements.length;

    return (
        <div className="student-dashboard">
            <header className="dashboard-header">
                <h1>Tableau de bord</h1>
                <div className="header-actions">
                    <a href="/notifications" className="icon-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <i className="fas fa-bell"></i>
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </a>
                    <div className="icon-btn">
                        <i className="fas fa-envelope"></i>
                        <span className="badge">6</span>
                    </div>
                </div>
            </header>

            {/* Announcements Section */}
            {announcements.length > 0 && (
                <div className="announcements-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    {announcements.map(ann => (
                        <div key={ann.id} style={{ 
                            padding: '15px 20px', 
                            borderRadius: '12px', 
                            background: ann.type === 'urgent' ? '#fee2e2' : ann.type === 'success' ? '#dcfce7' : ann.type === 'warning' ? '#fef3c7' : '#e0e7ff',
                            borderLeft: `5px solid ${ann.type === 'urgent' ? '#ef4444' : ann.type === 'success' ? '#22c55e' : ann.type === 'warning' ? '#f59e0b' : '#6366f1'}`,
                            display: 'flex', gap: '15px', alignItems: 'flex-start' 
                        }}>
                            <i className={`fas fa-${ann.type === 'urgent' ? 'exclamation-circle' : ann.type === 'success' ? 'check-circle' : ann.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}`} 
                               style={{ color: ann.type === 'urgent' ? '#ef4444' : ann.type === 'success' ? '#22c55e' : ann.type === 'warning' ? '#f59e0b' : '#6366f1', fontSize: '1.5rem', marginTop: '3px' }}>
                            </i>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: '1rem', fontWeight: 'bold' }}>{ann.title}</h4>
                                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>{ann.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Top Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <i className="fas fa-book-open"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.lessons_completed}</h3>
                        <p>Leçons complétées</p>
                        <span className="trend-text positive"><i className="fas fa-arrow-up"></i> +3 cette semaine</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.quizzes_passed}</h3>
                        <p>Quiz réussis</p>
                        <span className="trend-text positive"><i className="fas fa-arrow-up"></i> +2 cette semaine</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon yellow">
                        <i className="fas fa-fire"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.consecutive_days}</h3>
                        <p>Jours consécutifs</p>
                        <span className="trend-text positive"><i className="fas fa-arrow-up"></i> Record personnel</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">
                        <i className="fas fa-trophy"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.average_score}%</h3>
                        <p>Moyenne générale</p>
                        <span className="trend-text positive"><i className="fas fa-arrow-up"></i> +5%</span>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="dashboard-main-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Progression globale</h3>
                        <select className="chart-select">
                            <option>Cette semaine</option>
                            <option selected>Ce mois</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts.global_progress} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12}} domain={[0, 100]} />
                                <LineTooltip />
                                <Line type="monotone" dataKey="value" stroke="#0d6efd" strokeWidth={3} dot={{r: 4, fill: '#0d6efd', strokeWidth: 2, stroke: 'white'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Compétences</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={charts.skills_radar}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6c757d', fontSize: 12 }} />
                                <Radar name="Niveau" dataKey="A" stroke="#0d6efd" fill="#0d6efd" fillOpacity={0.4} />
                                <LineTooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="dashboard-main-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Résultats des quiz</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.quiz_results} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
                                <BarXAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12}} />
                                <BarYAxis axisLine={false} tickLine={false} tick={{fill: '#adb5bd', fontSize: 12}} domain={[0, 100]} />
                                <BarTooltip cursor={{fill: '#f8f9fa'}} />
                                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                    {charts.quiz_results.map((entry, index) => (
                                        <BarCell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Activité récente</h3>
                    </div>
                    <div className="chart-container" style={{height: '250px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={charts.activity_doughnut}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {charts.activity_doughnut.map((entry, index) => (
                                        <PieCell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <PieTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="doughnut-legend">
                        {charts.activity_doughnut.map((item, index) => (
                            <div key={index} className="legend-item">
                                <div className="legend-color" style={{backgroundColor: item.fill}}></div>
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="dashboard-main-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Activité récente</h3>
                        <button className="btn-outline">Voir tout</button>
                    </div>
                    <div className="activity-list">
                        {recent_activity.map((item, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon" style={{backgroundColor: item.icon_bg, color: item.icon_color}}>
                                    <i className={item.icon}></i>
                                </div>
                                <div className="activity-details">
                                    <h4>{item.title}</h4>
                                    <p>{item.time}</p>
                                </div>
                                <div className="activity-badge" style={{backgroundColor: item.badge_color, color: item.badge_text_color}}>
                                    {item.badge}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card" style={{backgroundColor: 'transparent', boxShadow: 'none', padding: 0}}>
                    <div className="card-header" style={{padding: '0 10px'}}>
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fas fa-robot" style={{color: '#0d6efd'}}></i> Recommandations IA</h3>
                    </div>
                    <div className="recommendations-list">
                        {recommendations.map((rec, index) => (
                            <div key={index} className={`recommendation-card ${rec.type === 'improve' ? 'blue' : 'green'}`} style={{backgroundColor: 'white'}}>
                                <div className="rec-icon" style={{backgroundColor: rec.icon_bg, color: rec.icon_color}}>
                                    <i className={rec.icon}></i>
                                </div>
                                <h4>{rec.title}</h4>
                                <p>{rec.desc}</p>
                                <button className="btn-link" style={{color: rec.type === 'improve' ? '#0d6efd' : '#198754'}}>
                                    {rec.action} <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
