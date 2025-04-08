using Application.Products.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Products;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<Product, ProductResponse>();
        CreateMap<Product, ProductDetailResponse>();
        CreateMap<ProductRequest, Product>().ReverseMap();
        CreateMap<CreateProductRequest, Product>().ReverseMap();
        CreateMap<UpdateProductRequest, Product>().ReverseMap();
        CreateMap<Product, ProductUpdateResponse>();
    }
}
