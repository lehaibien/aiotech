using Application.Users.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Users;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserResponse>().ReverseMap();
        CreateMap<User, UserRequest>().ReverseMap();
        CreateMap<CreateUserRequest, User>().ReverseMap();
        CreateMap<UpdateUserRequest, User>().ReverseMap();
    }
}