import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: 'fas fa-brain',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
    title: 'Apprentissage Adaptatif',
    desc: 'Notre IA analyse votre progression et personnalise chaque parcours pour maximiser votre apprentissage.'
  },
  {
    icon: 'fas fa-certificate',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Certifications Reconnues',
    desc: 'Obtenez des certificats valides dans l\'industrie et boostez votre carrière professionnelle.'
  },
  {
    icon: 'fas fa-trophy',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    title: 'Gamification & Classement',
    desc: 'Gagnez des XP, débloquez des badges et grimpez dans le classement pour rester motivé.'
  },
  {
    icon: 'fas fa-users',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
    title: 'Communauté Active',
    desc: 'Rejoignez des milliers d\'apprenants, partagez vos avancées et progressez ensemble.'
  },
  {
    icon: 'fas fa-chart-line',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
    title: 'Suivi en Temps Réel',
    desc: 'Des tableaux de bord interactifs pour visualiser votre progression et vos statistiques.'
  },
  {
    icon: 'fas fa-mobile-alt',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    title: 'Accessible Partout',
    desc: 'Apprenez depuis n\'importe quel appareil, à votre rythme, où que vous soyez.'
  }
];

const steps = [
  { num: '01', icon: 'fas fa-user-plus', title: 'Créez votre compte', desc: 'Inscrivez-vous gratuitement en quelques secondes et configurez votre profil.' },
  { num: '02', icon: 'fas fa-search', title: 'Choisissez vos cours', desc: 'Explorez notre catalogue riche et sélectionnez les formations qui correspondent à vos objectifs.' },
  { num: '03', icon: 'fas fa-graduation-cap', title: 'Apprenez & Certifiez-vous', desc: 'Suivez vos cours interactifs, passez vos quiz et obtenez vos certifications.' },
];

const stats = [
  { value: '12K+', label: 'Apprenants actifs' },
  { value: '250+', label: 'Cours disponibles' },
  { value: '98%', label: 'Taux de satisfaction' },
  { value: '40+', label: 'Experts formateurs' },
];

export default function Home() {
  const observerRef = useRef(null);

  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-nav">
        <div className="nav-brand">
          <i className="fas fa-graduation-cap"></i>
          <span>Skill2Future</span>
        </div>
        <div className="nav-links">
          <a href="#features">Fonctionnalités</a>
          <a href="#how-it-works">Comment ça marche</a>
          <a href="#stats">À propos</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-ghost">Se connecter</Link>
          <Link to="/register" className="btn-primary-nav">Commencer gratuitement</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-bolt"></i> Plateforme e-learning nouvelle génération
          </div>
          <h1 className="hero-title">
            Développez vos <span className="gradient-text">compétences</span><br />
            pour l'avenir digital
          </h1>
          <p className="hero-desc">
            Skill2Future est la plateforme d'apprentissage en ligne qui adapte chaque parcours
            à votre rythme. Des cours interactifs, des quiz intelligents et des certifications
            reconnues pour propulser votre carrière.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn-hero-primary">
              Commencer gratuitement <i className="fas fa-arrow-right"></i>
            </Link>
            <Link to="/login" className="btn-hero-ghost">
              <i className="fas fa-play-circle"></i> Voir une démo
            </Link>
          </div>
          <div className="hero-trust">
            <div className="avatars">
              {['A','B','C','D'].map((l,i) => (
                <div key={i} className="avatar-bubble" style={{background: ['#6366f1','#10b981','#f59e0b','#ec4899'][i]}}>{l}</div>
              ))}
            </div>
            <span>Rejoignez <strong>12 000+</strong> apprenants actifs</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card main-card">
            <div className="card-top">
              <div className="card-icon-wrap" style={{background:'rgba(99,102,241,0.15)'}}>
                <i className="fas fa-code" style={{color:'#6366f1'}}></i>
              </div>
              <span className="card-tag">Populaire</span>
            </div>
            <h3>Développement Web</h3>
            <p>React, Node.js, TypeScript</p>
            <div className="card-progress">
              <div className="progress-bar-mini">
                <div className="progress-fill-mini" style={{width:'68%'}}></div>
              </div>
              <span>68%</span>
            </div>
          </div>
          <div className="hero-card floating-card card-stat">
            <i className="fas fa-fire" style={{color:'#f59e0b'}}></i>
            <div>
              <strong>7 jours</strong>
              <small>Série consécutive</small>
            </div>
          </div>
          <div className="hero-card floating-card card-cert">
            <i className="fas fa-award" style={{color:'#10b981'}}></i>
            <div>
              <strong>Certificat obtenu!</strong>
              <small>JavaScript Avancé</small>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar" id="stats">
        {stats.map((s, i) => (
          <div key={i} className="stat-item animate-on-scroll">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">Fonctionnalités</span>
          <h2>Tout ce dont vous avez besoin<br />pour apprendre efficacement</h2>
          <p>Une plateforme complète conçue pour vous donner tous les outils nécessaires à votre réussite.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card animate-on-scroll" style={{'--delay': `${i * 0.08}s`}}>
              <div className="feature-icon" style={{background: f.bg, color: f.color}}>
                <i className={f.icon}></i>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="steps-section" id="how-it-works">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">Processus</span>
          <h2>Commencez en 3 étapes simples</h2>
          <p>Devenez opérationnel en moins de 5 minutes.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card animate-on-scroll" style={{'--delay': `${i * 0.1}s`}}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon">
                <i className={s.icon}></i>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section animate-on-scroll">
        <div className="cta-inner">
          <div className="cta-blobs">
            <div className="cta-blob cta-blob-1"></div>
            <div className="cta-blob cta-blob-2"></div>
          </div>
          <h2>Prêt à investir dans votre futur ?</h2>
          <p>Rejoignez des milliers d'apprenants qui transforment leur carrière avec Skill2Future.</p>
          <Link to="/register" className="btn-hero-primary">
            Créer mon compte gratuitement <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-brand">
          <i className="fas fa-graduation-cap"></i>
          <span>Skill2Future</span>
        </div>
        <p>© 2026 Skill2Future. Tous droits réservés.</p>
        <div className="footer-links">
          <Link to="/login">Connexion</Link>
          <Link to="/register">Inscription</Link>
        </div>
      </footer>
    </div>
  );
}
