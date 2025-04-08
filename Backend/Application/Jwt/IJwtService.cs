using System.Security.Claims;
using Domain.Entities;

namespace Application.Jwt;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
    bool ValidateToken(string token);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}