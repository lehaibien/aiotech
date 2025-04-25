using Application.Abstractions;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Infrastructure.Caching;

public class CacheService : ICacheService
{
    private readonly IDistributedCache _cache;

    /// <summary>
    /// Initializes a new instance of the <see cref="CacheService"/> class using the specified distributed cache.
    /// </summary>
    public CacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    /// <summary>
    /// Asynchronously retrieves a cached value by key and deserializes it to the specified type.
    /// </summary>
    /// <param name="key">The cache key to retrieve.</param>
    /// <returns>The deserialized object of type <typeparamref name="T"/> if found; otherwise, the default value for <typeparamref name="T"/>.</returns>
    public async Task<T?> GetAsync<T>(string key)
    {
        var cacheValue = await _cache.GetStringAsync(key);
        if (cacheValue == null)
        {
            return default;
        }
        return JsonConvert.DeserializeObject<T>(cacheValue);
    }

    /// <summary>
    /// Asynchronously stores a serialized value in the distributed cache under the specified key, with optional absolute expiration.
    /// </summary>
    /// <param name="key">The cache key to associate with the value.</param>
    /// <param name="value">The value to cache.</param>
    /// <param name="expiration">Optional absolute expiration timespan for the cache entry.</param>
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        var cacheEntryOptions = new DistributedCacheEntryOptions();
        if (expiration.HasValue)
        {
            cacheEntryOptions.SetAbsoluteExpiration(expiration.Value);
        }
        var serializedValue = JsonConvert.SerializeObject(value);
        await _cache.SetStringAsync(key, serializedValue, cacheEntryOptions);
    }

    /// <summary>
    /// Asynchronously removes the cached entry associated with the specified key.
    /// </summary>
    /// <param name="key">The cache key to remove.</param>
    public async Task RemoveAsync(string key)
    {
        await _cache.RemoveAsync(key);
    }
}
