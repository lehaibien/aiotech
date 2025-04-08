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

    public virtual T? GetById(Guid id)
    {
        return _dbSet.Find(id);
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual T? Find(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.AsNoTracking().FirstOrDefault(predicate);
    }

    public async Task<T?> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AsNoTracking().FirstOrDefaultAsync(predicate);
    }

    public void AttachRange(IEnumerable<T> entities)
    {
        _dbSet.AttachRange(entities);
    }

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

    public virtual void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public virtual void DeleteRange(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    public virtual int Count()
    {
        return _dbSet.Count();
    }

    public async Task<int> CountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public virtual int Count(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Count(predicate);
    }

    public async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.CountAsync(predicate);
    }

    public virtual bool Any()
    {
        return _dbSet.Any();
    }

    public async Task<bool> AnyAsync()
    {
        return await _dbSet.AnyAsync();
    }

    public virtual bool Any(Expression<Func<T, bool>> predicate)
    {
        return _dbSet.Any(predicate);
    }

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }

    public virtual IEnumerable<T> ExecuteStoredProcedure(string storedProcedureName, object model)
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

    public async Task<IEnumerable<T>> ExecuteStoredProcedureAsync(
        string storedProcedureName,
        object model
    )
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
        await using DbDataReader reader = await command.ExecuteReaderAsync();
        dataTable.Load(reader);
        command.Parameters.Clear();
        return dataTable.ToList<T>();
    }

    public virtual IEnumerable<T> ExecuteStoredProcedure(
        string storedProcedureName,
        params SqlParameter[]? parameters
    )
    {
        if (_dbContext.Database.GetDbConnection().State == ConnectionState.Closed)
        {
            _dbContext.Database.OpenConnection();
        }
        using DbCommand command = _dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = storedProcedureName;
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddRange(parameters);
        DataTable dataTable = new DataTable();
        using DbDataReader reader = command.ExecuteReader();
        dataTable.Load(reader);
        command.Parameters.Clear();
        return dataTable.ToList<T>();
    }

    public async Task<IEnumerable<T>> ExecuteStoredProcedureAsync(
        string storedProcedureName,
        params SqlParameter[]? parameters
    )
    {
        if (_dbContext.Database.GetDbConnection().State == ConnectionState.Closed)
        {
            _dbContext.Database.OpenConnection();
        }
        using DbCommand command = _dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = storedProcedureName;
        command.CommandType = CommandType.StoredProcedure;
        command.Parameters.AddRange(parameters);
        DataTable dataTable = new DataTable();
        await using DbDataReader reader = await command.ExecuteReaderAsync();
        dataTable.Load(reader);
        command.Parameters.Clear();
        return dataTable.ToList<T>();
    }

    public virtual void SaveChanges()
    {
        _dbContext.SaveChanges();
    }

    public virtual async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public virtual void Dispose()
    {
        _dbContext.Dispose();
    }
}
