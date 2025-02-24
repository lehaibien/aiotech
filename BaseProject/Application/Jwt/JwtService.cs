using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Jwt.Options;
using AutoDependencyRegistration.Attributes;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Application.Jwt;

[RegisterClassAsSingleton]
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

    public string GenerateToken(List<Claim> claims)
    {
        var token = new JwtSecurityToken(
            _options.Issuer,
            _options.Audience,
            claims,
            expires: DateTime.Now.AddMinutes(_options.ExpirationInMinutes),
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
