namespace Application.Authentication.Dtos;

public sealed record TokenResult(string AccessToken, string RefreshToken);