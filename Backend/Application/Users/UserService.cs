using System.Linq.Expressions;
using Application.Abstractions;
using Application.Helpers;
using Application.Images;
using Application.Shared;
using Application.Users.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Users;

public class UserService : IUserService
{
    private const string FolderUpload = "images/users";
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;
    private readonly IUnitOfWork _unitOfWork;

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

    public async Task<Result<PaginatedList<UserResponse>>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var query = _unitOfWork.GetRepository<User>().GetAll();
        if(!string.IsNullOrEmpty(request.TextSearch))
        {
            query = query.Where(x =>
                x.UserName.ToLower().Contains(request.TextSearch.ToLower())
                || x.Email.ToLower().Contains(request.TextSearch.ToLower())
                || x.PhoneNumber.ToLower().Contains(request.TextSearch.ToLower())
                || x.GivenName.ToLower().Contains(request.TextSearch.ToLower())
            );
        }

        if(request.SortOrder?.ToLower() == "desc")
        {
            query = query.OrderByDescending(GetSortExpression(request.SortColumn));
        }
        else
        {
            query = query.OrderBy(GetSortExpression(request.SortColumn));
        }

        var dtoQuery = query.ProjectToUserResponse();
        var result = await PaginatedList<UserResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<UserResponse>>.Success(result);
    }

    public async Task<Result<UserResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork
            .GetRepository<User>()
            .GetAll(x => x.Id == id)
            .ProjectToUserResponse()
            .FirstOrDefaultAsync(cancellationToken);
        if(entity is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }

        return Result<UserResponse>.Success(entity);
    }

    public async Task<Result<UserResponse>> GetByUsernameAsync(string username,
        CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.GetRepository<User>()
            .FindAsync(x => x.UserName == username, true, cancellationToken);
        if(user is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }

        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    public async Task<Result<UserResponse>> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.GetRepository<User>().FindAsync(x => x.Email == email, true, cancellationToken);
        if(user is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }

        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    public async Task<Result<UserProfileResponse>> GetProfileByIdAsync(Guid id,
        CancellationToken cancellationToken = default)
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
                Address = x.Address
            })
            .FirstOrDefaultAsync(cancellationToken);
        if(userProfile is null)
        {
            return Result<UserProfileResponse>.Failure("Tài khoản không tồn tại");
        }

        return Result<UserProfileResponse>.Success(userProfile);
    }

    public async Task<Result<UserResponse>> CreateAsync(UserRequest request)
    {
        var userExists = await _unitOfWork
            .GetRepository<User>()
            .FindAsync(u => u.UserName == request.UserName || u.Email == request.Email);
        if(userExists is not null)
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
        if(request.Image is not null)
        {
            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Avatar);
            if(optimizedImage.IsFailure)
            {
                return Result<UserResponse>.Failure(optimizedImage.Message);
            }

            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, user.UserName)
            );
            user.AvatarUrl = uploadResult.Url;
        }

        _unitOfWork.GetRepository<User>().Add(user);
        await _unitOfWork.SaveChangesAsync();
        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    public async Task<Result<UserResponse>> UpdateAsync(UserRequest request)
    {
        if(request.Id == Guid.Empty)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }

        var isExists = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(x => x.UserName == request.UserName && x.Id != request.Id);
        if(isExists)
        {
            return Result<UserResponse>.Failure("Tài khoản đã tồn tại");
        }

        var isEmailExists = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(x => x.Email == request.Email && x.Id != request.Id);
        if(isEmailExists)
        {
            return Result<UserResponse>.Failure("Địa chỉ email được sử dụng");
        }

        var entity = await _unitOfWork.GetRepository<User>().FindAsync(u => u.Id != request.Id);
        if(entity is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }

        entity = request.ApplyToUser(entity);
        if(entity.Password != "JcBfYanUDPh6kN9GEy82KeLpb4gAs3qF")
        {
            entity.Password = EncryptionHelper.HashPassword(request.Password, out var salt);
            entity.Salt = Convert.ToBase64String(salt);
        }

        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        if(request.IsImageEdited)
        {
            if(entity.AvatarUrl is not null)
            {
                await _storageService.DeleteFromUrlAsync(entity.AvatarUrl);
            }

            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Avatar);
            if(optimizedImage.IsFailure)
            {
                return Result<UserResponse>.Failure(optimizedImage.Message);
            }

            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, entity.UserName)
            );
            entity.AvatarUrl = uploadResult.Url;
        }

        _unitOfWork.GetRepository<User>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    public async Task<Result<UserResponse>> UpdateProfileAsync(UserProfileRequest request)
    {
        var user = await _unitOfWork.GetRepository<User>().GetByIdAsync(request.Id);
        if(user is null)
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
        if(request.IsImageEdited)
        {
            if(user.AvatarUrl is not null)
            {
                await _storageService.DeleteFromUrlAsync(user.AvatarUrl);
            }

            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Avatar);
            if(optimizedImage.IsFailure)
            {
                return Result<UserResponse>.Failure(optimizedImage.Message);
            }

            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, user.UserName)
            );
            user.AvatarUrl = uploadResult.Url;
        }

        _unitOfWork.GetRepository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
        var response = user.MapToUserResponse();
        return Result<UserResponse>.Success(response);
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<User>().GetByIdAsync(id);
        if(entity is null)
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

    public async Task<Result> DeleteListAsync(List<Guid> ids)
    {
        var entities = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();
        if(entities is null || entities.Count == 0)
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

    public async Task<Result> LockUserAsync(Guid id)
    {
        var user = await _unitOfWork.GetRepository<User>().GetByIdAsync(id);
        if(user is null)
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
            _ => x => x.Id
        };
    }
}