import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    const result = await register(formData.prenom, formData.nom, formData.email, formData.password, formData.password_confirmation);
    
    if (!result.success) {
      setError(result.error);
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
          <h1 className="brand-title">Commencez votre aventure</h1>
          <p className="brand-subtitle">Créez votre compte gratuit et lancez-vous dans l'apprentissage de la programmation avec un accompagnement personnalisé.</p>
          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon"><i className="fas fa-rocket"></i></div>
              <span className="brand-feature-text">Accès immédiat à tous les cours</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><i className="fas fa-chart-pie"></i></div>
              <span className="brand-feature-text">Analyse complète de vos compétences</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><i className="fas fa-award"></i></div>
              <span className="brand-feature-text">Certifications gratuites</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Créer un compte</h1>
            <p className="auth-form-subtitle">Rejoignez la communauté Skill2Future</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <div className="input-icon-wrapper">
                  <i className="fas fa-user input-icon"></i>
                  <input 
                    type="text" 
                    name="prenom"
                    className="form-control has-icon" 
                    placeholder="Votre prénom" 
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
              <label className="form-label">Nom</label>
                <input 
                  type="text" 
                  name="nom"
                  className="form-control" 
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />

              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Adresse email</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  name="email"
                  className="form-control has-icon" 
                  placeholder="vous@exemple.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  name="password"
                  className="form-control has-icon" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
              </div>
              <small style={{ color: 'var(--grey-500)', fontSize: '0.8rem' }}>Minimum 8 caractères</small>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer le mot de passe</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  name="password_confirmation"
                  className="form-control has-icon" 
                  placeholder="••••••••" 
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-check">
              <input type="checkbox" id="terms" required />
              <label className="form-check-label" htmlFor="terms">
                J'accepte les <a href="#">conditions d'utilisation</a> et la <a href="#">politique de confidentialité</a>
              </label>
            </div>
            <button type="submit" className={`auth-submit ${loading ? 'loading' : ''}`}>
              <i className="fas fa-user-plus"></i> Créer mon compte
            </button>
          </form>
          <div className="auth-divider">
            <div className="auth-divider-line"></div>
            <span className="auth-divider-text">ou</span>
            <div className="auth-divider-line"></div>
          </div>
          <div className="social-login">
            <button type="button" className="social-btn" onClick={() => window.location.href = 'http://127.0.0.1:8000/api/auth/google'}>
              <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="social-btn">
              <svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
          <p className="auth-form-footer">
            Vous avez déjà un compte ? <a href="/login">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
}

