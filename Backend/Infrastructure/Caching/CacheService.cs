using Application.Abstractions;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Infrastructure.Caching;

public class CacheService : ICacheService
{
    private readonly IDistributedCache _cache;

    public CacheService(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var cacheValue = await _cache.GetStringAsync(key);
        if (cacheValue == null)
        {
            return default;
        }
        return JsonConvert.DeserializeObject<T>(cacheValue);
    }

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

    public async Task RemoveAsync(string key)
    {
        await _cache.RemoveAsync(key);
    }
}
