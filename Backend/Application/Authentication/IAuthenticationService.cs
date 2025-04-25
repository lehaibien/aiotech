using Application.Authentication.Dtos;
using Shared;

namespace Application.Authentication;

public interface IAuthenticationService
{
    /// <summary>
/// Authenticates a user with the provided credentials and returns a token result on success.
/// </summary>
/// <param name="request">The login credentials and related authentication data.</param>
/// <returns>A result containing the authentication token if successful.</returns>
Task<Result<TokenResult>> Login(AuthLoginRequest request);
    /// <summary>
/// Authenticates a user using social OAuth credentials and returns an authentication token on success.
/// </summary>
/// <param name="request">The OAuth login request containing provider and credential information.</param>
/// <returns>A result containing the authentication token if successful.</returns>
Task<Result<TokenResult>> SocialLogin(OAuthLoginRequest request);
    /// <summary>
/// Registers a new user account with the provided registration details.
/// </summary>
/// <param name="request">The registration information for the new user.</param>
/// <returns>A result indicating whether the registration was successful.</returns>
Task<Result> Register(AuthRegisterRequest request);
    /// <summary>
/// Confirms a user's email address using the provided confirmation request.
/// </summary>
/// <param name="request">The email confirmation request containing necessary verification data.</param>
/// <returns>A result indicating whether the email confirmation was successful.</returns>
Task<Result> ConfirmEmail(ConfirmEmailRequest request);
    /// <summary>
/// Refreshes an authentication token and returns a new token result if the refresh is successful.
/// </summary>
/// <param name="request">The refresh token request containing the necessary credentials.</param>
/// <returns>A result containing the new authentication token if successful.</returns>
Task<Result<TokenResult>> RefreshToken(RefreshTokenRequest request);
    /// <summary>
/// Changes the password for a user account.
/// </summary>
/// <param name="request">The password change request containing current and new password details.</param>
/// <returns>A result indicating whether the password change was successful.</returns>
Task<Result> ChangePassword(ChangePasswordRequest request);
    /// <summary>
/// Initiates the process to change a user's email address.
/// </summary>
/// <param name="request">The details required to request an email address change.</param>
/// <returns>A result indicating whether the email change process was successfully initiated.</returns>
Task<Result> ChangeEmail(ChangeEmailRequest request);
    /// <summary>
/// Confirms a user's email address change using the provided confirmation request.
/// </summary>
/// <param name="request">The confirmation details for the email change.</param>
/// <returns>A result indicating whether the email change was successfully confirmed.</returns>
Task<Result> ConfirmChangeEmail(ConfirmChangeEmailRequest request);
    /// <summary>
/// Initiates a password reset process for a user account.
/// </summary>
/// <param name="request">The password reset request containing user identification and reset details.</param>
/// <returns>A result indicating whether the password reset process was successfully initiated.</returns>
Task<Result> ResetPassword(ResetPasswordRequest request);
}
