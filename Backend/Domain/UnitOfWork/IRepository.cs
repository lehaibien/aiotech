using System.Linq.Expressions;
using Microsoft.Data.SqlClient;

namespace Domain.UnitOfWork;

public interface IRepository<T>
    where T : class
{
    /// <summary>
/// Returns a queryable collection of all entities of type <typeparamref name="T"/>.
/// </summary>
/// <returns>An <see cref="IQueryable{T}"/> representing all entities in the repository.</returns>
IQueryable<T> GetAll();
    /// <summary>
/// Returns a queryable collection of entities matching the specified predicate, with optional related data included.
/// </summary>
/// <param name="predicate">The filter expression to apply to the entities.</param>
/// <param name="includes">An array of related entity property names to include in the query.</param>
/// <returns>An <see cref="IQueryable{T}"/> of entities matching the predicate.</returns>
IQueryable<T> GetAll(Expression<Func<T, bool>> predicate, string[] includes = null!);
    /// <summary>
/// Retrieves an entity by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the entity.</param>
/// <returns>The entity with the specified identifier, or null if not found.</returns>
T? GetById(Guid id);
    /// <summary>
/// Asynchronously retrieves an entity by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the entity.</param>
/// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
/// <returns>The entity with the specified identifier, or null if not found.</returns>
Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    /// <summary>
/// Returns the first entity matching the specified predicate, optionally without tracking changes in the context.
/// </summary>
/// <param name="predicate">A filter expression to select the entity.</param>
/// <param name="asNoTracking">If true, the entity is not tracked by the context; defaults to true.</param>
/// <returns>The first matching entity, or null if no match is found.</returns>
T? Find(Expression<Func<T, bool>> predicate, bool asNoTracking = true);
    /// <summary>
    /// Asynchronously finds a single entity matching the specified predicate, with optional tracking control.
    /// </summary>
    /// <param name="predicate">The filter expression to locate the entity.</param>
    /// <param name="asNoTracking">If true, the entity is not tracked by the context.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the task to complete.</param>
    /// <returns>The entity matching the predicate, or null if not found.</returns>
    Task<T?> FindAsync(
        Expression<Func<T, bool>> predicate,
        bool asNoTracking = true,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Adds a new entity to the repository for insertion into the data store.
/// </summary>
void Add(T entity);
    /// <summary>
/// Adds multiple entities to the repository for insertion into the data store.
/// </summary>
/// <param name="entities">The collection of entities to add.</param>
void AddRange(IEnumerable<T> entities);
    /// <summary>
/// Updates the specified entity in the data store.
/// </summary>
void Update(T entity);
    /// <summary>
/// Updates multiple entities in the data store.
/// </summary>
/// <param name="entities">The collection of entities to update.</param>
void UpdateRange(IEnumerable<T> entities);
    /// <summary>
/// Removes the specified entity from the data store.
/// </summary>
void Delete(T entity);
    /// <summary>
/// Removes a collection of entities from the data store.
/// </summary>
void DeleteRange(IEnumerable<T> entities);
    /// <summary>
/// Returns the total number of entities in the repository.
/// </summary>
int Count();
    /// <summary>
/// Asynchronously returns the total number of entities in the repository.
/// </summary>
/// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
/// <returns>The total count of entities.</returns>
Task<int> CountAsync(CancellationToken cancellationToken = default);
    /// <summary>
/// Returns the number of entities that satisfy the specified predicate.
/// </summary>
/// <param name="predicate">A filter expression to apply to the entities.</param>
/// <returns>The count of entities matching the predicate.</returns>
int Count(Expression<Func<T, bool>> predicate);
    /// <summary>
    /// Asynchronously returns the number of entities that satisfy the specified predicate.
    /// </summary>
    /// <param name="predicate">A filter expression to apply to the entities.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The count of entities matching the predicate.</returns>
    Task<int> CountAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Determines whether any entities exist in the repository.
/// </summary>
/// <returns>True if at least one entity exists; otherwise, false.</returns>
bool Any();
    /// <summary>
/// Asynchronously determines whether any entities exist in the repository.
/// </summary>
/// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
/// <returns>True if at least one entity exists; otherwise, false.</returns>
Task<bool> AnyAsync(CancellationToken cancellationToken = default);
    /// <summary>
/// Determines whether any entities exist that satisfy the specified predicate.
/// </summary>
/// <param name="predicate">A filter expression to test each entity.</param>
/// <returns>True if at least one entity matches the predicate; otherwise, false.</returns>
bool Any(Expression<Func<T, bool>> predicate);
    /// <summary>
    /// Asynchronously determines whether any entities satisfy the specified predicate.
    /// </summary>
    /// <param name="predicate">A filter expression to test each entity.</param>
    /// <param name="cancellationToken">A token to observe while waiting for the task to complete.</param>
    /// <returns>True if any entities match the predicate; otherwise, false.</returns>
    Task<bool> AnyAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default
    );
    /// <summary>
        /// Executes a stored procedure with the specified model as a parameter and returns the resulting entities.
        /// </summary>
        /// <typeparam name="TModel">The type of the model used as a parameter for the stored procedure.</typeparam>
        /// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
        /// <param name="model">The model instance containing parameter values for the stored procedure.</param>
        /// <returns>An enumerable of entities returned by the stored procedure.</returns>
        IEnumerable<T> ExecuteStoredProcedure<TModel>(string storedProcedureName, T model)
        where TModel : class;
    /// <summary>
        /// Executes a stored procedure using the specified model as input and returns the resulting entities asynchronously.
        /// </summary>
        /// <typeparam name="TModel">The type of the model used as input for the stored procedure.</typeparam>
        /// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
        /// <param name="model">The model instance containing parameters for the stored procedure.</param>
        /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
        /// <returns>A task representing the asynchronous operation, containing the collection of entities returned by the stored procedure.</returns>
        Task<IEnumerable<T>> ExecuteStoredProcedureAsync<TModel>(
        string storedProcedureName,
        T model,
        CancellationToken cancellationToken = default
    )
        where TModel : class;
    /// <summary>
/// Executes a stored procedure with the specified name and parameters, returning the resulting entities.
/// </summary>
/// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
/// <param name="parameters">An array of SQL parameters to pass to the stored procedure, or null if none.</param>
/// <returns>An enumerable collection of entities returned by the stored procedure.</returns>
IEnumerable<T> ExecuteStoredProcedure(string storedProcedureName, SqlParameter[]? parameters);
    /// <summary>
    /// Executes a stored procedure asynchronously and returns the resulting entities.
    /// </summary>
    /// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
    /// <param name="parameters">Optional SQL parameters to pass to the stored procedure.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A task representing the asynchronous operation, containing the entities returned by the stored procedure.</returns>
    Task<IEnumerable<T>> ExecuteStoredProcedureAsync(
        string storedProcedureName,
        SqlParameter[]? parameters,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Commits all pending changes to the data store.
/// </summary>
void SaveChanges();
    /// <summary>
/// Asynchronously commits all pending changes to the data store.
/// </summary>
Task SaveChangesAsync(CancellationToken cancellationToken = default);
    /// <summary>
/// Releases resources used by the repository.
/// </summary>
void Dispose();
}
