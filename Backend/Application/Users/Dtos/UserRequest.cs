using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Application.Users.Dtos;

public class UserRequest
{
    public Guid Id { get; set; }
    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên người dùng không được để trống")]
    public string? UserName { get; set; }

    public string? FamilyName { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên không được để trống")]
    public string GivenName { get; set; } = null!;

    [EmailAddress]
    [Required(AllowEmptyStrings = false, ErrorMessage = "Email không được để trống")]
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Mật khẩu không được để trống")]
    public string? Password { get; set; }
    public Guid RoleId { get; set; }
    public IFormFile? Image { get; set; }
    public bool IsImageEdited { get; set; }
}
