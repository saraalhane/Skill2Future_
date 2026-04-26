import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const API = 'http://127.0.0.1:8000/api/auth';

const BADGE_CONFIG = {
  Diamond:  { icon: 'fas fa-gem',    color: '#a5b4fc', bg: 'rgba(99,102,241,0.18)'  },
  Platinum: { icon: 'fas fa-shield', color: '#e2e8f0', bg: 'rgba(226,232,240,0.12)' },
  Gold:     { icon: 'fas fa-trophy', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)'  },
  Silver:   { icon: 'fas fa-medal',  color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  Bronze:   { icon: 'fas fa-award',  color: '#d97706', bg: 'rgba(217,119,6,0.12)'   },
  Member:   { icon: 'fas fa-user',   color: '#64748b', bg: 'rgba(100,116,139,0.1)'  },
};

const PODIUM_COLORS = {
  1: { outer: '#fbbf24', inner: 'linear-gradient(135deg,#f59e0b,#fbbf24)', glow: 'rgba(251,191,36,0.45)', label: '🥇' },
  2: { outer: '#94a3b8', inner: 'linear-gradient(135deg,#64748b,#94a3b8)', glow: 'rgba(148,163,184,0.35)', label: '🥈' },
  3: { outer: '#d97706', inner: 'linear-gradient(135deg,#b45309,#d97706)', glow: 'rgba(217,119,6,0.35)',   label: '🥉' },
};

// A palette of colors assigned to users by index
const AVATAR_COLORS = ['#6366f1','#8b5cf6','#f59e0b','#ec4899','#3b82f6','#10b981','#14b8a6','#f97316','#a855f7','#64748b'];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank]           = useState(null);
  const [myXp, setMyXp]               = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [period, setPeriod]           = useState('month');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Impossible de charger le classement.');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
      setMyRank(data.my_rank);
      setMyXp(data.my_xp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#6366f1', marginBottom: 12 }}></i>
          <p>Chargement du classement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: 12 }}></i>
          <p>{error}</p>
          <button onClick={fetchLeaderboard} style={{ marginTop: 12, padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const me = leaderboard.find(p => p.is_me);
  const nextAbove = myRank > 1 ? leaderboard.find(p => p.rank === myRank - 1) : null;

  return (
    <div className="leaderboard-page">
      <header className="lb-header">
        <div className="lb-header-left">
          <h1><i className="fas fa-trophy"></i> Classement</h1>
          <p>Comparez votre progression et grimpez dans le classement !</p>
        </div>
        <div className="lb-period-tabs">
          {['week', 'month', 'all'].map(p => (
            <button
              key={p}
              className={`period-tab ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'week' ? 'Cette semaine' : p === 'month' ? 'Ce mois' : 'Tout temps'}
            </button>
          ))}
        </div>
      </header>

      {/* My rank banner — only if user is in the list */}
      {me && (
        <div className="my-rank-banner">
          <div className="my-rank-left">
            <div className="my-rank-avatar" style={{ background: AVATAR_COLORS[(me.rank - 1) % AVATAR_COLORS.length] }}>
              {me.avatar}
            </div>
            <div>
              <span className="my-rank-label">Votre position</span>
              <strong className="my-rank-num">#{me.rank}</strong>
            </div>
          </div>
          <div className="my-rank-stats">
            <div className="my-stat"><i className="fas fa-star" style={{ color: '#fbbf24' }}></i><span>{me.xp.toLocaleString()} XP</span></div>
            <div className="my-stat"><i className="fas fa-fire" style={{ color: '#f97316' }}></i><span>{me.streak} jours</span></div>
            <div className="my-stat"><i className="fas fa-check-circle" style={{ color: '#10b981' }}></i><span>{me.quizzes} quiz</span></div>
          </div>
          <div className="my-rank-cta">
            {nextAbove
              ? <span>Encore <strong>{(nextAbove.xp - me.xp).toLocaleString()} XP</strong> pour atteindre le rang #{myRank - 1}</span>
              : <span>🏆 Vous êtes en tête du classement !</span>
            }
          </div>
        </div>
      )}

      {/* Podium — only when 3+ users exist */}
      {top3.length >= 3 && (
        <div className="podium-section">
          {[top3[1], top3[0], top3[2]].map((player, idx) => {
            const posMap = [2, 1, 3];
            const pos    = posMap[idx];
            const p      = PODIUM_COLORS[pos];
            const badge  = BADGE_CONFIG[player.badge] || BADGE_CONFIG.Member;
            const color  = AVATAR_COLORS[(player.rank - 1) % AVATAR_COLORS.length];
            return (
              <div key={player.id} className={`podium-slot rank-${pos}`}>
                <div className="podium-avatar-wrap" style={{ boxShadow: `0 0 0 4px ${p.outer}, 0 8px 30px ${p.glow}` }}>
                  <div className="podium-avatar" style={{ background: color }}>{player.avatar}</div>
                </div>
                <div className="podium-medal">{p.label}</div>
                <div className="podium-name">{player.prenom}</div>
                <div className="podium-xp"><i className="fas fa-star"></i> {player.xp.toLocaleString()} XP</div>
                <div className="podium-badge" style={{ background: badge.bg, color: badge.color }}>
                  <i className={badge.icon}></i> {player.badge}
                </div>
                <div className="podium-block" style={{ background: p.inner, height: pos === 1 ? 90 : pos === 2 ? 66 : 48 }}></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {leaderboard.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.3 }}></i>
          <p>Aucun apprenant dans le classement pour l'instant.<br />Complétez des leçons et des quiz pour apparaître ici !</p>
        </div>
      )}

      {/* Full ranking list */}
      {leaderboard.length > 0 && (
        <div className="ranking-list">
          <div className="ranking-list-header">
            <span className="col-rank">Rang</span>
            <span className="col-player">Apprenant</span>
            <span className="col-xp">XP</span>
            <span className="col-quiz">Quiz</span>
            <span className="col-badge">Badge</span>
          </div>

          {leaderboard.map((player) => {
            const badge = BADGE_CONFIG[player.badge] || BADGE_CONFIG.Member;
            const color = AVATAR_COLORS[(player.rank - 1) % AVATAR_COLORS.length];
            return (
              <div key={player.id} className={`ranking-row ${player.is_me ? 'is-me' : ''}`}>
                <div className="col-rank">
                  {player.rank <= 3
                    ? <span className="rank-medal">{PODIUM_COLORS[player.rank].label}</span>
                    : <span className="rank-num">#{player.rank}</span>
                  }
                </div>
                <div className="col-player">
                  <div className="player-avatar" style={{ background: color }}>{player.avatar}</div>
                  <div className="player-name-block">
                    <span className="player-name">{player.name}</span>
                    {player.is_me && <span className="you-tag">Vous</span>}
                  </div>
                </div>
                <div className="col-xp">
                  <i className="fas fa-star xp-star"></i>
                  {player.xp.toLocaleString()}
                </div>
                <div className="col-quiz">{player.quizzes}</div>
   
                <div className="col-badge">
                  <span className="badge-chip" style={{ background: badge.bg, color: badge.color }}>
                    <i className={badge.icon}></i> {player.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
