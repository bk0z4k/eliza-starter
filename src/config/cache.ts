/**
 * cache.ts
 * Implements an enhanced two-tier caching system combining memory and disk storage
 * This file provides efficient data access with automatic cache invalidation
 */

import { CacheManager, ICacheAdapter } from "@ai16z/eliza";

/**
 * EnhancedCacheManager extends the base CacheManager with a two-tier caching strategy
 * - First tier: In-memory cache for fastest access
 * - Second tier: Disk-based cache for persistence
 * 
 * Features:
 * - Automatic cache invalidation
 * - Memory cleanup to prevent leaks
 * - Fallback to disk cache when memory cache misses
 */
export class EnhancedCacheManager extends CacheManager {
    /** In-memory cache storage using Map for O(1) access */
    private memoryCache: Map<string, any>;
    
    /** Persistent disk cache adapter */
    private diskCache: ICacheAdapter;
    
    /** Time-to-live for cache entries in seconds (5 minutes) */
    private readonly TTL = 300;

    /**
     * Initializes the enhanced cache manager
     * @param adapter - The disk cache adapter for persistent storage
     */
    constructor(adapter: ICacheAdapter) {
        super(adapter);
        this.memoryCache = new Map();
        this.diskCache = adapter;
    }

    /**
     * Retrieves a value from cache
     * First checks memory cache, then falls back to disk cache
     * @param key - The cache key to lookup
     * @returns The cached value or null if not found
     */
    async get(key: string): Promise<any> {
        // Check memory cache first for fastest access
        if (this.memoryCache.has(key)) {
            return this.memoryCache.get(key);
        }

        // Fall back to disk cache if not in memory
        const value = await this.diskCache.get(key);
        if (value) {
            // Populate memory cache for future fast access
            this.memoryCache.set(key, value);
        }
        return value;
    }

    /**
     * Stores a value in both memory and disk cache
     * Sets up automatic cleanup of memory cache entries
     * @param key - The cache key
     * @param value - The value to cache
     */
    async set(key: string, value: any): Promise<void> {
        // Store in both memory and disk
        this.memoryCache.set(key, value);
        await this.diskCache.set(key, value);
        
        // Schedule cleanup of memory cache entry after TTL
        setTimeout(() => {
            this.memoryCache.delete(key);
        }, this.TTL * 1000);
    }
}