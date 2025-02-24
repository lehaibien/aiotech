using System.ComponentModel.DataAnnotations;

namespace Application.Authentication.Dtos;

public class ChangePasswordRequest
{
    public Guid Id { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Mật khẩu cũ không được để trống")]
    public string OldPassword { get; set; } = null!;

    [Required(AllowEmptyStrings = false, ErrorMessage = "Mật khẩu mới không được để trống")]
    public string NewPassword { get; set; } = null!;
}
