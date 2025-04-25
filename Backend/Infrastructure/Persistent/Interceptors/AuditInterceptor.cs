using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.Persistent.Interceptors;

public class AuditInterceptor(IHttpContextAccessor contextAccessor) : SaveChangesInterceptor
{
    /// <summary>
    /// Sets audit fields on added and modified <see cref="BaseEntity"/> instances before saving changes to the database.
    /// </summary>
    /// <param name="eventData">The event data containing the current <see cref="DbContext"/> and change tracker.</param>
    /// <param name="result">The interception result to be returned.</param>
    /// <returns>The interception result, potentially modified.</returns>
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result
    )
    {
        if (eventData.Context is null)
        {
            return base.SavingChanges(eventData, result);
        }

        IEnumerable<EntityEntry<BaseEntity>> entriesAdd = eventData
            .Context.ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Added);

        IEnumerable<EntityEntry<BaseEntity>> entriesUpdate = eventData
            .Context.ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Modified);

        foreach (EntityEntry<BaseEntity> entryAdd in entriesAdd)
        {
            entryAdd.Entity.CreatedDate = DateTime.UtcNow;
            entryAdd.Entity.CreatedBy =
                contextAccessor.HttpContext.User.Identity.Name ?? "anonymous";
        }

        foreach (EntityEntry<BaseEntity> entryUpdate in entriesUpdate)
        {
            entryUpdate.Entity.UpdatedDate = DateTime.UtcNow;
            entryUpdate.Entity.UpdatedBy =
                contextAccessor.HttpContext.User.Identity.Name ?? "anonymous";
        }

        return base.SavingChanges(eventData, result);
    }

    /// <summary>
    /// Asynchronously sets audit fields on added and modified <see cref="BaseEntity"/> instances before saving changes to the database.
    /// </summary>
    /// <param name="eventData">The event data associated with the save operation.</param>
    /// <param name="result">The interception result for the save operation.</param>
    /// <param name="cancellationToken">A token to observe while waiting for the task to complete.</param>
    /// <returns>A <see cref="ValueTask{InterceptionResult}"/> representing the asynchronous operation, with updated audit fields applied to relevant entities.</returns>
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default
    )
    {
        if (eventData.Context is null)
        {
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        IEnumerable<EntityEntry<BaseEntity>> entriesAdd = eventData
            .Context.ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Added);

        IEnumerable<EntityEntry<BaseEntity>> entriesUpdate = eventData
            .Context.ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Modified);

        foreach (EntityEntry<BaseEntity> entryAdd in entriesAdd)
        {
            entryAdd.Entity.CreatedDate = DateTime.UtcNow;
            entryAdd.Entity.CreatedBy =
                contextAccessor?.HttpContext?.User?.Identity?.Name ?? "anonymous";
        }

        foreach (EntityEntry<BaseEntity> entryUpdate in entriesUpdate)
        {
            entryUpdate.Entity.UpdatedDate = DateTime.UtcNow;
            entryUpdate.Entity.UpdatedBy =
                contextAccessor.HttpContext.User.Identity.Name ?? "anonymous";
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}
