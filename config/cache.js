import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 3600 }); // Default TTL: 1 hour

const clearCache = () => cache.flushAll();

const setCache = (key, value) => cache.set(key, value);

const getCache = (key) => cache.get(key);

const deleteCache = (key) => cache.del(key);

const hasCache = (key) => cache.has(key);

const cacheKeys = () => cache.keys();

const cacheStats = () => cache.stats();

const cacheSize = () => cache.size();

export {
  cache,
  clearCache,
  setCache,
  getCache,
  deleteCache,
  hasCache,
  cacheKeys,
  cacheStats,
  cacheSize,
};
