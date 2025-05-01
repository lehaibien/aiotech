using System.IdentityModel.Tokens.Jwt;
using Application.Abstractions;
using Application.Authentication.Dtos;
using Application.Helpers;
using Application.Images;
using Application.Jwt;
using Application.Mail;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.EntityFrameworkCore;
using Application.Shared;

namespace Application.Authentication;

public class AuthenticationService : IAuthenticationService
{
    private const string FolderUpload = "images/users";
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IJwtService _jwtService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;

    public AuthenticationService(
        IJwtService jwtService,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IEmailService emailService,
        IImageService imageService,
        IStorageService storageService
    )
    {
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _emailService = emailService;
        _imageService = imageService;
        _storageService = storageService;
    }

    public async Task<Result<TokenResult>> Login(AuthLoginRequest request)
    {
        var entity = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .Include(r => r.Role)
            .FirstOrDefaultAsync(u => u.UserName == request.UserName);
        if (entity is null)
        {
            return Result<TokenResult>.Failure("Tài khoản hoặc mật khẩu không chính xác");
        }
        if (entity.IsLocked)
        {
            return Result<TokenResult>.Failure("Tài khoản đã bị khóa");
        }
        if (
            !EncryptionHelper.VerifyHashedPassword(
                entity.Password,
                Convert.FromBase64String(entity.Salt),
                request.Password
            )
        )
        {
            return Result<TokenResult>.Failure("Tài khoản hoặc mật khẩu không chính xác");
        }

        var accessToken = _jwtService.GenerateToken(entity);
        var refreshToken = _jwtService.GenerateRefreshToken();
        var response = new TokenResult(accessToken, refreshToken);
        return Result<TokenResult>.Success(response);
    }

    public async Task<Result<TokenResult>> SocialLogin(OAuthLoginRequest request)
    {
        var email = request.Email;
        var familyName = request.FamilyName;
        var givenName = request.GivenName;
        var imageUrl = request.ImageUrl;
        var user = await _unitOfWork.GetRepository<User>().FindAsync(u => u.Email == email);
        if (user is null)
        {
            var role = await _unitOfWork
                .GetRepository<Role>()
                .FindAsync(r => r.Name == CommonConst.DefaultRole)!;
            var randomPassword = Guid.NewGuid().ToString()[..8];
            var password = EncryptionHelper.HashPassword(randomPassword, out var salt);
            using var httpClient = new HttpClient();
            var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
            var fileName = email + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var fullName = fileName + ".png";
            const string contentType = "image/png";
            var stream = new MemoryStream(imageBytes);
            var file = new FormFile(stream, 0, stream.Length, fileName, fullName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType,
            };
            user = new User
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                FamilyName = familyName,
                GivenName = givenName,
                Password = password,
                Salt = Convert.ToBase64String(salt),
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "system",
                IsDeleted = false,
                RoleId = role.Id,
            };
            var uploadResult = await _storageService.UploadAsync(
                file,
                Path.Combine(FolderUpload, user.Id.ToString())
            );
            user.AvatarUrl = uploadResult.Url;
            _unitOfWork.GetRepository<User>().Add(user);
            await _unitOfWork.SaveChangesAsync();
        }

