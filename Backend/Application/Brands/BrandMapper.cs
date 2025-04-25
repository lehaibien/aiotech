using Application.Brands.Dtos;
using Domain.Entities;

namespace Application.Brands;

public static class BrandMapper
{
    public static IQueryable<BrandResponse> ProjectToBrandResponse(this IQueryable<Brand> query)
    {
        return query.Select(x => new BrandResponse()
        {
            Id = x.Id,
            Name = x.Name,
            ImageUrl = x.ImageUrl,
            CreatedDate = x.CreatedDate,
            UpdatedDate = x.UpdatedDate,
        });
    }

    public static BrandResponse MapToBrandResponse(this Brand brand)
    {
        return new BrandResponse()
        {
            Id = brand.Id,
            Name = brand.Name,
            ImageUrl = brand.ImageUrl
        };
    }
    public static Brand MapToBrand(this BrandRequest brandRequest)
    {
        return new Brand()
        {
            Name = brandRequest.Name,
        };
    }

    public static Brand ApplyToBrand(this BrandRequest request, Brand brand)
    {
        brand.Name = request.Name;
        return brand;
    }
}