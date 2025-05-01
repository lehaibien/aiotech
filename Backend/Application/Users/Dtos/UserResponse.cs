using Application.Shared;

namespace Application.Users.Dtos;

public class UserResponse : BaseResponse
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = null!;
    public string? FamilyName { get; set; }
    public string GivenName { get; set; } = null!;

    public string FullName =>
        string.IsNullOrWhiteSpace(FamilyName) ? GivenName : $"{FamilyName} {GivenName}";

    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; } = string.Empty;
    public string? Role { get; set; } = string.Empty;
    public bool IsLocked { get; set; }
}