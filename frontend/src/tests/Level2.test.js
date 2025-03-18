import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import NounQuiz from '../components/Levels/Level2';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const fakeCSV = `casa,feminine,casas,ház,house
niño,masculine,niños,fiú,child`;

describe('NounQuiz komponens tesztelése (MemoryRouter nélkül)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(fakeCSV)
      })
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('Kezdeti render: a teszt beállítási felület megjelenik', () => {
    render(<NounQuiz />);
    expect(screen.getByText(/Válaszd ki a teszt paramétereit/i)).toBeInTheDocument();
    expect(screen.getByText(/Hány kérdés legyen a tesztben\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Teszt típusa:/i)).toBeInTheDocument();
    expect(screen.getByText(/Teszt indítása/i)).toBeInTheDocument();
  });

  test('Teszt indítása után: a CSV betöltése és a kérdés megjelenése', async () => {
    render(<NounQuiz />);
    fireEvent.click(screen.getByText(/Teszt indítása/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Kezdés/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    fireEvent.click(screen.getByText(/Kezdés/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Betöltés.../i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      const questionHeading = screen.getByRole('heading', { level: 2 });
      expect(questionHeading).toBeInTheDocument();
      expect(questionHeading.textContent).toMatch(/Add meg a következő főnév többes számú alakját/i);
    }, { timeout: 3000 });
  });

  test('Interakció: válasz beírása és visszajelzés megjelenése', async () => {
    render(<NounQuiz />);
    
    fireEvent.click(screen.getByText(/Teszt indítása/i));
  
    await waitFor(() => expect(screen.getByText(/Kezdés/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Kezdés/i));
  
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
  
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'casas' } });
  
    expect(input.value).toBe('casas');
  
    fireEvent.click(screen.getByRole('button', { name: /Következő|Befejezés/i }));
  
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Helyes válasz!/i)).toBeInTheDocument();
    });
  });
});
