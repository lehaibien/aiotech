using Application.Users.Dtos;
using Domain.Entities;

namespace Application.Users;

public static class UserMapper
{
    /// <summary>
    /// Projects a sequence of <see cref="User"/> entities to <see cref="UserResponse"/> DTOs, including role name.
    /// </summary>
    /// <param name="source">The queryable collection of <see cref="User"/> entities to project.</param>
    /// <returns>An <see cref="IQueryable{UserResponse}"/> representing the mapped user responses.</returns>
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

    /// <summary>
    /// Maps a <see cref="User"/> entity to a <see cref="UserResponse"/> DTO by copying user properties.
    /// </summary>
    /// <param name="source">The <see cref="User"/> entity to map.</param>
    /// <returns>A <see cref="UserResponse"/> containing the mapped user data.</returns>
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

    /// <summary>
    /// Creates a new <see cref="User"/> entity from the provided <see cref="UserRequest"/> by mapping user details and role ID.
    /// </summary>
    /// <param name="source">The user request containing data to populate the new user entity.</param>
    /// <returns>A new <see cref="User"/> entity with properties set from the request.</returns>
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

    /// <summary>
    /// Updates an existing <see cref="User"/> entity with non-null or non-default values from a <see cref="UserRequest"/>.
    /// </summary>
    /// <param name="source">The <see cref="UserRequest"/> containing updated user information.</param>
    /// <param name="user">The <see cref="User"/> entity to update.</param>
    /// <returns>The updated <see cref="User"/> entity.</returns>
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