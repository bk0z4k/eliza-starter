// Tracks and analyzes performance metrics for the AI system
// Provides latency monitoring and statistical analysis
// Helps identify performance bottlenecks and optimization opportunities
export class PerformanceMonitor {
    private static metrics: Map<string, number[]> = new Map();

    static trackLatency(operation: string, duration: number) {
        if (!this.metrics.has(operation)) {
            this.metrics.set(operation, []);
        }
        this.metrics.get(operation).push(duration);
    }

    static getAverageLatency(operation: string): number {
        const latencies = this.metrics.get(operation) || [];
        if (latencies.length === 0) return 0;
        return latencies.reduce((a, b) => a + b, 0) / latencies.length;
    }
} 