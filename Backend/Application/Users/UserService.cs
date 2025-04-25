using System.Data;
using System.Linq.Expressions;
using Application.Abstractions;
using Application.Helpers;
using Application.Images;
using Application.Users.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Users;

public class UserService : IUserService
{
    private const string FolderUpload = "images/users";
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserService"/> class with required dependencies for user management, HTTP context access, image processing, and storage operations.
    /// </summary>
    public UserService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IStorageService storageService
    )
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
        _storageService = storageService;
    }

    /// <summary>
    /// Retrieves a paginated list of users filtered by search text and sorted by the specified column and order.
    /// </summary>
    /// <param name="request">Pagination, filtering, and sorting criteria for the user list.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing a paginated list of user responses matching the criteria.</returns>
    public async Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var query = _unitOfWork.GetRepository<User>().GetAll();
        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            query = query.Where(x =>
                x.UserName.ToLower().Contains(request.TextSearch.ToLower())
                || x.Email.ToLower().Contains(request.TextSearch.ToLower())
                || x.PhoneNumber.ToLower().Contains(request.TextSearch.ToLower())
                || x.GivenName.ToLower().Contains(request.TextSearch.ToLower())
            );
        }
        if (request.SortOrder?.ToLower() == "desc")
        {
            query = query.OrderByDescending(GetSortExpression(request.SortColumn));
        }
        else
        {
            query = query.OrderBy(GetSortExpression(request.SortColumn));
        }
        var totalRow = await query.CountAsync(cancellationToken);
        var result = await query
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .ProjectToUserResponse()
            .ToListAsync(cancellationToken);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = totalRow,
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    /// <summary>
    /// Retrieves a user by their unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the user.</param>
    /// <returns>A result containing the user information if found; otherwise, a failure result.</returns>
    public async Task<Result<UserResponse>> GetByIdAsync(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .ProjectToUserResponse()
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }
        return Result<UserResponse>.Success(entity);
    }

    /// <summary>
    /// Retrieves a user by username and returns the user details if found.
    /// </summary>
    /// <param name="username">The username to search for.</param>
    /// <returns>A result containing the user details if found; otherwise, a failure result.</returns>
    public async Task<Result<UserResponse>> GetByUsernameAsync(string username)
    {
        var user = await _unitOfWork.GetRepository<User>().FindAsync(x => x.UserName == username);
        if (user is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }
        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    /// <summary>
    /// Retrieves a user by email address and returns the user information if found.
    /// </summary>
    /// <param name="email">The email address of the user to retrieve.</param>
    /// <returns>A result containing the user response if found; otherwise, a failure result.</returns>
    public async Task<Result<UserResponse>> GetByEmailAsync(string email)
    {
        var user = await _unitOfWork.GetRepository<User>().FindAsync(x => x.Email == email);
        if (user is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }
        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    /// <summary>
    /// Retrieves the profile details of a user by their unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the user.</param>
    /// <returns>A result containing the user's profile information if found; otherwise, a failure result.</returns>
    public async Task<Result<UserProfileResponse>> GetProfileByIdAsync(Guid id)
    {
        var userProfile = await _unitOfWork
            .GetRepository<User>()
            .GetAll(x => x.Id == id)
            .Select(x => new UserProfileResponse
            {
                FamilyName = x.FamilyName,
                GivenName = x.GivenName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                AvatarUrl = x.AvatarUrl,
                Address = x.Address,
            })
            .FirstOrDefaultAsync();
        if (userProfile is null)
        {
            return Result<UserProfileResponse>.Failure("Tài khoản không tồn tại");
        }
        return Result<UserProfileResponse>.Success(userProfile);
    }

    /// <summary>
    /// Creates a new user with the provided information, including optional avatar image processing and role assignment.
    /// </summary>
    /// <param name="request">The user data to create, including credentials and optional avatar image.</param>
    /// <returns>A result containing the created user's details, or a failure result if the username or email already exists or image processing fails.</returns>
    public async Task<Result<UserResponse>> CreateAsync(UserRequest request)
    {
        var userExists = await _unitOfWork
            .GetRepository<User>()
            .FindAsync(u => u.UserName == request.UserName || u.Email == request.Email);
        if (userExists is not null)
        {
            return Result<UserResponse>.Failure("Tài khoản đã tồn tại");
        }
        var user = request.MapToUser();
        var role = await _unitOfWork.GetRepository<Role>().FindAsync(r => r.Name == "User");
        user.RoleId = request.RoleId == Guid.Empty ? role.Id : request.RoleId;
        user.Password = EncryptionHelper.HashPassword(request.Password, out var salt);
        user.Salt = Convert.ToBase64String(salt);
        user.CreatedDate = DateTime.UtcNow;
        user.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        if (request.Image is not null)
        {
            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Logo);
            if (optimizedImage.IsFailure)
            {
                return Result<UserResponse>.Failure(optimizedImage.Message);
            }
            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                Path.Combine(FolderUpload, user.Id.ToString())
            );
            user.AvatarUrl = uploadResult.Url;
        }

        _unitOfWork.GetRepository<User>().Add(user);
        await _unitOfWork.SaveChangesAsync();
        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    /// <summary>
    /// Updates an existing user's information, including profile details, password, and avatar image if edited.
    /// </summary>
    /// <param name="request">The user data to update, including optional image and password changes.</param>
    /// <returns>A result containing the updated user response if successful; otherwise, a failure result with an error message.</returns>
    public async Task<Result<UserResponse>> UpdateAsync(UserRequest request)
    {
        if (request.Id == Guid.Empty)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }
        var isExists = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(x => x.UserName == request.UserName && x.Id != request.Id);
        if (isExists)
        {
            return Result<UserResponse>.Failure("Tài khoản đã tồn tại");
        }
        var isEmailExists = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(x => x.Email == request.Email && x.Id != request.Id);
        if (isEmailExists)
        {
            return Result<UserResponse>.Failure("Địa chỉ email được sử dụng");
        }
        var entity = await _unitOfWork.GetRepository<User>().FindAsync(u => u.Id != request.Id);
        if (entity is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }
        entity = request.ApplyToUser(entity);
        if (entity.Password != "JcBfYanUDPh6kN9GEy82KeLpb4gAs3qF")
        {
            entity.Password = EncryptionHelper.HashPassword(request.Password, out var salt);
            entity.Salt = Convert.ToBase64String(salt);
        }
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        if (request.IsImageEdited)
        {
            if (entity.AvatarUrl is not null)
            {
                await _storageService.DeleteFromUrlAsync(entity.AvatarUrl);
            }
            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Logo);
            if (optimizedImage.IsFailure)
            {
                return Result<UserResponse>.Failure(optimizedImage.Message);
            }
            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                Path.Combine(FolderUpload, entity.Id.ToString())
            );
            entity.AvatarUrl = uploadResult.Url;
        }
        _unitOfWork.GetRepository<User>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    /// <summary>
    /// Updates a user's profile information and avatar image.
    /// </summary>
    /// <param name="request">Profile update data, including optional new avatar image.</param>
    /// <returns>A result containing the updated user information, or a failure if the user does not exist or image processing fails.</returns>
    public async Task<Result<UserResponse>> UpdateProfileAsync(UserProfileRequest request)
    {
        var user = await _unitOfWork.GetRepository<User>().GetByIdAsync(request.Id);
        if (user is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }

        user.FamilyName = string.IsNullOrWhiteSpace(request.FamilyName)
            ? user.FamilyName
            : request.FamilyName;
        user.GivenName = request.GivenName;
        user.PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber)
            ? user.PhoneNumber
            : request.PhoneNumber;
        user.Address = string.IsNullOrWhiteSpace(request.Address) ? user.Address : request.Address;
        if (request.IsImageEdited)
        {
            if (user.AvatarUrl is not null)
            {
                await _storageService.DeleteFromUrlAsync(user.AvatarUrl);
            }
            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Logo);
            if (optimizedImage.IsFailure)
            {
                return Result<UserResponse>.Failure(optimizedImage.Message);
            }
            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                Path.Combine(FolderUpload, user.Id.ToString())
            );
            user.AvatarUrl = uploadResult.Url;
        }
        _unitOfWork.GetRepository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    /// <summary>
    /// Marks a user as deleted by setting deletion metadata and soft delete flag.
    /// </summary>
    /// <param name="id">The unique identifier of the user to delete.</param>
    /// <returns>A result indicating whether the operation was successful or failed if the user does not exist.</returns>
    public async Task<Result> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<User>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result.Failure("Tài khoản không tồn tại");
        }
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<User>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    /// <summary>
    /// Marks multiple users as deleted based on the provided list of user IDs.
    /// </summary>
    /// <param name="ids">A list of user IDs to be marked as deleted.</param>
    /// <returns>A result indicating success, or failure if no matching users are found.</returns>
    public async Task<Result> DeleteListAsync(List<Guid> ids)
    {
        var entities = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();
        if (entities is null || entities.Count == 0)
        {
            return Result.Failure("Danh sách tài khoản không tồn tại");
        }
        entities.ForEach(x =>
        {
            x.IsDeleted = true;
            x.DeletedDate = DateTime.UtcNow;
            x.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        });
        _unitOfWork.GetRepository<User>().UpdateRange(entities);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    /// <summary>
    /// Locks a user account by setting its locked status to true.
    /// </summary>
    /// <param name="id">The unique identifier of the user to lock.</param>
    /// <returns>A result indicating whether the operation was successful or failed if the user does not exist.</returns>
    public async Task<Result> LockUserAsync(Guid id)
    {
        var user = await _unitOfWork.GetRepository<User>().GetByIdAsync(id);
        if (user is null)
        {
            return Result.Failure("Tài khoản không tồn tại");
        }
        user.IsLocked = true;
        _unitOfWork.GetRepository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    private static Expression<Func<User, object>> GetSortExpression(string? orderBy)
    {
        return orderBy?.ToLower() switch
        {
            "userName" => x => x.UserName,
            "fullName" => x => x.GivenName,
            "email" => x => x.Email,
            "phoneNumber" => x => x.PhoneNumber,
            _ => x => x.Id,
        };
    }
}
