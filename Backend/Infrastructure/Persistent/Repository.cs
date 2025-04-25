using System.Data;
using System.Data.Common;
using System.Linq.Expressions;
using Domain.UnitOfWork;
using Infrastructure.Extensions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistent;

public class Repository<T> : IRepository<T>
    where T : class
{
    private readonly DbContext _dbContext;

    private readonly DbSet<T> _dbSet;

    public Repository(DbContext dbContext)
    {
        _dbContext = dbContext;
        _dbSet = _dbContext.Set<T>();
    }

    public virtual IQueryable<T> GetAll()
    {
        return _dbSet.AsQueryable();
    }

    public virtual IQueryable<T> GetAll(
        Expression<Func<T, bool>> predicate,
        string[]? includes = null
    )
    {
        var query = _dbSet.Where(predicate);
        if (includes is not null or { Length: > 0 })
        {
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
        }

        return query.AsQueryable();
    }

    /// <summary>
    /// Retrieves an entity by its GUID primary key.
    /// </summary>
    /// <param name="id">The unique identifier of the entity.</param>
    /// <returns>The entity with the specified ID, or null if not found.</returns>
    public virtual T? GetById(Guid id)
    {
        return _dbSet.Find(id);
    }

    /// <summary>
    /// Asynchronously retrieves an entity by its GUID primary key.
    /// </summary>
    /// <param name="id">The unique identifier of the entity.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the task to complete.</param>
    /// <returns>The entity if found; otherwise, null.</returns>
    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync([id], cancellationToken);
    }

    /// <summary>
    /// Returns the first entity matching the specified predicate, optionally using no-tracking for improved performance.
    /// </summary>
    /// <param name="predicate">The filter expression to apply.</param>
    /// <param name="asNoTracking">If true, the query is executed without tracking the returned entity.</param>
    /// <returns>The first matching entity, or null if no match is found.</returns>
    public virtual T? Find(Expression<Func<T, bool>> predicate, bool asNoTracking = true)
    {
        if (asNoTracking)
        {
            return _dbSet.AsNoTracking().FirstOrDefault(predicate);
        }
        return _dbSet.FirstOrDefault(predicate);
    }

    /// <summary>
    /// Asynchronously finds the first entity matching the specified predicate, with optional no-tracking behavior.
    /// </summary>
    /// <param name="predicate">The filter expression to apply to the entity set.</param>
    /// <param name="asNoTracking">If true, the query is executed without tracking the returned entity.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the task to complete.</param>
    /// <returns>The first entity matching the predicate, or null if none is found.</returns>
    public async Task<T?> FindAsync(
        Expression<Func<T, bool>> predicate,
        bool asNoTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        if (asNoTracking)
        {
            return await _dbSet.AsNoTracking().FirstOrDefaultAsync(predicate, cancellationToken);
        }
        return await _dbSet.FirstOrDefaultAsync(predicate, cancellationToken);
    }

    /// <summary>
    /// Adds a new entity to the context for insertion into the database.
    /// </summary>
    public virtual void Add(T entity)
    {
        _dbSet.Add(entity);
    }

    public virtual void AddRange(IEnumerable<T> entities)
    {
        _dbSet.AddRange(entities);
    }

    public virtual void Update(T entity)
    {
        if (_dbContext.Entry(entity).State == EntityState.Detached)
        {
            _dbSet.Attach(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
        }
        else
        {
            _dbSet.Update(entity);
        }
    }

    public virtual void UpdateRange(IEnumerable<T> entities)
    {
        _dbSet.UpdateRange(entities);
    }

    /// <summary>
    /// Removes the specified entity from the context, attaching it if it is not already tracked.
    /// </summary>
    public virtual void Delete(T entity)
    {
        if (_dbContext.Entry(entity).State == EntityState.Detached)
        {
            _dbSet.Attach(entity);
        }
        _dbSet.Remove(entity);
    }

    public virtual void DeleteRange(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    /// <summary>
    /// Returns the total number of entities in the repository.
    /// </summary>
    /// <returns>The count of entities.</returns>
    public virtual int Count()
    {
        return _dbSet.Count();
    }

    /// <summary>
    /// Asynchronously returns the total number of entities in the set.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>The total count of entities.</returns>
    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(cancellationToken);
    }

    /// <summary>
    /// Returns the number of entities that satisfy the specified predicate.
    /// </summary>
    /// <param name="predicate">A filter expression to apply to the entities.</param>
    /// <returns>The count of entities matching the predicate.</returns>
    public virtual int Count(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Count(predicate);
    }

    /// <summary>
    /// Asynchronously counts the number of entities that satisfy the specified predicate.
    /// </summary>
    /// <param name="predicate">A filter expression to apply to the entities.</param>
    /// <param name="cancellationToken">A token to cancel the asynchronous operation.</param>
    /// <returns>The number of entities matching the predicate.</returns>
    public async Task<int> CountAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet.CountAsync(predicate, cancellationToken);
    }

    /// <summary>
    /// Determines whether any entities exist in the repository.
    /// </summary>
    /// <returns>True if at least one entity exists; otherwise, false.</returns>
    public virtual bool Any()
    {
        return _dbSet.Any();
    }

    /// <summary>
    /// Asynchronously determines whether any entities exist in the set.
    /// </summary>
    /// <param name="cancellationToken">A token to cancel the asynchronous operation.</param>
    /// <returns>True if at least one entity exists; otherwise, false.</returns>
    public async Task<bool> AnyAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.AnyAsync(cancellationToken);
    }

    /// <summary>
    /// Determines whether any entities satisfy the specified predicate.
    /// </summary>
    /// <param name="predicate">A condition to test each entity for a match.</param>
    /// <returns>True if any entities match the predicate; otherwise, false.</returns>
    public virtual bool Any(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Any(predicate);
    }

    /// <summary>
    /// Asynchronously determines whether any entities match the specified predicate.
    /// </summary>
    /// <param name="predicate">A filter expression to test each entity.</param>
    /// <param name="cancellationToken">A token to cancel the asynchronous operation.</param>
    /// <returns>True if any entities satisfy the predicate; otherwise, false.</returns>
    public async Task<bool> AnyAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet.AnyAsync(predicate, cancellationToken);
    }

    /// <summary>
    /// Executes a stored procedure using the provided model's properties as parameters and returns the result as a collection of entities.
    /// </summary>
    /// <typeparam name="TModel">The type of the model whose properties are mapped to stored procedure parameters.</typeparam>
    /// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
    /// <param name="model">An object whose properties are used as input parameters for the stored procedure.</param>
    /// <returns>An enumerable collection of entities resulting from the stored procedure execution.</returns>
    public virtual IEnumerable<T> ExecuteStoredProcedure<TModel>(
        string storedProcedureName,
        T model
    )
        where TModel : class
    {
        if (_dbContext.Database.GetDbConnection().State == ConnectionState.Closed)
        {
            _dbContext.Database.OpenConnection();
        }

        List<SqlParameter> sqlParameters = [];
        foreach (var property in model.GetType().GetProperties())
        {
            sqlParameters.Add(new SqlParameter(property.Name, property.GetValue(model)));
        }
        using DbCommand command = _dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = storedProcedureName;
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddRange(sqlParameters.ToArray());
        DataTable dataTable = new DataTable();
        using DbDataReader reader = command.ExecuteReader();
        dataTable.Load(reader);
        command.Parameters.Clear();
        return dataTable.ToList<T>();
    }

    /// <summary>
    /// Asynchronously executes a stored procedure using the specified model's properties as parameters and returns the result as a collection of entities.
    /// </summary>
    /// <typeparam name="TModel">The type of the model whose properties are used as stored procedure parameters.</typeparam>
    /// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
    /// <param name="model">An instance whose public properties are mapped to stored procedure parameters.</param>
    /// <param name="cancellationToken">A token to observe while waiting for the task to complete.</param>
    /// <returns>A collection of entities resulting from the stored procedure execution.</returns>
    public async Task<IEnumerable<T>> ExecuteStoredProcedureAsync<TModel>(
        string storedProcedureName,
        T model,
        CancellationToken cancellationToken = default
    )
        where TModel : class
    {
        if (_dbContext.Database.GetDbConnection().State == ConnectionState.Closed)
        {
            _dbContext.Database.OpenConnection();
        }

        List<SqlParameter> sqlParameters = [];
        foreach (var property in model.GetType().GetProperties())
        {
            sqlParameters.Add(new SqlParameter(property.Name, property.GetValue(model)));
        }
        await using DbCommand command = _dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = storedProcedureName;
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddRange(sqlParameters.ToArray());
        DataTable dataTable = new DataTable();
        await using DbDataReader reader = await command.ExecuteReaderAsync(cancellationToken);
        dataTable.Load(reader);
        command.Parameters.Clear();
        return dataTable.ToList<T>();
    }

    /// <summary>
    /// Executes a stored procedure with the specified name and parameters, returning the results as a collection of entities.
    /// </summary>
    /// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
    /// <param name="parameters">An array of SQL parameters to pass to the stored procedure, or null if none.</param>
    /// <returns>An enumerable collection of entities mapped from the stored procedure result set.</returns>
    public virtual IEnumerable<T> ExecuteStoredProcedure(
        string storedProcedureName,
        SqlParameter[]? parameters
    )
    {
        if (_dbContext.Database.GetDbConnection().State == ConnectionState.Closed)
        {
            _dbContext.Database.OpenConnection();
        }
        using DbCommand command = _dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = storedProcedureName;
        command.CommandType = CommandType.StoredProcedure;
        if (parameters is not null)
        {
            command.Parameters.AddRange(parameters);
        }
        DataTable dataTable = new DataTable();
        using DbDataReader reader = command.ExecuteReader();
        dataTable.Load(reader);
        command.Parameters.Clear();
        return dataTable.ToList<T>();
    }

    /// <summary>
    /// Asynchronously executes a stored procedure with the specified name and parameters, returning the results as a collection of entities.
    /// </summary>
    /// <param name="storedProcedureName">The name of the stored procedure to execute.</param>
    /// <param name="parameters">Optional SQL parameters to pass to the stored procedure.</param>
    /// <param name="cancellationToken">A token to observe while waiting for the task to complete.</param>
    /// <returns>An enumerable collection of entities resulting from the stored procedure execution.</returns>
    public async Task<IEnumerable<T>> ExecuteStoredProcedureAsync(
        string storedProcedureName,
        SqlParameter[]? parameters,
        CancellationToken cancellationToken = default
    )
    {
        if (_dbContext.Database.GetDbConnection().State == ConnectionState.Closed)
        {
            _dbContext.Database.OpenConnection();
        }
        await using DbCommand command = _dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = storedProcedureName;
        command.CommandType = CommandType.StoredProcedure;
        if (parameters is not null)
        {
            command.Parameters.AddRange(parameters);
        }
        DataTable dataTable = new DataTable();
        await using DbDataReader reader = await command.ExecuteReaderAsync(cancellationToken);
        dataTable.Load(reader);
        command.Parameters.Clear();
        return dataTable.ToList<T>();
    }

    /// <summary>
    /// Persists all changes made in the context to the database.
    /// </summary>
    public virtual void SaveChanges()
    {
        _dbContext.SaveChanges();
    }

    /// <summary>
    /// Asynchronously saves all changes made in the context to the database.
    /// </summary>
    /// <param name="cancellationToken">A token to cancel the asynchronous operation.</param>
    public virtual async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Releases resources used by the underlying DbContext.
    /// </summary>
    public virtual void Dispose()
    {
        _dbContext.Dispose();
    }
}
