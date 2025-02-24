using System.Security.Claims;

namespace Application.Jwt;

public interface IJwtService
{
    string GenerateToken(List<Claim> claims);
    string GenerateRefreshToken();
    bool ValidateToken(string token);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}