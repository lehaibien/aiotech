using Application.Authentication.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Authentication;

public class AuthenticationProfile : Profile
{
    public AuthenticationProfile()
    {
        CreateMap<AuthRegisterRequest, User>().ReverseMap();
    }
}