using Application.Roles.Dtos;
using Domain.Entities;

namespace Application.Roles;

public static class RoleMapper
{
    public static RoleResponse MapToRoleResponse(this Role role)
    {
        return new RoleResponse(
            role.Id,
            role.Code,
            role.Name,
            role.CreatedDate,
            role.UpdatedDate
        );
    }

    public static Role MapToRole(this RoleRequest request)
    {
        return new Role { Code = request.Code, Name = request.Name };
    }

    public static Role ApplyToRole(this RoleRequest request, Role role)
    {
        role.Code = request.Code;
        role.Name = request.Name;
        return role;
    }

    // Projection
    public static IQueryable<RoleResponse> ProjectToRoleResponse(this IQueryable<Role> query)
    {
        return query.Select(x => new RoleResponse(
            x.Id,
            x.Code,
            x.Name,
            x.CreatedDate,
            x.UpdatedDate
        ));
    }
}