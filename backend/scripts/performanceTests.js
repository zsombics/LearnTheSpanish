const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Post = require('../models/Post');
const Word = require('../models/Word');

// Konfiguráció
const BASE_URL = 'http://localhost:5000/api';
const TEST_ITERATIONS = 10;

// Mérési segédfüggvények
const measureTime = async (fn, description) => {
    const start = Date.now();
    try {
        const result = await fn();
        const end = Date.now();
        const duration = end - start;
        return { success: true, duration, result, description };
    } catch (error) {
        const end = Date.now();
        const duration = end - start;
        return { success: false, duration, error: error.message, description };
    }
};

const average = (numbers) => numbers.reduce((a, b) => a + b, 0) / numbers.length;

const minMax = (numbers) => ({
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    avg: average(numbers)
});

// API tesztek
const testAPIEndpoints = async () => {
    console.log('\n=== API VÁLASZIDŐ TESZTEK ===');
    
    const tests = [
        {
            name: 'Szavak lekérése',
            fn: () => axios.get(`${BASE_URL}/words`)
        },
        {
            name: 'Felhasználók lekérése',
            fn: () => axios.get(`${BASE_URL}/users`)
        },
        {
            name: 'Bejegyzések lekérése',
            fn: () => axios.get(`${BASE_URL}/posts`)
        },
        {
            name: 'Kvíz eredmények lekérése',
            fn: () => axios.get(`${BASE_URL}/eredmenyek`)
        }
    ];

    for (const test of tests) {
        const results = [];
        console.log(`\n${test.name}:`);
        
        for (let i = 0; i < TEST_ITERATIONS; i++) {
            const result = await measureTime(test.fn, test.name);
            results.push(result.duration);
            process.stdout.write('.');
        }
        
        const stats = minMax(results);
        console.log(`\n  Átlag: ${stats.avg.toFixed(2)}ms`);
        console.log(`  Min: ${stats.min}ms, Max: ${stats.max}ms`);
    }
};

// Adatbázis tesztek
const testDatabaseQueries = async () => {
    console.log('\n=== ADATBÁZIS LEKÉRDEZÉS TESZTEK ===');
    
    const tests = [
        {
            name: 'Felhasználók száma',
            fn: () => User.countDocuments()
        },
        {
            name: 'Kvíz eredmények száma',
            fn: () => QuizResult.countDocuments()
        },
        {
            name: 'Bejegyzések száma',
            fn: () => Post.countDocuments()
        },
        {
            name: 'Szavak száma',
            fn: () => Word.countDocuments()
        },
        {
            name: 'Felhasználók átlagos pontszáma',
            fn: () => User.aggregate([
                { $group: { _id: null, avgAccuracy: { $avg: '$totalAccuracy' } } }
            ])
        },
        {
            name: 'Top 10 felhasználó lekérése',
            fn: () => User.find().sort({ totalAccuracy: -1 }).limit(10).select('name totalAccuracy')
        }
    ];

    for (const test of tests) {
        const result = await measureTime(test.fn, test.name);
        console.log(`${test.name}: ${result.duration}ms ${result.success ? '✓' : '✗'}`);
    }
};

// DeepL API teszt
const testDeepLTranslation = async () => {
    console.log('\n=== DEEPL API TESZT ===');
    
    const testTexts = [
        'hola',
        'gracias',
        'por favor',
        'buenos días',
        '¿cómo estás?'
    ];

    for (const text of testTexts) {
        const result = await measureTime(
            () => axios.post(`${BASE_URL}/translate`, { text }),
            `Fordítás: "${text}"`
        );
        console.log(`"${text}" → ${result.duration}ms ${result.success ? '✓' : '✗'}`);
    }
};

// Memória használat mérés
const measureMemoryUsage = () => {
    console.log('\n=== MEMÓRIA HASZNÁLAT ===');
    const memUsage = process.memoryUsage();
    console.log(`RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`External: ${(memUsage.external / 1024 / 1024).toFixed(2)} MB`);
};

// Adatbázis kapcsolat teszt
const testDatabaseConnection = async () => {
    console.log('\n=== ADATBÁZIS KAPCSOLAT TESZT ===');
    
    const start = Date.now();
    try {
        await mongoose.connection.db.admin().ping();
        const duration = Date.now() - start;
        console.log(`MongoDB kapcsolat: ${duration}ms ✓`);
    } catch (error) {
        console.log(`MongoDB kapcsolat hiba: ${error.message} ✗`);
    }
};

// Teljesítmény stressz teszt
const stressTest = async () => {
    console.log('\n=== STRESSZ TESZT ===');
    
    const concurrentRequests = 20;
    const promises = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
            measureTime(
                () => axios.get(`${BASE_URL}/words`),
                `Párhuzamos kérés ${i + 1}`
            )
        );
    }
    
    const results = await Promise.all(promises);
    const durations = results.map(r => r.duration);
    const stats = minMax(durations);
    
    console.log(`${concurrentRequests} párhuzamos kérés:`);
    console.log(`  Átlag: ${stats.avg.toFixed(2)}ms`);
    console.log(`  Min: ${stats.min}ms, Max: ${stats.max}ms`);
    console.log(`  Sikeres: ${results.filter(r => r.success).length}/${concurrentRequests}`);
};

// Fő teszt függvény
const runAllTests = async () => {
    console.log('🚀 TELJESÍTMÉNY TESZTEK INDÍTÁSA');
    console.log('=====================================');
    
    try {
        await testDatabaseConnection();
        await testAPIEndpoints();
        await testDatabaseQueries();
        await testDeepLTranslation();
        await stressTest();
        measureMemoryUsage();
        
        console.log('\n✅ ÖSSZES TESZT BEFEJEZVE');
    } catch (error) {
        console.error('❌ TESZT HIBA:', error.message);
    }
};

// Script futtatása
if (require.main === module) {
    runAllTests().then(() => {
        console.log('\n📊 TESZTEK BEFEJEZVE');
        process.exit(0);
    }).catch(error => {
        console.error('❌ KRITIKUS HIBA:', error);
        process.exit(1);
    });
}

module.exports = {
    runAllTests,
    measureTime,
    testAPIEndpoints,
    testDatabaseQueries,
    testDeepLTranslation
}; 