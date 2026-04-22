import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'sent'

  const API = "http://127.0.0.1:8000/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Email envoyé ! Vérifiez votre boîte de réception.');
        setStep('sent');
      } else {
        setMessage(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      setMessage('Erreur réseau');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mot de passe oublié ?</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="input-icon-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input 
                type="email" 
                className="form-control has-icon w-full" 
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {message && (
            <div className={`alert ${step === 'sent' ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 auth-submit"
            >
              {loading ? 'Envoi...' : 'Envoyer email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
