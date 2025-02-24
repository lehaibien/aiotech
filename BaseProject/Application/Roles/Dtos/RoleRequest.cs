using System.ComponentModel.DataAnnotations;

namespace Application.Roles.Dtos;

public class RoleRequest
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên vai trò không được để trống")]
    public string? Name { get; set; }
}