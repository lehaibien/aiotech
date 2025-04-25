using Application.Users.Dtos;
using Shared;

namespace Application.Users;

public interface IUserService
{
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<UserResponse>> GetByIdAsync(Guid id);
    Task<Result<UserResponse>> GetByUsernameAsync(string username);
    Task<Result<UserResponse>> GetByEmailAsync(string email);
    Task<Result<UserProfileResponse>> GetProfileByIdAsync(Guid id);
    Task<Result<UserResponse>> CreateAsync(UserRequest request);
    Task<Result<UserResponse>> UpdateAsync(UserRequest request);
    Task<Result<UserResponse>> UpdateProfileAsync(UserProfileRequest request);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> DeleteListAsync(List<Guid> ids);
    Task<Result> LockUserAsync(Guid id);
}
