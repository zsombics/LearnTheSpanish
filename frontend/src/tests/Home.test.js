import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../components/mainComponents/Home';
import UserContext from '../UserContext';


describe('Home Komponens Tesztjei', () => {

    // Segédfüggvény a komponens rendereléséhez adott kontextus értékkel
    const renderWithContext = (userValue) => {
        return render(
            <UserContext.Provider value={{ user: userValue }}>
                <Home />
            </UserContext.Provider>
        );
    };

    test('1. Statikus tartalom helyes megjelenítése', () => {
        renderWithContext(null); // Rendereljük kijelentkezett felhasználóval

        // Fő címsorok ellenőrzése
        expect(screen.getByRole('heading', { name: /Lingua Hispanica/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Szolgáltatásaink/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Rólunk/i })).toBeInTheDocument();

        // Szolgáltatás elemek címsorainak ellenőrzése
        expect(screen.getByRole('heading', { name: /Interaktív Kvízek/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Modern Módszerek/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Közösségi Élmény/i })).toBeInTheDocument();

        // Képek ellenőrzése alt text alapján
        expect(screen.getAllByAltText('Service_image')).toHaveLength(3);
        expect(screen.getByAltText('up_arrow')).toBeInTheDocument();

        // Rövid szövegrészletek ellenőrzése
        expect(screen.getByText(/mutat vitam tuam/i)).toBeInTheDocument();
        expect(screen.getByText(/Platformunk modern eszközöket kínál/i)).toBeInTheDocument();
        expect(screen.getByText(/A Spanyol Oktató Program egy innovatív online platform/i)).toBeInTheDocument();
    });

    test('2. "Csatlakozz hozzánk" gomb megjelenik kijelentkezett felhasználónál', () => {
        renderWithContext(null); // Kijelentkezett állapot

        // Keressük a linket
        const joinButton = screen.getByRole('link', { name: /Csatlakozz hozzánk/i });
        expect(joinButton).toBeInTheDocument();

        // Ellenőrizzük az URL-t
        expect(joinButton).toHaveAttribute('href', '/regisztracio');

        // Biztosítjuk, hogy a másik gomb nincs jelen
        expect(screen.queryByRole('link', { name: /Kezdjen el tanulni/i })).not.toBeInTheDocument();
    });

    test('3. "Kezdjen el tanulni" gomb megjelenik bejelentkezett felhasználónál', () => {
        const loggedInUser = { username: 'tesztelo', id: '123' };
        renderWithContext(loggedInUser); // Bejelentkezett állapot

        // Keressük a másik linket a szövege alapján
        const startLearningButton = screen.getByRole('link', { name: /Kezdjen el tanulni/i });
        expect(startLearningButton).toBeInTheDocument();

        // Ellenőrizzük az URL-t
        expect(startLearningButton).toHaveAttribute('href', '/kviz');

        // Biztosítjuk, hogy a kijelentkezett gomb nincs jelen
        expect(screen.queryByRole('link', { name: /Csatlakozz hozzánk/i })).not.toBeInTheDocument();
    });

});