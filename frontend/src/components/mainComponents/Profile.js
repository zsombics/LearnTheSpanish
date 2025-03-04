// frontend/src/components/Profile.js
import React, { useContext } from 'react';
import UserContext from '../../UserContext';

function Profile() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>Kérjük, jelentkezz be a profilod megtekintéséhez.</p>;
  }

  return (
    <div className="profile">
      <h2>Profil</h2>
      <p>Név: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* További felhasználói adatok megjelenítése */}
      {/* Eredmények megjelenítése, ha vannak */}
      {user.results && user.results.length > 0 ? (
        <div>
          <h3>Eredményeid:</h3>
          <ul>
            {user.results.map((result, index) => (
              <li key={index}>
                Dátum: {new Date(result.date).toLocaleDateString()} - Pontszám: {result.score}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Még nincsenek eredményeid.</p>
      )}
    </div>
  );
}

export default Profile;
