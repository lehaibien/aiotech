using Application.Users.Dtos;
using Shared;

namespace Application.Users;

public interface IUserService
{
    /// <summary>
    /// Retrieves a paginated list of users based on the specified request parameters.
    /// </summary>
    /// <param name="request">The parameters for filtering, sorting, and paginating the user list.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A result containing the paginated list of users.</returns>
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Retrieves a user's details by their unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the user.</param>
/// <returns>A result containing the user's information if found.</returns>
Task<Result<UserResponse>> GetByIdAsync(Guid id);
    /// <summary>
/// Retrieves a user by their username.
/// </summary>
/// <param name="username">The username of the user to retrieve.</param>
/// <returns>A result containing the user information if found.</returns>
Task<Result<UserResponse>> GetByUsernameAsync(string username);
    /// <summary>
/// Retrieves a user by their email address asynchronously.
/// </summary>
/// <param name="email">The email address of the user to retrieve.</param>
/// <returns>A result containing the user information if found.</returns>
Task<Result<UserResponse>> GetByEmailAsync(string email);
    /// <summary>
/// Retrieves the profile details of a user by their unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the user.</param>
/// <returns>A result containing the user's profile details if found.</returns>
Task<Result<UserProfileResponse>> GetProfileByIdAsync(Guid id);
    /// <summary>
/// Asynchronously creates a new user with the specified request data.
/// </summary>
/// <param name="request">The user information to create the new user.</param>
/// <returns>A result containing the created user's details if successful.</returns>
Task<Result<UserResponse>> CreateAsync(UserRequest request);
    /// <summary>
/// Updates an existing user's information with the provided data.
/// </summary>
/// <param name="request">The user data to update.</param>
/// <returns>A result containing the updated user information if successful.</returns>
Task<Result<UserResponse>> UpdateAsync(UserRequest request);
    /// <summary>
/// Updates the profile details of a user with the provided profile information.
/// </summary>
/// <param name="request">The profile data to update for the user.</param>
/// <returns>A result containing the updated user information if successful.</returns>
Task<Result<UserResponse>> UpdateProfileAsync(UserProfileRequest request);
    /// <summary>
/// Deletes a user identified by the specified unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the user to delete.</param>
/// <returns>A result indicating the success or failure of the deletion operation.</returns>
Task<Result> DeleteAsync(Guid id);
    /// <summary>
/// Deletes multiple users identified by the provided list of unique identifiers.
/// </summary>
/// <param name="ids">A list of user IDs to delete.</param>
/// <returns>A result indicating the success or failure of the operation.</returns>
Task<Result> DeleteListAsync(List<Guid> ids);
    /// <summary>
/// Locks the user account identified by the specified unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the user to lock.</param>
/// <returns>A result indicating whether the operation was successful.</returns>
Task<Result> LockUserAsync(Guid id);
}
