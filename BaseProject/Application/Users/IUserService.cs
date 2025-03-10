using Application.Users.Dtos;
using Shared;

namespace Application.Users;

public interface IUserService
{
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<UserResponse>> GetById(Guid id);
    Task<Result<UserResponse>> GetByUsername(string username);
    Task<Result<UserResponse>> GetByEmail(string email);
    Task<Result<UserProfileResponse>> GetProfileById(Guid id);
    Task<Result<UserResponse>> Create(CreateUserRequest request);
    Task<Result<UserResponse>> Update(UpdateUserRequest request);
    Task<Result<UserResponse>> UpdateProfile(UserProfileRequest request);
    Task<Result<string>> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
}
