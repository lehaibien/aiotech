namespace Application.Authentication.Dtos;

public class OAuthLoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string? FamilyName { get; set; }
    public string? GivenName { get; set; }
    public string? ImageUrl { get; set; }
}
