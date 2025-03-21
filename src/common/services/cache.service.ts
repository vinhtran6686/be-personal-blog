import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get data from cache
   * @param key Cache key
   * @returns Cached data or null
   */
  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * Set data in cache
   * @param key Cache key
   * @param value Data to cache
   * @param ttl Time to live in seconds (optional)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, { ttl });
  }

  /**
   * Delete data from cache
   * @param key Cache key
   */
  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Clear entire cache
   */
  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  /**
   * Get data from cache or execute function and cache its result
   * @param key Cache key 
   * @param fn Function to execute if data not in cache
   * @param ttl Time to live in seconds (optional)
   * @returns Data from cache or function result
   */
  async getOrSet<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    const cachedData = await this.get<T>(key);
    
    if (cachedData) {
      return cachedData;
    }
    
    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }
} 