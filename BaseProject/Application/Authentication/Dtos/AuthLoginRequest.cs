using System.ComponentModel.DataAnnotations;

namespace Application.Authentication.Dtos;

public class AuthLoginRequest
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên người dùng không được để trống")]
    public string? UserName { get; set; }
    [Required(AllowEmptyStrings = false, ErrorMessage = "Mật khẩu không được để trống")]
    public string? Password { get; set; }
}