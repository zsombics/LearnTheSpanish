# LearnTheSpanish: Interaktív, Gamifikált Spanyol Nyelvtanuló Platform

## Projekt áttekintés

A "LearnTheSpanish" egy interaktív, gamifikált webes platform, amelyet spanyol nyelvtanulók számára fejlesztettek ki egyetemi diplomadolgozat részeként. A projekt elsődleges célja, hogy modern webes technológiák és játékosító elemek segítségével támogassa a felhasználókat a spanyol nyelv hatékony elsajátításában, különös tekintettel a motiváció fenntartására és a személyre szabott tanulási élmény biztosítására.

A rendszer egy full-stack JavaScript alkalmazás, amely `React`-tel a frontend oldalon, `Node.js` és `Express.js`-szel a backend oldalon, valamint `MongoDB`-vel az adatbázis kezelésére.

## Főbb jellemzők

*   **Tematikus szókincsfejlesztő modul:** Részletes szókincsgyakorlók különböző nyelvtani témakörök (pl. igék, főnevek, melléknevek) szerint.
*   **Interaktív kvízek és feladatok:** Többféle feladattípus (többszörös választás, beírásos, párosító, igeragozás) a hatékony gyakorláshoz és tudásméréshez.
*   **Valós idejű fordítási támogatás:** DeepL API integráció a gyors és pontos spanyol-magyar fordításokhoz, segítve a megértést.
*   **Gamifikációs rendszer:** Pontrendszer, rangok (Bronz, Ezüst, Arany, Platina, Gyémánt, Mester, Legenda), napi kihívások és vizuális haladáskövetés a tanulói motiváció fenntartására.
*   **Felhasználói profil és részletes statisztikák:** Személyre szabott profil oldal, ahol a felhasználók nyomon követhetik tanulási előrehaladásukat grafikonok és aktivitási naptár segítségével.
*   **Közösségi funkciók:** Lehetőség bejegyzések megosztására, képek feltöltésére, kommentelésre és lájkolásra, ösztönözve a felhasználók közötti interakciót.
*   **Térképjáték ("Leo Kalandja Spanyolországban"):** Kalandos, gamifikált módja a nyelvtanulásnak, ahol a felhasználók Spanyolország városait fedezhetik fel nyelvi kihívások teljesítésével.
*   **Reszponzív design:** Asztali böngészőkre optimalizált, modern és letisztult felhasználói felület.
*   **Biztonságos felhasználókezelés:** `JWT` alapú autentikáció és `bcrypt` jelszóhashelés.

## Technológiai stack

### Frontend
*   `React`
*   `React Router`
*   `Axios`
*   `Chart.js` (a `react-chartjs-2` wrapperrel)
*   `react-calendar-heatmap`
*   `React Icons`, `React Tooltip`
*   Fejlesztői eszközök: `Visual Studio Code`, `ESLint`, `Prettier`, `Jest`, `React Testing Library`

### Backend
*   `Node.js`
*   `Express.js`
*   `JWT` (jsonwebtoken)
*   `Bcrypt.js`
*   `DeepL API` (külső integráció)
*   `Nodemailer` (Gmail API integrációhoz)
*   `dotenv` (környezeti változók kezelésére)

### Adatbázis
*   `MongoDB` (NoSQL, dokumentum-orientált adatbázis)
*   `Mongoose` (ODM - Object Data Modeling)

## Telepítés és futtatás helyben

Az alábbi lépésekkel tudod telepíteni és elindítani az alkalmazást a helyi gépeden.

### 1. Előfeltételek

