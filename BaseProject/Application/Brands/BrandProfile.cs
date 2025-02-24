using Application.Brands.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Brands;

public class BrandProfile : Profile
{
    public BrandProfile()
    {
        CreateMap<Brand, BrandResponse>().ReverseMap();
        CreateMap<BrandRequest, Brand>().ReverseMap();
        CreateMap<CreateBrandRequest, Brand>().ReverseMap();
        CreateMap<UpdateBrandRequest, Brand>().ReverseMap();
    }    
}