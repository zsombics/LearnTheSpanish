import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Az új jelszavak nem egyeznek!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, {
        password: newPassword
      });

      if (response.data.success) {
        setMessage('Jelszó sikeresen módosítva! Átirányítás a bejelentkezési oldalra...');
        setTimeout(() => {
          navigate('/bejelentkezes');
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Hiba történt a jelszó visszaállítása során.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="forms">
          <h2>Új jelszó beállítása</h2>
          <form onSubmit={handleSubmit}>
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
            {message && (
              <p className={`message ${message.includes('sikeresen') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Feldolgozás...' : 'Jelszó módosítása'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword; 