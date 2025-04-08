using Application.Roles.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Roles;

public class RoleProfile : Profile
{
    public RoleProfile()
    {
        CreateMap<Role, RoleResponse>().ReverseMap();
        CreateMap<RoleRequest, Role>().ReverseMap();
        CreateMap<CreateRoleRequest, Role>().ReverseMap();
        CreateMap<UpdateRoleRequest, Role>().ReverseMap();
    }    
}