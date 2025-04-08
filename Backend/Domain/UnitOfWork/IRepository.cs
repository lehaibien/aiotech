using System.Linq.Expressions;
using Microsoft.Data.SqlClient;

namespace Domain.UnitOfWork;

public interface IRepository<T> where T : class
{
    IQueryable<T> GetAll();
    IQueryable<T> GetAll(Expression<Func<T, bool>> predicate, string[] includes = null);
    T? GetById(Guid id);
    Task<T?> GetByIdAsync(Guid id);
    T? Find(Expression<Func<T, bool>> predicate);
    Task<T?> FindAsync(Expression<Func<T, bool>> predicate);
    void AttachRange(IEnumerable<T> entities);
    void Add(T entity);
    void AddRange(IEnumerable<T> entities);
    void Update(T entity);
    void UpdateRange(IEnumerable<T> entities);
    void Delete(T entity);
    void DeleteRange(IEnumerable<T> entities);
    int Count();
    Task<int> CountAsync();
    int Count(Expression<Func<T, bool>> predicate);
    Task<int> CountAsync(Expression<Func<T, bool>> predicate);
    bool Any();
    Task<bool> AnyAsync();
    bool Any(Expression<Func<T, bool>> predicate);
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    IEnumerable<T> ExecuteStoredProcedure(string storedProcedureName, object model);
    Task<IEnumerable<T>> ExecuteStoredProcedureAsync(string storedProcedureName, object model);
    IEnumerable<T> ExecuteStoredProcedure(string storedProcedureName, params SqlParameter[]? parameters);
    Task<IEnumerable<T>> ExecuteStoredProcedureAsync(string storedProcedureName, params SqlParameter[]? parameters);
    void SaveChanges();
    Task SaveChangesAsync();
    void Dispose();
}