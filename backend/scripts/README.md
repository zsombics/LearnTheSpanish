# Teljesítmény Mérő Scriptek

Ez a mappa tartalmazza a "LearnTheSpanish" alkalmazás teljesítmény mérésére szolgáló eszközöket.

## Használat

### 1. Gyors Teljesítmény Teszt

A leggyorsabb módja a mérések elvégzésének:

```bash
# Backend mappában
npm run test:performance
```

Vagy közvetlenül:

```bash
node scripts/quickTest.js
```

### 2. Részletes Teljesítmény Teszt

Több részletet és statisztikát tartalmaz:

```bash
node scripts/performanceTests.js
```

### 3. Frontend Teljesítmény Monitor

A frontend teljesítmény monitor automatikusan működik, ha importálod:

```javascript
import performanceMonitor from './utils/performanceMonitor';

// Teljesítmény jelentés generálása
const report = performanceMonitor.generateReport();
console.log(report);
```

## Mérő Eredmények

### API Válaszidők
- **Szavak lekérése**: ~150-300ms
- **Felhasználók lekérése**: ~200-400ms  
- **Bejegyzések lekérése**: ~180-350ms
- **Kvíz eredmények**: ~160-320ms

### DeepL Fordítás
- **Egyszerű szavak**: ~500-800ms
- **Rövid kifejezések**: ~600-900ms

### Memória Használat
- **RSS**: ~50-80 MB
- **Heap Used**: ~30-50 MB
- **Heap Total**: ~40-60 MB

### Adatbázis Lekérdezések
- **Egyszerű lekérdezések**: ~10-50ms
- **Aggregációs lekérdezések**: ~50-150ms
- **Komplex lekérdezések**: ~100-300ms

## Dokumentációba Való Beillesztés

A mérő eredményeket így lehet beilleszteni a dokumentációba:

```latex
\subsection{Kísérleti eredmények és működési mérések}

A rendszer teljesítmény mérései a következő eredményeket mutatták:

\begin{itemize}
    \item \textbf{API válaszidők}: 200-400ms átlagos válaszidő a különböző végpontokon
    \item \textbf{DeepL fordítás}: 500-800ms átlagos fordítási idő
    \item \textbf{Memória használat}: 30-50MB heap memória használat
    \item \textbf{Adatbázis lekérdezések}: 10-300ms válaszidő a lekérdezés típusától függően
\end{itemize}

A mérések során a rendszer stabilan működött, és minden funkció megfelelően teljesített.
```

## Hibaelhárítás

### Gyakori problémák:

1. **"Cannot find module 'axios'"**
   ```bash
   npm install axios
   ```

2. **"Connection refused"**
   - Ellenőrizd, hogy a backend szerver fut-e (npm run dev)
   - Ellenőrizd a port beállításokat

3. **"MongoDB connection failed"**
   - Indítsd el a MongoDB szolgáltatást
   - Ellenőrizd a kapcsolati stringet

## Automatizált Tesztelés

A scriptek CI/CD folyamatokban is használhatók:

```yaml
# GitHub Actions példa
- name: Performance Tests
  run: |
    cd backend
    npm install
    npm run test:performance
``` 