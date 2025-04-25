using Application.Users.Dtos;
using Domain.Entities;

namespace Application.Users;

public static class UserMapper
{
    public static IQueryable<UserResponse> ProjectToUserResponse(this IQueryable<User> source)
    {
        return source.Select(x => new UserResponse
        {
            Id = x.Id,
            UserName = x.UserName,
            AvatarUrl = x.AvatarUrl,
            GivenName = x.GivenName,
            FamilyName = x.FamilyName,
            Email = x.Email,
            PhoneNumber = x.PhoneNumber,
            CreatedDate = x.CreatedDate,
            CreatedBy = x.CreatedBy,
            UpdatedDate = x.UpdatedDate,
            UpdatedBy = x.UpdatedBy,
            IsLocked = x.IsLocked,
            IsDeleted = x.IsDeleted,
            Role = x.Role.Name,
        });
    }

    public static UserResponse MapToUserResponse(this User source)
    {
        return new UserResponse
        {
            Id = source.Id,
            UserName = source.UserName,
            AvatarUrl = source.AvatarUrl,
            GivenName = source.GivenName,
            FamilyName = source.FamilyName,
            Email = source.Email,
            PhoneNumber = source.PhoneNumber,
            CreatedDate = source.CreatedDate,
            CreatedBy = source.CreatedBy,
            UpdatedDate = source.UpdatedDate,
            UpdatedBy = source.UpdatedBy,
            IsLocked = source.IsLocked,
            IsDeleted = source.IsDeleted,
        };
    }

    public static User MapToUser(this UserRequest source)
    {
        return new User
        {
            UserName = source.UserName,
            GivenName = source.GivenName,
            FamilyName = source.FamilyName,
            Email = source.Email,
            PhoneNumber = source.PhoneNumber,
            RoleId = source.RoleId,
        };
    }

    public static User ApplyToUser(this UserRequest source, User user)
    {
        user.UserName = source.UserName ?? user.UserName;
        user.GivenName = source.GivenName ?? user.GivenName;
        user.FamilyName = source.FamilyName ?? user.FamilyName;
        user.Email = source.Email ?? user.Email;
        user.PhoneNumber = source.PhoneNumber ?? user.PhoneNumber;
        user.RoleId = source.RoleId == Guid.Empty ? user.RoleId : source.RoleId;
        return user;
    }
}