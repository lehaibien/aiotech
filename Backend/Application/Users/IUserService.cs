using Application.Shared;
using Application.Users.Dtos;

namespace Application.Users;

public interface IUserService
{
    Task<Result<PaginatedList<UserResponse>>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<UserResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<UserResponse>> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<Result<UserResponse>> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<Result<UserProfileResponse>> GetProfileByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<UserResponse>> CreateAsync(UserRequest request);
    Task<Result<UserResponse>> UpdateAsync(UserRequest request);
    Task<Result<UserResponse>> UpdateProfileAsync(UserProfileRequest request);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> DeleteListAsync(List<Guid> ids);
    Task<Result> LockUserAsync(Guid id);
}