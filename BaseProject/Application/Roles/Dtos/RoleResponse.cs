using Shared;

namespace Application.Roles.Dtos;

public class RoleResponse : BaseResponse
{
    public Guid Id { get; set; }
    public string? Name { get; set; } = string.Empty;
}