interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * LRU (Least Recently Used) Cache with TTL and size limits
 * - Automatically evicts least recently used items when max size is reached
 * - Items expire after TTL
 */
export class Cache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private ttl: number;
  private maxSize: number;

  constructor(ttlMinutes = 5, maxSize = 1000) {
    this.ttl = ttlMinutes * 60 * 1000;
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key);
      return null;
    }

    // Move to end (most recently used) - Map maintains insertion order
    this.store.delete(key);
    this.store.set(key, entry);

    return entry.data;
  }

  set(key: string, data: T): void {
    // If key exists, delete first to update position
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    // Evict oldest entries if at capacity
    while (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) {
        this.store.delete(oldestKey);
        console.log(`[Cache] Evicted LRU entry: ${oldestKey.slice(0, 10)}...`);
      } else {
        break;
      }
    }

    this.store.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }

  /**
   * Remove all expired entries
   * @returns Number of entries removed
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.store.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; maxSize: number; ttlMs: number } {
    return {
      size: this.store.size,
      maxSize: this.maxSize,
      ttlMs: this.ttl
    };
  }
}