        var nRole = await _unitOfWork.GetRepository<Role>().FindAsync(r => r.Id == user.RoleId);
        if (nRole != null)
        {
            user.Role = nRole;
        }
        var accessToken = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();
        var response = new TokenResult(accessToken, refreshToken);
        return Result<TokenResult>.Success(response);
    }

    public async Task<Result> Register(AuthRegisterRequest request)
    {
        var isExist = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(u => u.UserName == request.UserName);
        if (isExist)
            return Result.Failure("Tài khoản đã tồn tại");
        var isEmailExist = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(u => u.Email == request.Email);
        if (isEmailExist)
            return Result.Failure("Địa chỉ email đã được sử dụng");
        var user = new User
        {
            UserName = request.UserName,
            FamilyName = request.FamilyName,
            GivenName = request.GivenName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
        };
        var role = await _unitOfWork
            .GetRepository<Role>()
            .FindAsync(r => r.Name == CommonConst.DefaultRole)!;
        user.RoleId = role.Id;
        user.Password = EncryptionHelper.HashPassword(request.Password, out var salt);
        user.Salt = Convert.ToBase64String(salt);
        user.CreatedDate = DateTime.UtcNow;
        user.CreatedBy = _contextAccessor.HttpContext?.User.Identity?.Name ?? "system";
        _unitOfWork.GetRepository<User>().Add(user);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result> ConfirmEmail(ConfirmEmailRequest request)
    {
        return null;
    }

    public async Task<Result<TokenResult>> RefreshToken(RefreshTokenRequest request)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(request.AccessToken);
        var userId = Guid.Parse(
            jwtToken.Claims.First(x => x.Type == JwtRegisteredClaimNames.NameId).Value
        );
        var user = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == userId);
        if (user is null)
        {
            return Result<TokenResult>.Failure("Người dùng không tồn tại");
        }
        // if (jwtToken.ValidTo < DateTime.UtcNow)
        // {
        //     return Result<TokenResult>.Failure("Token hết hạn");
        // }
        var accessToken = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();
        return Result<TokenResult>.Success(new TokenResult(accessToken, refreshToken));
    }

    public async Task<Result> ChangePassword(ChangePasswordRequest request)
    {
        if (
            string.Equals(
                request.OldPassword,
                request.NewPassword,
                StringComparison.InvariantCultureIgnoreCase
            )
        )
        {
            return Result.Failure("Mật khẩu cũ và mật khẩu mới không giống nhau");
        }
        var entity = await _unitOfWork.GetRepository<User>().GetByIdAsync(request.Id);
        if (entity is null)
        {
            return Result.Failure("Tài khoản không tồn tại");
        }
        if (
            !EncryptionHelper.VerifyHashedPassword(
                entity.Password,
                Convert.FromBase64String(entity.Salt),
                request.OldPassword
            )
        )
        {
            return Result.Failure("Mật khẩu cũ không đúng");
        }
        entity.Password = EncryptionHelper.HashPassword(request.NewPassword, out var salt);
        entity.Salt = Convert.ToBase64String(salt);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext?.User.Identity?.Name ?? "system";
        _unitOfWork.GetRepository<User>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result> ChangeEmail(ChangeEmailRequest request)
    {
        // generate url for change email
        var entity = await _unitOfWork.GetRepository<User>().GetByIdAsync(request.Id);
        if (entity is null)
        {
            return Result.Failure("Tài khoản không tồn tại");
        }
        var token = EncryptionHelper.GenerateSecureToken();
        var currentTime = DateTime.UtcNow;
        var changeEmail = new EmailChange
        {
            UserId = entity.Id,
            OldEmail = entity.Email,
            NewEmail = request.NewEmail,
            Token = token,
            CreatedDate = currentTime,
            ExpiryDate = currentTime.AddMinutes(15),
        };
        _unitOfWork.GetRepository<EmailChange>().Add(changeEmail);
        await _unitOfWork.SaveChangesAsync();
        var url = GenerateUrl(token);
        return Result.Success();
    }

    public async Task<Result> ConfirmChangeEmail(ConfirmChangeEmailRequest request)
    {
        var entity = await _unitOfWork
            .GetRepository<EmailChange>()
            .GetAll()
            .FirstOrDefaultAsync(x => x.Token == request.Token);
        if (entity is null)
        {
            return Result.Failure("Đường dẫn không hợp lệ");
        }
        if (entity.ExpiryDate < DateTime.UtcNow)
        {
            return Result.Failure("Đường dẫn đã hết hạn");
        }
        var user = await _unitOfWork.GetRepository<User>().GetByIdAsync(entity.UserId);
        if (user is null)
        {
            return Result.Failure("Tài khoản không tồn tại");
        }
        user.Email = entity.NewEmail;
        _unitOfWork.GetRepository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result> ResetPassword(ResetPasswordRequest request)
    {
        var user = await _unitOfWork.GetRepository<User>().FindAsync(x => x.Email == request.Email);
        if (user is null)
        {
            return Result.Failure("Email không tồn tại");
        }
        // send email to user
        return Result.Success();
    }

    private string GenerateUrl(string token)
    {
        var url = _contextAccessor.HttpContext?.Request.GetDisplayUrl();
        return $"{url}?token={token}";
    }
}
