// src/components/MapGame/cityData.js

export const cities = [
    {
        id: 1, name: 'Barcelona', x: 906, y: 243,
        image: '/images/cities/barcelona.jpg',
        description: 'Gaudí városa, tele modernista csodákkal és vibráló kultúrával.',
        artist: {
            name: 'Antoni Gaudí', // Eredeti művész neve
            image: '/images/artists/gaudi.png', // Megfelelő képfájl
            info: 'Katalán építész, a modernizmus kiemelkedő alakja. Műveit a természet ihlette formák és a részletgazdagság jellemzi.', // Rövid infó
            dialogue: '¡Hola! A természet a legnagyobb tanítómester. Lásd meg a formákat és színeket úgy, ahogy én! Írd le Barcelona csodáit helyes melléknevekkel 10 teszten át, és egy mozaikdarabka – a jelszó – a tiéd lesz.' // Új dialógus
        },
        password: 'MOSAICO',
        levelComponent: 'Level1'
    },
    {
        id: 2, name: 'Valencia', x: 747, y: 421,
        image: '/images/cities/valencia.jpg',
        description: 'A fény és a paella hazája, modern építészettel és hosszú strandokkal.',
        artist: {
            name: 'Joaquín Sorolla', // Eredeti művész neve
            image: '/images/artists/sorolla.png', // Megfelelő képfájl
            info: 'A "fény festőjeként" ismert impresszionista művész. Imádta megörökíteni Valencia tengerpartját és a spanyol mindennapokat.', // Rövid infó
            dialogue: 'Bienvenido a la luz! Imádom ezt a fényt! Mutasd meg, hogy le tudod írni a piac forgatagát és a tengerpart ragyogását jelen időben. 10 pontos teszt után tied a fény szava.' // Új dialógus
        },
        password: 'LUMINOSO',
        levelComponent: 'Level2'
    },
    {
        id: 3, name: 'Sevilla', x: 445, y: 578,
        image: '/images/cities/sevilla.jpg',
        description: 'Andalúzia szíve, a flamenco, a tapas és a lenyűgöző Alcázar otthona.',
        artist: {
            name: 'Diego Velázquez', // Eredeti művész neve
            image: '/images/artists/velazquez.png', // Megfelelő képfájl
            info: 'A spanyol aranykor egyik legnagyobb festője, IV. Fülöp udvari portréfestője. Realizmusa és technikai tudása lenyűgöző.', // Rövid infó
            dialogue: 'Üdv az udvaromban! A múlt eseményeit és az emberek jellemét pontosan kell ábrázolni. Használd helyesen az egyszerű múlt időt 10 teszten át, és megkapod a portrék titkos szavát.' // Új dialógus
        },
        password: 'RETRATO',
        levelComponent: 'Level3'
    },
    {
        id: 4, name: 'Bilbao', x: 609, y: 113,
        image: '/images/cities/bilbao.jpg',
        description: 'Baszkföld modern központja, a Guggenheim Múzeummal és ipari örökséggel.',
        artist: {
            name: 'Eduardo Chillida', // Eredeti művész neve
            image: '/images/artists/chillida.png', // Megfelelő képfájl
            info: 'Baszk szobrász, aki monumentális absztrakt műveiről ismert, gyakran acélból és kőből alkotott, a teret kutatva.', // Rövid infó
            dialogue: 'Ongi etorri! Az anyagoknak lelkük van. Ismerd meg őket, és tanuld meg leírni a helyzetüket a térben és a jövőbeli terveidet. 10 hibátlan válasz után az acél szava a tiéd.' // Új dialógus
        },
        password: 'ACERO',
        levelComponent: 'Level4'
    },
    {
        id: 5, name: 'Zaragoza', x: 728, y: 244,
        image: '/images/cities/zaragoza.jpg',
        description: 'Aragónia fővárosa az Ebro partján, híres a Basílica del Pilar-ról.',
        artist: {
            name: 'Francisco Goya', // Eredeti művész neve
            image: '/images/artists/goya.png', // Megfelelő képfájl
            info: 'Sokoldalú művész, aki a vidám kárpitoktól a sötét, nyugtalanító festményekig és metszetekig jutott. Korának krónikása.', // Rövid infó
            dialogue: 'Figyelj! A múlt nem mindig egyszerű. Meg kell különböztetned az eseményt a leírástól. Mutasd meg 10 teszten, hogy érted a múlt időket és ki tudod fejezni a véleményed, és megkapod a kárpitok szavát.' // Új dialógus
        },
        password: 'TAPICES',
        levelComponent: 'Level5'
    },
    {
        id: 6, name: 'Málaga', x: 496, y: 635,
        image: '/images/cities/malaga.jpg',
        description: 'Picasso szülővárosa a Costa del Sol-on, napfény, tengerpart és történelem.',
        artist: {
            name: 'Pablo Picasso', // Eredeti művész neve
            image: '/images/artists/picasso.png', // Megfelelő képfájl
            info: 'A 20. század egyik legmeghatározóbb művésze, a kubizmus társalapítója. Stílusa folyamatosan változott és újult meg.', // Rövid infó
            dialogue: '¡Hola! A művészet a hazugság, ami segít megérteni az igazságot. És a stílus? Az folyton változik! Tanuld meg kifejezni a változást és az érzelmeket 10 teszten át, és a kubizmus szava a tiéd.' // Új dialógus
        },
        password: 'CUBISMO',
        levelComponent: 'Level6'
    },
    {
        id: 7, name: 'Granada', x: 571, y: 607,
        image: '/images/cities/granada.jpg',
        description: 'Az Alhambra varázslatos otthona, a Sierra Nevada lábánál.',
        artist: {
            name: 'Federico García Lorca', // Eredeti művész neve
            image: '/images/artists/lorca.png', // Megfelelő képfájl
            info: 'A Generación del 27 kiemelkedő költője és drámaírója. Műveit mély szenvedély, szimbolizmus és andalúz folklór jellemzi.', // Rövid infó
            dialogue: '¡Silencio! Hallgasd Granada hangját! A vágyak és álmok nyelvét a feltételes mód rejti. Értsd meg a szépséget 10 teszten keresztül, és az Alhambra szava elvezet a célodhoz.' // Új dialógus
        },
        password: 'ALHAMBRA',
        levelComponent: 'Level7'
    },
    {
        id: 8, name: 'Palma', x: 932, y: 413,
        image: '/images/cities/palma.jpg',
        description: 'Mallorca nyüzsgő fővárosa, lenyűgöző katedrálissal és mediterrán hangulattal.',
        artist: {
            name: 'Joan Miró', // Eredeti művész neve
            image: '/images/artists/miro.png', // Megfelelő képfájl
            info: 'Katalán festő, szobrász, a szürrealizmus és absztrakt művészet fontos alakja. Műveire a gyermeki formák, élénk színek és szimbólumok jellemzők.', // Rövid infó
            dialogue: 'Nézz az égre! A színek és formák egyszerűek, mint egy álom. Tanuld meg leírni őket jelen időben 10 teszten át, és a csillagok megmutatják a titkos szót.' // Új dialógus
        },
        password: 'ESTRELLA',
        levelComponent: 'Level8'
    },
    {
        id: 9, name: 'Madrid', x: 581, y: 382,
        image: '/images/cities/madrid.jpg',
        description: 'Spanyolország lüktető szíve, tele élettel, múzeumokkal és királyi palotával.',
        artist: null, // Madridban más típusú feladatok lesznek a történet szerint
        password: null,
        levelComponent: null
    }
];

// Segédfüggvény a város adatok ID alapján történő lekéréséhez
export const getCityById = (id) => cities.find(city => city.id === id);