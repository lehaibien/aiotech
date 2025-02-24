using System.ComponentModel.DataAnnotations;

namespace Application.Authentication.Dtos;

public class ChangeEmailRequest
{
    public Guid Id { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Email mới bắt buộc nhập")]
    public string NewEmail { get; set; } = null!;
}
