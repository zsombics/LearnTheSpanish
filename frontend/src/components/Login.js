import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../UserContext';
import 'D:/LearnTheSpanish/frontend/src/styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/auth/login', { email, password })
      .then((res) => {
        // Felhasználói adatok lekérdezése
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

  return (
    <div className="auth-container">
      <div className="auth-text">
        <h1>Üdvözöl a Spanyol Oktató Program!</h1>
        <p>
          Tanulj spanyolul élményszerűen, interaktív kvízekkel és modern tanulási módszerekkel.
          Jelentkezz be, hogy személyre szabott tanulási élményben lehess részed!
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
          <p className="auth-link">
            Nincs még fiókod? <Link to="/regisztracio">Regisztráció</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
