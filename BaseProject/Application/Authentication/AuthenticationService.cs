using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Application.Authentication.Dtos;
using Application.Helpers;
using Application.Images;
using Application.Jwt;
using Application.Mail;
using Application.Users.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Authentication;

[RegisterClassAsScoped]
public class AuthenticationService : IAuthenticationService
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IJwtService _jwtService;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IImageService _imageService;

    public AuthenticationService(
        IJwtService jwtService,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IMapper mapper,
        IEmailService emailService,
        IImageService imageService
    )
    {
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _mapper = mapper;
        _emailService = emailService;
        _imageService = imageService;
    }

    public async Task<Result<TokenResult>> Login(AuthLoginRequest request)
    {
        var entity = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .Include(r => r.Role)
            .FirstOrDefaultAsync(u => u.UserName == request.UserName);
        if (entity is null)
            return Result<TokenResult>.Failure("Tài khoản hoặc mật khẩu không chính xác");
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
                .FindAsync(r => r.Name == CommonConst.DefaultRole);
            var randomPassword = Guid.NewGuid().ToString()[..8];
            var password = EncryptionHelper.HashPassword(randomPassword, out var salt);
            using var httpClient = new HttpClient();
            var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
            var fileName = email + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var fullName = fileName + ".png";
            var contentType = "image/png";
            var stream = new MemoryStream(imageBytes);
            var file = new FormFile(stream, 0, stream.Length, fileName, fullName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType,
            };
            var newImageUrl = string.Empty;
            var uploadImageResult = await _imageService.UploadAsync(file, ImageType.Logo, "user");
            if (uploadImageResult.IsSuccess)
            {
                newImageUrl = uploadImageResult.Data;
            }
            user = new User
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                FamilyName = familyName,
                GivenName = givenName,
                Password = password,
                Salt = Convert.ToBase64String(salt),
                AvatarUrl = newImageUrl,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "system",
                IsDeleted = false,
                RoleId = role.Id,
            };
            _unitOfWork.GetRepository<User>().Add(user);
            await _unitOfWork.SaveChangesAsync();
        }

        user.Role = await _unitOfWork.GetRepository<Role>().FindAsync(r => r.Id == user.RoleId);
        var accessToken = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();
        var response = new TokenResult(accessToken, refreshToken);
        return Result<TokenResult>.Success(response);
    }

    public async Task<Result<string>> Register(AuthRegisterRequest request)
    {
        var isExist = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(u => u.UserName == request.UserName);
        if (isExist)
            return Result<string>.Failure("Tài khoản đã tồn tại");
        var isEmailExist = await _unitOfWork
            .GetRepository<User>()
            .AnyAsync(u => u.Email == request.Email);
        if (isEmailExist)
            return Result<string>.Failure("Địa chỉ email đã được sử dụng");
        var user = _mapper.Map<User>(request);
        /*if (request.Avatar is not null)
        {
            var avatar = await FileHandler.SaveFileAsync(request.Avatar, "UserAvatar");
            user.AvatarUrl = avatar;
        }*/
        var role = await _unitOfWork.GetRepository<Role>().FindAsync(r => r.Name == "User");
        if (role == null)
        {
            var newRole = new Role
            {
                Id = Guid.NewGuid(),
                Name = "User",
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "system",
                IsDeleted = false,
            };
            _unitOfWork.GetRepository<Role>().Add(newRole);
            user.RoleId = newRole.Id;
        }
        else
        {
            user.RoleId = role.Id;
        }

        user.Password = EncryptionHelper.HashPassword(request.Password, out var salt);
        user.Salt = Convert.ToBase64String(salt);
        user.CreatedDate = DateTime.UtcNow;
        user.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<User>().Add(user);
        await _unitOfWork.SaveChangesAsync();
        var result = _mapper.Map<UserResponse>(user);
        result.Role = role?.Name ?? string.Empty;
        return Result<string>.Success("Đăng ký thành công");
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
            jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value
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
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<User>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result<string>> ChangeEmail(ChangeEmailRequest request)
    {
        // generate url for change email
        var entity = await _unitOfWork.GetRepository<User>().GetByIdAsync(request.Id);
        if (entity is null)
        {
            return Result<string>.Failure("Tài khoản không tồn tại");
        }
        var token = GenerateSecureToken();
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
        // generate url
        var url = GenerateUrl(token);
        // send email to user
        return Result<string>.Success(url);
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

    private string GenerateSecureToken(int length = 32)
    {
        // Define the length of the token in bytes (e.g., 32 bytes = 256 bits)
        byte[] randomBytes = new byte[length];

        // Use RandomNumberGenerator to generate random bytes
        RandomNumberGenerator.Fill(randomBytes);

        // Convert the random bytes to a Base64-encoded string for readability
        string token = Convert.ToBase64String(randomBytes);

        // Optionally, remove non-URL-safe characters (e.g., '+', '/', '=')
        token = token.Replace('+', '-').Replace('/', '_').TrimEnd('=');

        return token;
    }

    private string GenerateUrl(string token)
    {
        var url = _contextAccessor.HttpContext.Request.GetDisplayUrl();
        return $"{url}?token={token}";
    }
}
