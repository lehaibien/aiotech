namespace Application.Users.Dtos;

public class UserProfileResponse
{
    public string? FamilyName { get; set; } = string.Empty;
    public string GivenName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Address { get; set; } = string.Empty;
}