import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../UserContext';
import '../../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/auth/login', { email, password })
      .then((res) => {
        axios.get('/api/auth/profile')
          .then((res) => {
            setUser(res.data);
            navigate('/profil');
          });
      })
      .catch((err) => {
        console.error(err.response.data);
        alert('Hibás email vagy jelszó');
      });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/request-password-reset', {
        email: forgotPasswordEmail
      });

      if (response.data.success) {
        setForgotPasswordMessage('Email elküldve! Kérjük ellenőrizd a postaládád.');
        setTimeout(() => {
          setIsForgotPasswordModalOpen(false);
          setForgotPasswordEmail('');
          setForgotPasswordMessage('');
        }, 5000);
      }
    } catch (error) {
      setForgotPasswordMessage('Hiba történt az email küldése során.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetPasswordMessage('Az új jelszavak nem egyeznek!');
      return;
    }

    try {
      const response = await axios.put(`/api/auth/reset-password/${resetToken}`, {
        password: newPassword
      });

      if (response.data.success) {
        setResetPasswordMessage('Jelszó sikeresen módosítva! Most már bejelentkezhetsz az új jelszóval.');
        setTimeout(() => {
          setIsResetPasswordModalOpen(false);
          setNewPassword('');
          setConfirmPassword('');
        }, 3000);
      }
    } catch (error) {
      setResetPasswordMessage('Hiba történt a jelszó módosítása során.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-text">
        <h1>Üdvözöl a Spanyol Oktató Program!</h1>
        <p>
          Tanulj spanyolul élményszerűen, interaktív kvízekkel és modern tanulási módszerekkel.
          Jelentkezz be, hogy személyre szabott tanulási élményben legyen részed!
        </p>
      </div>
      <div className="auth-form">
        <div className="forms">
          <h2>Bejelentkezés</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Bejelentkezés</button>
          </form>
          <div className="auth-links">
            <p className="auth-link">
              Nincs még fiókod? <Link to="/regisztracio">Regisztráció</Link>
            </p>
            <p className="auth-link">
              <span className="forgot-password-text">
                Elfelejtetted a jelszavad? <span className="forgot-password-link" onClick={() => setIsForgotPasswordModalOpen(true)}>Kattints ide</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Elfelejtett jelszó modal */}
      {isForgotPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsForgotPasswordModalOpen(false)}>×</button>
            <h3>Elfelejtett jelszó</h3>
            <p>Add meg az email címed, és küldünk egy linket a jelszó visszaállításához.</p>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email cím"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />
              {forgotPasswordMessage && (
                <p className={`message ${forgotPasswordMessage.includes('Hiba') ? 'error' : 'success'}`}>
                  {forgotPasswordMessage}
                </p>
              )}
              <div className="button-container">
                <button type="submit" className="submit-button">Küldés</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jelszó visszaállítás modal */}
      {isResetPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Új jelszó beállítása</h3>
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                placeholder="Új jelszó"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Új jelszó megerősítése"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {resetPasswordMessage && (
                <p className={`message ${resetPasswordMessage.includes('Hiba') ? 'error' : 'success'}`}>
                  {resetPasswordMessage}
                </p>
              )}
              <div className="modal-buttons">
                <button type="submit" className="submit-button">Módosítás</button>
                <button 
                  type="button" 
                  className="close-button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                >
                  Mégse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