Győződj meg róla, hogy a következő szoftverek telepítve vannak a rendszereden:
*   [Node.js](https://nodejs.org/) (ajánlott verzió: v16 vagy újabb)
*   [MongoDB Community Edition](https://www.mongodb.com/try/download/community) vagy egy MongoDB Atlas fiók
*   [Git](https://git-scm.com/)

### 2. Repository klónozása

Nyisd meg a terminált (vagy parancssort), és futtasd a következő parancsokat a projekt klónozásához:

git clone https://github.com/zsombics/LearnTheSpanish.git
cd LearnTheSpanish

### 3. Backend beállítása és futtatása
Lépj be a backend könyvtárba, telepítsd a függőségeket, és hozd létre a .env fájlt.
cd backend
npm install

Hozd létre egy nevű fájlt (.env) a backend mappában az alábbi tartalommal. Fontos, hogy a <placeholder> részeket a saját adataiddal helyettesítsd.
MongoDB adatbázis kapcsolódási URI
Helyi MongoDB esetén:
mongodb://localhost:27017/learnthespanish
MongoDB Atlas esetén:
a saját Atlas connection stringed
MONGO_URI=mongodb://localhost:27017/learnthespanish

Titkos kulcs a JWT tokenek aláírásához
JWT_SECRET=generald_egy_komplex_titkos_kulcsot

DeepL API kulcs
DEEPL_API_KEY=your_deepl_api_key_here

Gmail SMTP beállítások a jelszó-visszaállításhoz
Figyelem: Az EMAIL_PASS-nak egy Gmail alkalmazás jelszónak kell lennie, nem a fő jelszavad!
Lásd: https://support.google.com/accounts/answer/185834?hl=hu
EMAIL_USER=your_gmail_email@gmail.com
EMAIL_PASS=your_gmail_app_password

A frontend alkalmazás URL-je (fejlesztéshez localhost:3000)
FRONTEND_URL=http://localhost:3000
Use code with caution.
Env
Ezután indítsd el a backend szervert:
nodemon server.js

Ha a nodemon nincs telepítve, telepítsd globálisan (npm install -g nodemon)
Vagy futtasd simán: node server.js

Sikeres indítás esetén a konzolon az alábbi üzeneteket fogod látni:
MongoDB kapcsolódva!
Szerver fut a 5000 porton

### 4. Frontend beállítása és futtatása
Nyiss egy új terminál ablakot, navigálj vissza a fő projekt mappába, majd lépj be a frontend könyvtárba.
cd ../frontend
npm install

Végül indítsd el a React fejlesztői szervert:
npm start

A React alkalmazás automatikusan megnyílik a böngésződben a http://localhost:3000 címen.

### Jövőbeli fejlesztési lehetőségek
A projekt jelenlegi verziója egy alapvető, de működőképes platformot biztosít. Számos irányba bővíthető és fejleszthető a jövőben:
Skálázhatóság: A backend horizontalis skálázása Docker konténerek és terheléselosztó (load balancer) segítségével a nagyobb felhasználói terhelés kezelésére.
Képtárolás optimalizálása: A base64 kódolású képtárolás helyett fájlrendszer alapú vagy felhőalapú (pl. Amazon S3, Firebase Storage) megoldások bevezetése.
Valós idejű kommunikáció: WebSocket vagy Server-Sent Events technológiák alkalmazása a közösségi funkciók (kommentek, lájkok) azonnali frissítéséhez.
Részletesebb biztonsági funkciók: IP-alapú rate limiting, single sign-on (SSO) támogatás, részletesebb naplózás és biztonsági audit mechanizmusok implementálása.
Többnyelvűség: A platform bővítése további nyelvek (pl. francia, román, olasz) támogatásával, kihasználva a moduláris felépítést és a CSV alapú tananyagimportot.
Oktatási intézmények támogatása: Tanári/Adminisztrátori jogosultságok bevezetése, lehetővé téve saját tananyagok, tesztek létrehozását, tanulócsoportok kezelését és eredmények osztályszintű kiértékelését.
Mobil alkalmazás: Natív mobil alkalmazás (React Native) vagy Progresszív Web Alkalmazás (PWA) fejlesztése a mobil eszközökön való jobb felhasználói élmény érdekében.

Készítette: Csegezi Zsombor
<!-- Opcionálisan ide teheted a GitHub profilod vagy LinkedIn profilod linkjét: -->
GitHub: [zsombics](https://github.com/zsombics)
