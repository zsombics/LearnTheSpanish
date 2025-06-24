// Frontend teljesítmény monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoads: [],
            componentRenders: [],
            apiCalls: [],
            userInteractions: [],
            memoryUsage: []
        };
        this.startTime = performance.now();
    }

    // Oldal betöltési idő mérése
    measurePageLoad() {
        const loadTime = performance.now() - this.startTime;
        this.metrics.pageLoads.push({
            timestamp: Date.now(),
            loadTime: loadTime,
            url: window.location.href
        });
        
        console.log(`📄 Oldal betöltési idő: ${loadTime.toFixed(2)}ms`);
        return loadTime;
    }

    // Komponens render idő mérése
    measureComponentRender(componentName, renderTime) {
        this.metrics.componentRenders.push({
            timestamp: Date.now(),
            component: componentName,
            renderTime: renderTime
        });
        
        console.log(`⚛️ ${componentName} render: ${renderTime.toFixed(2)}ms`);
    }

    // API hívás mérése
    measureApiCall(endpoint, duration, success) {
        this.metrics.apiCalls.push({
            timestamp: Date.now(),
            endpoint: endpoint,
            duration: duration,
            success: success
        });
        
        console.log(`🌐 API ${endpoint}: ${duration}ms ${success ? '✓' : '✗'}`);
    }

    // Felhasználói interakció mérése
    measureUserInteraction(action, duration) {
        this.metrics.userInteractions.push({
            timestamp: Date.now(),
            action: action,
            duration: duration
        });
        
        console.log(`👆 ${action}: ${duration}ms`);
    }

    // Memória használat mérése (böngészőben elérhető)
    measureMemoryUsage() {
        if (performance.memory) {
            const memory = performance.memory;
            const usage = {
                timestamp: Date.now(),
                usedJSHeapSize: memory.usedJSHeapSize / 1024 / 1024, // MB
                totalJSHeapSize: memory.totalJSHeapSize / 1024 / 1024, // MB
                jsHeapSizeLimit: memory.jsHeapSizeLimit / 1024 / 1024 // MB
            };
            
            this.metrics.memoryUsage.push(usage);
            console.log(`💾 Memória: ${usage.usedJSHeapSize.toFixed(2)}MB / ${usage.totalJSHeapSize.toFixed(2)}MB`);
            return usage;
        }
        return null;
    }

    // Teljesítmény statisztikák generálása
    generateReport() {
        const report = {
            timestamp: Date.now(),
            sessionDuration: performance.now() - this.startTime,
            pageLoads: {
                count: this.metrics.pageLoads.length,
                average: this.calculateAverage(this.metrics.pageLoads.map(p => p.loadTime)),
                min: Math.min(...this.metrics.pageLoads.map(p => p.loadTime)),
                max: Math.max(...this.metrics.pageLoads.map(p => p.loadTime))
            },
            apiCalls: {
                count: this.metrics.apiCalls.length,
                average: this.calculateAverage(this.metrics.apiCalls.map(a => a.duration)),
                successRate: this.metrics.apiCalls.filter(a => a.success).length / this.metrics.apiCalls.length * 100
            },
            userInteractions: {
                count: this.metrics.userInteractions.length,
                average: this.calculateAverage(this.metrics.userInteractions.map(u => u.duration))
            },
            memoryUsage: this.metrics.memoryUsage.length > 0 ? {
                average: this.calculateAverage(this.metrics.memoryUsage.map(m => m.usedJSHeapSize)),
                peak: Math.max(...this.metrics.memoryUsage.map(m => m.usedJSHeapSize))
            } : null
        };

        console.log('📊 TELJESÍTMÉNY JELENTÉS:', report);
        return report;
    }

    calculateAverage(numbers) {
        return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
    }

    // Metrikák exportálása
    exportMetrics() {
        return {
            metrics: this.metrics,
            report: this.generateReport()
        };
    }

    // Metrikák törlése
    clearMetrics() {
        this.metrics = {
            pageLoads: [],
            componentRenders: [],
            apiCalls: [],
            userInteractions: [],
            memoryUsage: []
        };
        this.startTime = performance.now();
    }
}

// Globális monitor példány
const performanceMonitor = new PerformanceMonitor();

// API interceptor a hívások automatikus méréséhez
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const startTime = performance.now();
    const url = args[0];
    
    return originalFetch.apply(this, args)
        .then(response => {
            const duration = performance.now() - startTime;
            performanceMonitor.measureApiCall(url, duration, response.ok);
            return response;
        })
        .catch(error => {
            const duration = performance.now() - startTime;
            performanceMonitor.measureApiCall(url, duration, false);
            throw error;
        });
};

// React komponens wrapper a render idő méréséhez
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
    return function PerformanceWrappedComponent(props) {
        const startTime = performance.now();
        
        React.useEffect(() => {
            const renderTime = performance.now() - startTime;
            performanceMonitor.measureComponentRender(componentName, renderTime);
        });

        return <WrappedComponent {...props} />;
    };
};

// Automatikus memória mérés
setInterval(() => {
    performanceMonitor.measureMemoryUsage();
}, 30000); // 30 másodpercenként

// Oldal betöltés mérése
window.addEventListener('load', () => {
    setTimeout(() => {
        performanceMonitor.measurePageLoad();
    }, 0);
});

export default performanceMonitor; 