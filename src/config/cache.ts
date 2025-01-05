import { CacheManager, ICacheAdapter } from "@ai16z/eliza";

// Implements a two-tier caching system with memory and disk storage
// Extends the base CacheManager with enhanced caching capabilities
// Provides automatic cache invalidation and cleanup
export class EnhancedCacheManager extends CacheManager {
    private memoryCache: Map<string, any>;
    private diskCache: ICacheAdapter;
    private readonly TTL = 300; // 5 minutes

    constructor(adapter: ICacheAdapter) {
        super(adapter);
        this.memoryCache = new Map();
        this.diskCache = adapter;
    }

    async get(key: string): Promise<any> {
        // Check memory cache first
        if (this.memoryCache.has(key)) {
            return this.memoryCache.get(key);
        }

        // Check disk cache
        const value = await this.diskCache.get(key);
        if (value) {
            this.memoryCache.set(key, value);
        }
        return value;
    }

    async set(key: string, value: any): Promise<void> {
        this.memoryCache.set(key, value);
        await this.diskCache.set(key, value);
        
        // Cleanup old entries
        setTimeout(() => {
            this.memoryCache.delete(key);
        }, this.TTL * 1000);
    }
}