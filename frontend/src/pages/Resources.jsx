import React from 'react';
import './Resources.css';

export default function Resources() {
    return (
        <div className="resources-page">
            <header className="page-header">
                <h1>Ressources</h1>
                <div className="notification-icon">
                    <i className="fas fa-bell"></i>
                    <span className="badge">3</span>
                </div>
            </header>

            <div className="resources-content">
                {/* Filters and Search */}
                <div className="filters-section">
                    <div className="filter-pills">
                        <button className="pill active">Tous</button>
                        <button className="pill">Vidéos</button>
                        <button className="pill">Articles</button>
                        <button className="pill">Exercices</button>
                        <button className="pill">Projets</button>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="Rechercher..." />
                    </div>
                </div>

                {/* Resource Cards Grid */}
                <div className="resources-grid">
                    {/* Card 1 */}
                    <a href="https://www.youtube.com/watch?v=kUMe1FH4CGY" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-top-content">
                            <div className="resource-icon" style={{ backgroundColor: '#ef5350' }}>
                                <i className="fas fa-play"></i>
                            </div>
                            <div className="resource-details">
                                <h3>Tutoriel complet HTML5</h3>
                                <p>Apprenez les bases du HTML5 dans ce cours complet de 2 heures.</p>
                                <div className="resource-meta">
                                    <span><i className="far fa-clock"></i> 2h</span>
                                    <span><i className="far fa-eye"></i> 15K</span>
                                    <span><i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.8</span>
                                </div>
                                <div className="resource-tags">
                                    <span className="tag">HTML</span>
                                    <span className="tag">Débutant</span>
                                    <span className="tag">Vidéo</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Card 2 */}
                    <a href="https://developer.mozilla.org/fr/docs/Web/CSS" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-top-content">
                            <div className="resource-icon" style={{ backgroundColor: '#2196f3' }}>
                                <i className="fas fa-book"></i>
                            </div>
                            <div className="resource-details">
                                <h3>Guide CSS3 Avancé</h3>
                                <p>Maîtrisez Flexbox, Grid et les animations CSS.</p>
                                <div className="resource-meta">
                                    <span><i className="far fa-file-alt"></i> 50 pages</span>
                                    <span><i className="fas fa-download"></i> 8K</span>
                                    <span><i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.9</span>
                                </div>
                                <div className="resource-tags">
                                    <span className="tag">CSS</span>
                                    <span className="tag">Avancé</span>
                                    <span className="tag">PDF</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Card 3 */}
                    <a href="https://www.w3schools.com/js/js_exercises.asp" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-top-content">
                            <div className="resource-icon" style={{ backgroundColor: '#4caf50' }}>
                                <i className="fas fa-code"></i>
                            </div>
                            <div className="resource-details">
                                <h3>50 Exercices JavaScript</h3>
                                <p>Pratiquez JavaScript avec 50 exercices corrigés.</p>
                                <div className="resource-meta">
                                    <span><i className="fas fa-list-ol"></i> 50 exercices</span>
                                    <span><i className="far fa-check-circle"></i> Corrigés</span>
                                    <span><i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.7</span>
                                </div>
                                <div className="resource-tags">
                                    <span className="tag">JavaScript</span>
                                    <span className="tag">Intermédiaire</span>
                                    <span className="tag">Exercices</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Card 4 */}
                    <a href="https://www.freecodecamp.org/news/ecommerce-website-html-css-javascript/" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-top-content">
                            <div className="resource-icon" style={{ backgroundColor: '#9c27b0' }}>
                                <i className="fas fa-laptop-code"></i>
                            </div>
                            <div className="resource-details">
                                <h3>Projet: Site E-commerce</h3>
                                <p>Créez un site e-commerce complet avec HTML, CSS et JS.</p>
                                <div className="resource-meta">
                                    <span><i className="far fa-clock"></i> 10h</span>
                                    <span><i className="fas fa-users"></i> 3K</span>
                                    <span><i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.9</span>
                                </div>
                                <div className="resource-tags">
                                    <span className="tag">Projet</span>
                                    <span className="tag">Avancé</span>
                                    <span className="tag">Full Stack</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Card 5 */}
                    <a href="https://www.youtube.com/watch?v=_uQrJ0TkZlc" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-top-content">
                            <div className="resource-icon" style={{ backgroundColor: '#ef5350' }}>
                                <i className="fas fa-play"></i>
                            </div>
                            <div className="resource-details">
                                <h3>Cours Python pour débutants</h3>
                                <p>Introduction à la programmation Python.</p>
                                <div className="resource-meta">
                                    <span><i className="far fa-clock"></i> 3h</span>
                                    <span><i className="far fa-eye"></i> 25K</span>
                                    <span><i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.9</span>
                                </div>
                                <div className="resource-tags">
                                    <span className="tag">Python</span>
                                    <span className="tag">Débutant</span>
                                    <span className="tag">Vidéo</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Card 6 */}
                    <a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener noreferrer" className="resource-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className="card-top-content">
                            <div className="resource-icon" style={{ backgroundColor: '#2196f3' }}>
                                <i className="fas fa-database"></i>
                            </div>
                            <div className="resource-details">
                                <h3>SQL: De zéro à héros</h3>
                                <p>Maîtrisez les bases de données relationnelles.</p>
                                <div className="resource-meta">
                                    <span><i className="far fa-file-alt"></i> 80 pages</span>
                                    <span><i className="fas fa-download"></i> 5K</span>
                                    <span><i className="fas fa-star" style={{ color: '#ffc107' }}></i> 4.6</span>
                                </div>
                                <div className="resource-tags">
                                    <span className="tag">SQL</span>
                                    <span className="tag">Intermédiaire</span>
                                    <span className="tag">PDF</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <button className="page-nav"><i className="fas fa-chevron-left"></i></button>
                    <button className="page-num active">1</button>
                    <button className="page-num">2</button>
                    <button className="page-num">3</button>
                    <button className="page-num">4</button>
                    <button className="page-nav"><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    );
}
