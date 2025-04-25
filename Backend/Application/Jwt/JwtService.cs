using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Jwt.Options;
using Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Application.Jwt;

public class JwtService : IJwtService
{
    private readonly JwtOption _options;
    private readonly SymmetricSecurityKey _symmetricSecurityKey;
    private readonly TokenValidationParameters _tokenValidationParameters;

    public JwtService(IOptions<JwtOption> options)
    {
        _options = options.Value;
        var key = _options.Key;
        _symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        _tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _symmetricSecurityKey,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = _options.Issuer,
            ValidAudience = _options.Audience,
            ValidateLifetime = false,
        };
    }

    /// <summary>
    /// Generates a JWT access token for the specified user, embedding user identity and role claims.
    /// </summary>
    /// <param name="user">The user for whom the token is generated.</param>
    /// <returns>A signed JWT string containing user claims.</returns>
    public string GenerateToken(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Name, user.UserName),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Role, user.Role.Code ?? string.Empty),
            new(ClaimTypes.Thumbprint, user.AvatarUrl ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };
        var token = new JwtSecurityToken(
            _options.Issuer,
            _options.Audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(_options.ExpirationInMinutes),
            signingCredentials: new SigningCredentials(
                _symmetricSecurityKey,
                SecurityAlgorithms.HmacSha384
            )
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            tokenHandler.ValidateToken(token, _tokenValidationParameters, out _);
        }
        catch
        {
            return false;
        }

        return true;
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(
            token,
            _tokenValidationParameters,
            out var securityToken
        );
        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (
            jwtSecurityToken == null
            || !jwtSecurityToken.Header.Alg.Equals(
                SecurityAlgorithms.HmacSha512,
                StringComparison.InvariantCultureIgnoreCase
            )
        )
            throw new SecurityTokenException("Invalid token");
        return principal;
    }
}
