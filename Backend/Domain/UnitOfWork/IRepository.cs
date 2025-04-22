using System.Linq.Expressions;
using Microsoft.Data.SqlClient;

namespace Domain.UnitOfWork;

public interface IRepository<T>
    where T : class
{
    IQueryable<T> GetAll();
    IQueryable<T> GetAll(Expression<Func<T, bool>> predicate, string[] includes = null!);
    T? GetById(Guid id);
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    T? Find(Expression<Func<T, bool>> predicate, bool asNoTracking = true);
    Task<T?> FindAsync(
        Expression<Func<T, bool>> predicate,
        bool asNoTracking = true,
        CancellationToken cancellationToken = default
    );
    void Add(T entity);
    void AddRange(IEnumerable<T> entities);
    void Update(T entity);
    void UpdateRange(IEnumerable<T> entities);
    void Delete(T entity);
    void DeleteRange(IEnumerable<T> entities);
    int Count();
    Task<int> CountAsync(CancellationToken cancellationToken = default);
    int Count(Expression<Func<T, bool>> predicate);
    Task<int> CountAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default
    );
    bool Any();
    Task<bool> AnyAsync(CancellationToken cancellationToken = default);
    bool Any(Expression<Func<T, bool>> predicate);
    Task<bool> AnyAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default
    );
    IEnumerable<T> ExecuteStoredProcedure(string storedProcedureName, object model);
    Task<IEnumerable<T>> ExecuteStoredProcedureAsync(
        string storedProcedureName,
        object model,
        CancellationToken cancellationToken = default
    );
    IEnumerable<T> ExecuteStoredProcedure(
        string storedProcedureName,
        params SqlParameter[]? parameters
    );
    Task<IEnumerable<T>> ExecuteStoredProcedureAsync(
        string storedProcedureName,
        CancellationToken cancellationToken = default,
        params SqlParameter[]? parameters
    );
    void SaveChanges();
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
    void Dispose();
}
