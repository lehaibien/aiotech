namespace Application.Abstractions;

public interface ICacheService
{
    /// <summary>
/// Asynchronously retrieves a cached value of type <typeparamref name="T"/> associated with the specified key.
/// </summary>
/// <param name="key">The unique identifier for the cached entry.</param>
/// <returns>The cached value if found; otherwise, null.</returns>
public Task<T?> GetAsync<T>(string key);
    /// <summary>
/// Stores a value in the cache under the specified key, with an optional expiration time.
/// </summary>
/// <param name="key">The cache key to associate with the value.</param>
/// <param name="value">The value to cache.</param>
/// <param name="expiration">Optional expiration duration for the cached entry.</param>
public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
    /// <summary>
/// Removes the cached entry associated with the specified key, if it exists.
/// </summary>
/// <param name="key">The unique identifier of the cache entry to remove.</param>
/// <returns>A task representing the asynchronous remove operation.</returns>
public Task RemoveAsync(string key);
}
