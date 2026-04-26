import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const API = "http://127.0.0.1:8000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

// Load & validate user from localStorage
  useEffect(() => {
    const validateToken = async () => {
      // Check if there's a token in the URL (from Google Auth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      if (urlToken) {
        localStorage.setItem("token", urlToken);
        // Clear token from URL so it's not visible
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          const res = await fetch(`${API}/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Invalid token, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          // Network error, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        credentials: remember ? 'include' : 'omit',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password, remember })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.message || data.error || "Login failed"
        };
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      setUser(data.user);
      navigate('/dashboard');
      return { success: true, user: data.user };

    } catch (error) {
      return {
        success: false,
        error: "Network error"
      };
    }
  };

  const register = async (prenom, nom, email, password, password_confirmation) => {
    try {
      const fullName = `${prenom} ${nom}`.trim();
      
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          prenom, 
          nom, 
          name: fullName, 
          email, 
          password, 
          password_confirmation 
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.message || data.error || "Register failed"
        };
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setUser(data.user);
      navigate('/profile');
      return { success: true, user: data.user };

    } catch (error) {
      return {
        success: false,
        error: "Network error"
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

