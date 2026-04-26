import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API = "http://127.0.0.1:8000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("L'email de récupération a été envoyé ! Vérifiez votre boîte de réception (ou vos spams). Si vous testez en local, vérifiez storage/logs/laravel.log");
      } else {
        setError(data.error || data.message || "Erreur lors de l'envoi de l'email.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-branding">
        <div className="brand-content">
          <div className="brand-logo">
            <div className="brand-logo-icon"><i className="fas fa-graduation-cap"></i></div>
            <span>Skill2Future</span>
          </div>
          <h1 className="brand-title">Mot de passe oublié ?</h1>
          <p className="brand-subtitle">Pas de panique ! Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Récupération</h1>
            <p className="auth-form-subtitle">Entrez l'email associé à votre compte</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Adresse email</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  className="form-control has-icon" 
                  placeholder="vous@exemple.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className={`auth-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              <i className="fas fa-paper-plane"></i> {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
          
          <p className="auth-form-footer" style={{ marginTop: '20px' }}>
            Je m'en souviens finalement ! <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Retour à la connexion</a>
          </p>
        </div>
      </div>
    </div>
  );
}
