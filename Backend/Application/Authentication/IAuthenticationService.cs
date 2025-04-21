using Application.Authentication.Dtos;
using Shared;

namespace Application.Authentication;

public interface IAuthenticationService
{
    Task<Result<TokenResult>> Login(AuthLoginRequest request);
    Task<Result<TokenResult>> SocialLogin(OAuthLoginRequest request);
    Task<Result> Register(AuthRegisterRequest request);
    Task<Result> ConfirmEmail(ConfirmEmailRequest request);
    Task<Result<TokenResult>> RefreshToken(RefreshTokenRequest request);
    Task<Result> ChangePassword(ChangePasswordRequest request);
    Task<Result> ChangeEmail(ChangeEmailRequest request);
    Task<Result> ConfirmChangeEmail(ConfirmChangeEmailRequest request);
    Task<Result> ResetPassword(ResetPasswordRequest request);
}
