namespace Application.Roles.Dtos;

public record RoleResponse(
    Guid Id,
    string Code,
    string Name,
    DateTime CreatedDate,
    DateTime? UpdatedDate
);