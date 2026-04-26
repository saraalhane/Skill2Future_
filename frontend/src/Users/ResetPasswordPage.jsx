import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API = "http://127.0.0.1:8000/api/auth";
  
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError("Lien de réinitialisation invalide ou expiré.");
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Mot de passe réinitialisé avec succès ! Vous allez être redirigé vers la connexion...");
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || data.message || "Erreur lors de la réinitialisation du mot de passe.");
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
          <h1 className="brand-title">Nouveau mot de passe</h1>
          <p className="brand-subtitle">Choisissez un mot de passe fort et sécurisé pour votre compte.</p>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Réinitialisation</h1>
            <p className="auth-form-subtitle">Entrez votre nouveau mot de passe</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  className="form-control has-icon bg-gray-100" 
                  value={email || ''}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nouveau mot de passe</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  className="form-control has-icon" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                  disabled={!token || !email}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmez le mot de passe</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  className="form-control has-icon" 
                  placeholder="••••••••" 
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  minLength="8"
                  disabled={!token || !email}
                />
              </div>
            </div>
            
            <button type="submit" className={`auth-submit ${loading ? 'loading' : ''}`} disabled={loading || !token || !email}>
              <i className="fas fa-save"></i> {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
          
          <p className="auth-form-footer" style={{ marginTop: '20px' }}>
            <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Retour à la connexion</a>
          </p>
        </div>
      </div>
    </div>
  );
}
