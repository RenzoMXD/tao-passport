type CacheSource = 'live' | 'cache';

type CacheEntry<T> = {
  value: T;
  cachedAt: number;
  expiresAt: number;
};

export type CacheLoadResult<T> = {
  value: T;
  source: CacheSource;
  cachedAt: string;
  expiresAt: string;
  ttlMs: number;
};

export function createTtlCache<T>(ttlMs: number) {
  const store = new Map<string, CacheEntry<T>>();

  return {
    async getOrLoad(key: string, loader: () => Promise<T>): Promise<CacheLoadResult<T>> {
      const now = Date.now();
      const cached = store.get(key);

      if (cached && cached.expiresAt > now) {
        return {
          value: cached.value,
          source: 'cache',
          cachedAt: new Date(cached.cachedAt).toISOString(),
          expiresAt: new Date(cached.expiresAt).toISOString(),
          ttlMs,
        };
      }

      const value = await loader();
      const entry = {
        value,
        cachedAt: now,
        expiresAt: now + ttlMs,
      };

      store.set(key, entry);

      return {
        value,
        source: 'live',
        cachedAt: new Date(entry.cachedAt).toISOString(),
        expiresAt: new Date(entry.expiresAt).toISOString(),
        ttlMs,
      };
    },
    clear() {
      store.clear();
    },
  };
}
