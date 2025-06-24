const axios = require('axios');

// Egyszerű teljesítmény teszt
async function quickPerformanceTest() {
    console.log('🚀 GYORS TELJESÍTMÉNY TESZT');
    console.log('============================');
    
    const BASE_URL = 'http://localhost:5000/api';
    const results = {
        apiTests: {},
        databaseTests: {},
        translationTests: {},
        summary: {}
    };

    // API válaszidő tesztek - csak a nyilvános végpontok
    console.log('\n📡 API VÁLASZIDŐ TESZTEK:');
    
    const apiEndpoints = [
        { name: 'Szavak lekérése', url: '/words' },
        { name: 'DeepL fordítás', url: '/translate', method: 'POST', data: { text: 'hola' } }
    ];

    for (const endpoint of apiEndpoints) {
        const times = [];
        console.log(`\n${endpoint.name}:`);
        
        for (let i = 0; i < 5; i++) {
            const start = Date.now();
            try {
                if (endpoint.method === 'POST') {
                    await axios.post(`${BASE_URL}${endpoint.url}`, endpoint.data);
                } else {
                    await axios.get(`${BASE_URL}${endpoint.url}`);
                }
                const duration = Date.now() - start;
                times.push(duration);
                process.stdout.write('.');
            } catch (error) {
                console.log(`\n❌ Hiba: ${endpoint.name} - ${error.message}`);
                // Ha 401/403 hiba, akkor autentikáció szükséges, de a végpont létezik
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    const duration = Date.now() - start;
                    times.push(duration);
                    process.stdout.write('A'); // Autentikált végpont
                }
            }
        }
        
        if (times.length > 0) {
            const avg = times.reduce((a, b) => a + b, 0) / times.length;
            const min = Math.min(...times);
            const max = Math.max(...times);
            
            results.apiTests[endpoint.name] = { avg, min, max };
            console.log(`\n  ${endpoint.name}: ${avg.toFixed(0)}ms (${min}-${max}ms)`);
        }
    }

    // Autentikált végpontok tesztelése (csak a végpont létezését ellenőrizzük)
    console.log('\n🔐 AUTENTIKÁLT VÉGPONTOK TESZTELÉSE:');
    const authEndpoints = [
        { name: 'Felhasználók lekérése', url: '/users' },
        { name: 'Bejegyzések lekérése', url: '/posts' },
        { name: 'Kvíz eredmények', url: '/eredmenyek' }
    ];

    for (const endpoint of authEndpoints) {
        const start = Date.now();
        try {
            await axios.get(`${BASE_URL}${endpoint.url}`);
        } catch (error) {
            const duration = Date.now() - start;
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.log(`  ${endpoint.name}: ${duration}ms ✓ (autentikáció szükséges)`);
                results.apiTests[endpoint.name] = { avg: duration, min: duration, max: duration, auth: true };
            } else if (error.response && error.response.status === 404) {
                console.log(`  ${endpoint.name}: Végpont nem található ✗`);
            } else {
                console.log(`  ${endpoint.name}: ${error.message} ✗`);
            }
        }
    }

    // DeepL fordítás részletes teszt
    console.log('\n🌐 DEEPL FORDÍTÁS RÉSZLETES TESZT:');
    const testWords = ['hola', 'gracias', 'por favor', 'buenos días', '¿cómo estás?'];
    
    for (const word of testWords) {
        const start = Date.now();
        try {
            const response = await axios.post(`${BASE_URL}/translate`, { text: word });
            const duration = Date.now() - start;
            results.translationTests[word] = { duration, success: true };
            console.log(`  "${word}": ${duration}ms ✓`);
        } catch (error) {
            const duration = Date.now() - start;
            results.translationTests[word] = { duration, success: false, error: error.message };
            console.log(`  "${word}": ${duration}ms ✗ (${error.message})`);
        }
    }

    // Memória használat
    console.log('\n💾 MEMÓRIA HASZNÁLAT:');
    const memUsage = process.memoryUsage();
    results.memoryUsage = {
        rss: (memUsage.rss / 1024 / 1024).toFixed(2),
        heapUsed: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
        heapTotal: (memUsage.heapTotal / 1024 / 1024).toFixed(2)
    };
    
    console.log(`  RSS: ${results.memoryUsage.rss} MB`);
    console.log(`  Heap Used: ${results.memoryUsage.heapUsed} MB`);
    console.log(`  Heap Total: ${results.memoryUsage.heapTotal} MB`);

    // Összefoglaló
    console.log('\n📊 ÖSSZEFOGLALÓ:');
    
    // Csak a sikeres API tesztek átlaga
    const successfulApiTests = Object.values(results.apiTests).filter(test => test.avg);
    const apiAvg = successfulApiTests.length > 0 
        ? successfulApiTests.reduce((sum, test) => sum + test.avg, 0) / successfulApiTests.length 
        : 0;
    
    // Csak a sikeres fordítások átlaga
    const successfulTranslations = Object.values(results.translationTests).filter(t => t.success);
    const translationAvg = successfulTranslations.length > 0 
        ? successfulTranslations.reduce((sum, t) => sum + t.duration, 0) / successfulTranslations.length 
        : 0;
    
    results.summary = {
        averageApiResponse: Math.round(apiAvg),
        averageTranslation: Math.round(translationAvg),
        memoryUsage: results.memoryUsage,
        successfulApiTests: successfulApiTests.length,
        successfulTranslations: successfulTranslations.length
    };
    
    console.log(`  Átlagos API válaszidő: ${results.summary.averageApiResponse}ms (${results.summary.successfulApiTests} sikeres teszt)`);
    console.log(`  Átlagos fordítási idő: ${results.summary.averageTranslation}ms (${results.summary.successfulTranslations} sikeres fordítás)`);
    console.log(`  Memória használat: ${results.memoryUsage.heapUsed}MB`);
    
    console.log('\n✅ TESZT BEFEJEZVE');
    
    return results;
}

// Script futtatása
if (require.main === module) {
    quickPerformanceTest()
        .then(results => {
            console.log('\n📋 EREDMÉNYEK A DOKUMENTÁCIÓHOZ:');
            console.log('=====================================');
            console.log(`API válaszidők: ${results.summary.averageApiResponse}ms (átlag)`);
            console.log(`DeepL fordítás: ${results.summary.averageTranslation}ms (átlag)`);
            console.log(`Memória használat: ${results.memoryUsage.heapUsed}MB`);
            console.log(`Sikeres API tesztek: ${results.summary.successfulApiTests}`);
            console.log(`Sikeres fordítások: ${results.summary.successfulTranslations}`);
            console.log('\nEzeket az adatokat be tudod másolni a dokumentációba!');
        })
        .catch(error => {
            console.error('❌ TESZT HIBA:', error.message);
        });
}

module.exports = { quickPerformanceTest }; 