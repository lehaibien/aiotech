using Application.Helpers;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure.Persistent.Interceptors;

public class AuditInterceptor(IHttpContextAccessor contextAccessor) : SaveChangesInterceptor
{
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
            entryAdd.Entity.CreatedBy = Utilities.GetUsernameFromContext(
                contextAccessor.HttpContext
            );
        }

        foreach (EntityEntry<BaseEntity> entryUpdate in entriesUpdate)
        {
            entryUpdate.Entity.UpdatedDate = DateTime.UtcNow;
            entryUpdate.Entity.UpdatedBy = Utilities.GetUsernameFromContext(
                contextAccessor.HttpContext
            );
        }

        return base.SavingChanges(eventData, result);
    }

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
            entryAdd.Entity.CreatedBy = Utilities.GetUsernameFromContext(
                contextAccessor.HttpContext
            );
        }

        foreach (EntityEntry<BaseEntity> entryUpdate in entriesUpdate)
        {
            entryUpdate.Entity.UpdatedDate = DateTime.UtcNow;
            entryUpdate.Entity.UpdatedBy = Utilities.GetUsernameFromContext(
                contextAccessor.HttpContext
            );
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}
