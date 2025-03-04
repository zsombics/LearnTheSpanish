import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../UserContext';
import '../styles/Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/auth/register', { name, email, password })
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
        alert('Hiba történt a regisztráció során');
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-text">
        <h1>Üdvözöl a Spanyol Oktató Program!</h1>
        <p>
          Csatlakozz hozzánk, hogy interaktív módon tanulhass spanyolul, és élvezhesd a modern tanulási módszerek előnyeit!
        </p>
      </div>
      <div className="auth-form">
        <h2>Regisztráció</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Teljes név"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Regisztráció</button>
        </form>
        <p className="auth-link">
          Már van fiókod? <Link to="/bejelentkezes">Bejelentkezés</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
