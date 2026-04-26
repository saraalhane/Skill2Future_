import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
    const { user, logout } = useAuth();

    const getInitials = () => {
        if (user && user.name) {
            const parts = user.name.split(' ');
            if (parts.length > 1) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return parts[0].substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    const getFirstName = () => {
        if (user && user.prenom) return user.prenom;
        if (user && user.name) return user.name.split(' ')[0];
        return 'Utilisateur';
    }

    const getLastName = () => {
        if (user && user.nom) return user.nom;
        if (user && user.name && user.name.split(' ').length > 1) return user.name.split(' ').slice(1).join(' ');
        return '';
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="brand-logo-icon"><i className="fas fa-graduation-cap"></i></div>
                <span className="brand-text">Skill2Future</span>
            </div>

            <div className="sidebar-menu">
                <div className="menu-group">
                    <h3 className="menu-group-title">PRINCIPAL</h3>
                    <NavLink to="/dashboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-th-large"></i> Tableau de bord
                    </NavLink>
                    <NavLink to="/learning" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-book"></i> Apprentissage
                    </NavLink>
                    <NavLink to="/quiz" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-question-circle"></i> Quiz
                    </NavLink>
                    <NavLink to="/results" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-chart-bar"></i> Résultats
                    </NavLink>
                    <NavLink to="/notifications" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-bell"></i> Notifications
                    </NavLink>
                </div>

                <div className="menu-group">
                    <h3 className="menu-group-title">RESSOURCES</h3>
                    <NavLink to="/resources" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-folder"></i> Ressources
                    </NavLink>
                    <NavLink to="/certifications" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-certificate"></i> Certifications
                    </NavLink>
                    <NavLink to="/leaderboard" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-trophy"></i> Classement
                    </NavLink>
                </div>

                <div className="menu-group">
                    <h3 className="menu-group-title">COMPTE</h3>
                    <NavLink to="/profile" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-user"></i> Profil
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                        <i className="fas fa-cog"></i> Paramètres
                    </NavLink>
                </div>

                {user?.role === 'admin' && (
                    <div className="menu-group">
                        <h3 className="menu-group-title">ADMINISTRATION</h3>
                        <NavLink to="/admin-dashboard" className={({ isActive }) => `menu-item admin-link ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-shield-alt"></i> Admin Panel
                        </NavLink>
                    </div>
                )}
            </div>

            <div className="sidebar-footer">
                <div className="user-profile-summary">
                    <div className="user-avatar-mini">{getInitials()}</div>
                    <div className="user-details-mini">
                        <span className="user-fullname">{getFirstName()} {getLastName()}</span>
                        <span className="user-role">{user?.role === 'admin' ? 'Administrateur' : 'Apprenante'}</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={logout} title="Se déconnecter">
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </aside>
    );
}
