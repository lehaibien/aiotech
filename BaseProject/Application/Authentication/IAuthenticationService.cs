using Application.Authentication.Dtos;
using Microsoft.AspNetCore.Authentication;
using Shared;

namespace Application.Authentication;

public interface IAuthenticationService
{
    Task<Result<TokenResult>> Login(AuthLoginRequest request);

    Task<Result<TokenResult>> SocialLogin(OAuthLoginRequest request);

    // Task<Result<TokenResult>> LoginByGoogle(AuthenticateResult authenticateResult);
    // Task<Result<TokenResult>> LoginByFacebook(AuthenticateResult authenticateResult);
    Task<Result<string>> Register(AuthRegisterRequest request);
    Task<Result> ConfirmEmail(ConfirmEmailRequest request);
    Task<Result<TokenResult>> RefreshToken(RefreshTokenRequest request);
    Task<Result> ChangePassword(ChangePasswordRequest request);
    Task<Result<string>> ChangeEmail(ChangeEmailRequest request);
    Task<Result> ConfirmChangeEmail(ConfirmChangeEmailRequest request);
    Task<Result> ResetPassword(ResetPasswordRequest request);
}
