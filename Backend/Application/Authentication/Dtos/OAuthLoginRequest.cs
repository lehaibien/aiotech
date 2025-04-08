namespace Application.Authentication.Dtos;

public class OAuthLoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string FamilyName { get; set; } = string.Empty;
    public string GivenName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}
