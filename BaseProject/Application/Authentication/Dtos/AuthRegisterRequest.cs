using System.ComponentModel.DataAnnotations;

namespace Application.Authentication.Dtos;

public class AuthRegisterRequest
{
    public Guid Id { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên người dùng không được để trống")]
    public string UserName { get; set; } = null!;

    public string? FamilyName { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên không được để trống")]
    public string GivenName { get; set; } = null!;

    [EmailAddress]
    [Required(AllowEmptyStrings = false, ErrorMessage = "Email không được để trống")]
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Mật khẩu không được để trống")]
    public string Password { get; set; } = null!;
}
