using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Application.Users.Dtos;

public class UserProfileRequest
{
    public Guid Id { get; set; }
    public string? FamilyName { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên không được để trống")]
    public string GivenName { get; set; } = null!;

    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public IFormFile? Image { get; set; }
}
