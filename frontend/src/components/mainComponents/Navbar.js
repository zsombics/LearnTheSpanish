import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../UserContext';

function Navbar() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    axios.get('/api/auth/logout')
      .then(() => {
        setUser(null);
      })
      .catch((err) => {
        console.error(err.response.data);
      });
  };

  return (
    <nav className="navbar">
      <h1>Spanyol Oktató Program</h1>
      <ul>
        <li>
          <button><Link to="/">Kezdőlap</Link></button>  
        </li>
        {user ? (
          <>
            <li>
              <button><Link to="/profil">Profil</Link></button>  
            </li>
            <li>
              <button> <Link to="/kviz">Kvíz</Link> </button>
            </li>
            <li>
              <button onClick={handleLogout}><Link to="/">Kijelentkezés</Link></button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button><Link to="/bejelentkezes">Bejelentkezés</Link></button>  
            </li>
            <li>
              <button><Link to="/regisztracio">Regisztráció</Link></button>  
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
