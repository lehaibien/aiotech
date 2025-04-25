using Infrastructure.Persistent;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Extensions;

public static class MigrationExtension
{
    public static WebApplication AddMigration(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetService<ApplicationDbContext>();
            if (context is not null && context.Database.GetPendingMigrations().Any())
            {
                context.Database.Migrate();
            }
        }
        return app;
    }
}
