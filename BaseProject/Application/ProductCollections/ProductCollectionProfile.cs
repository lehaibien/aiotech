using Application.ProductCollections.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.ProductCollections;

public class ProductCollectionProfile : Profile
{
    public ProductCollectionProfile()
    {
        CreateMap<ProductCollection, ProductCollectionResponse>().ReverseMap();
        CreateMap<ProductCollectionRequest, ProductCollection>().ReverseMap();
    }
}