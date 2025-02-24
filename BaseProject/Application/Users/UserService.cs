using System.Data;
using Application.Helpers;
using Application.Images;
using Application.Jwt;
using Application.Users.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Users;

[RegisterClassAsScoped]
public class UserService : IUserService
{
    private const string FolderUpload = "users";
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;

    public UserService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
    }

    public async Task<Result<PaginatedList>> GetList(GetListRequest request)
    {
        SqlParameter totalRow = new()
        {
            ParameterName = "@oTotalRow",
            SqlDbType = SqlDbType.BigInt,
            Direction = ParameterDirection.Output,
        };
        var parameters = new SqlParameter[]
        {
            new("@iTextSearch", request.TextSearch),
            new("@iPageIndex", request.PageIndex),
            new("@iPageSize", request.PageSize),
            totalRow,
        };
        var result = await _unitOfWork
            .GetRepository<UserResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetListUser, parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<UserResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<User>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }

        var response = _mapper.Map<UserResponse>(entity);
        return Result<UserResponse>.Success(response);
    }

    public async Task<Result<UserResponse>> GetByUsername(string username)
    {
        var user = await _unitOfWork.GetRepository<User>().FindAsync(x => x.UserName == username);
        if (user is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }
        return Result<UserResponse>.Success(_mapper.Map<UserResponse>(user));
    }

    public async Task<Result<UserResponse>> GetByEmail(string email)
    {
        var user = await _unitOfWork.GetRepository<User>().FindAsync(x => x.Email == email);
        if (user is null)
        {
            return Result<UserResponse>.Failure("Tài khoản không tồn tại");
        }
        return Result<UserResponse>.Success(_mapper.Map<UserResponse>(user));
    }

    public async Task<Result<UserProfileResponse>> GetProfileById(Guid id)
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

    public async Task<Result<UserResponse>> Create(CreateUserRequest request)
    {
        var userExists = await _unitOfWork
            .GetRepository<User>()
            .FindAsync(u => u.UserName == request.UserName || u.Email == request.Email);
        if (userExists is not null)
        {
            return Result<UserResponse>.Failure("Tài khoản đã tồn tại");
        }
        var user = _mapper.Map<User>(request);
        var role = await _unitOfWork.GetRepository<Role>().FindAsync(r => r.Name == "User");
        user.RoleId = request.RoleId == Guid.Empty ? role.Id : request.RoleId;
        user.Password = EncryptionHelper.HashPassword(request.Password, out var salt);
        user.Salt = Convert.ToBase64String(salt);
        user.CreatedDate = DateTime.Now;
        user.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            Path.Combine(FolderUpload, user.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<UserResponse>.Failure(uploadResult.Message);
        }

        user.AvatarUrl = uploadResult.Data;
        _unitOfWork.GetRepository<User>().Add(user);
        await _unitOfWork.SaveChangesAsync();
        var userResponse = _mapper.Map<UserResponse>(user);
        return Result<UserResponse>.Success(userResponse);
    }

    public async Task<Result<UserResponse>> Update(UpdateUserRequest request)
    {
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
        entity = _mapper.Map(request, entity);
        if (entity.Password != "JcBfYanUDPh6kN9GEy82KeLpb4gAs3qF")
        {
            entity.Password = EncryptionHelper.HashPassword(request.Password, out var salt);
            entity.Salt = Convert.ToBase64String(salt);
        }
        entity.UpdatedDate = DateTime.Now;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        if (entity.AvatarUrl is not null)
        {
            var deleteResult = await _imageService.Delete(entity.AvatarUrl);
            if (deleteResult.IsFailure)
            {
                return Result<UserResponse>.Failure(deleteResult.Message);
            }
        }

        if (request.Image is not null)
        {
            var uploadResult = await _imageService.UploadAsync(
                request.Image,
                Path.Combine(FolderUpload, entity.Id.ToString())
            );
            if (uploadResult.IsFailure)
            {
                return Result<UserResponse>.Failure(uploadResult.Message);
            }
            entity.AvatarUrl = uploadResult.Data;
        }

        _unitOfWork.GetRepository<User>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var userResponse = _mapper.Map<UserResponse>(entity);
        return Result<UserResponse>.Success(userResponse);
    }

    public async Task<Result<UserResponse>> UpdateProfile(UserProfileRequest request)
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
        if (user.AvatarUrl is not null)
        {
            var deleteResult = await _imageService.Delete(user.AvatarUrl);
            if (deleteResult.IsFailure)
            {
                return Result<UserResponse>.Failure(deleteResult.Message);
            }
        }

        if (request.Image is not null)
        {
            var uploadResult = await _imageService.UploadAsync(
                request.Image,
                Path.Combine(FolderUpload, user.Id.ToString())
            );
            if (uploadResult.IsFailure)
            {
                return Result<UserResponse>.Failure(uploadResult.Message);
            }

            user.AvatarUrl = uploadResult.Data;
        }
        _unitOfWork.GetRepository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<UserResponse>(user);
        return Result<UserResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<User>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Tài khoản không tồn tại");
        }
        entity.DeletedDate = DateTime.Now;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<User>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        var entities = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();
        if (entities is null || entities.Count == 0)
        {
            return Result<string>.Failure("Danh sách tài khoản không tồn tại");
        }
        entities.ForEach(x =>
        {
            x.IsDeleted = true;
            x.DeletedDate = DateTime.Now;
            x.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        });
        _unitOfWork.GetRepository<User>().UpdateRange(entities);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }
}
