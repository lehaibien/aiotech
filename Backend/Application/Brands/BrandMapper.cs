using Application.Brands.Dtos;
using Domain.Entities;

namespace Application.Brands;

public static class BrandMapper
{
    /// <summary>
    /// Projects an <see cref="IQueryable{Brand}"/> to an <see cref="IQueryable{BrandResponse}"/>, selecting key brand properties for data transfer.
    /// </summary>
    /// <returns>An <see cref="IQueryable{BrandResponse}"/> representing the projected brand data.</returns>
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

    /// <summary>
    /// Maps a <see cref="Brand"/> entity to a <see cref="BrandResponse"/> DTO.
    /// </summary>
    /// <param name="brand">The brand entity to map.</param>
    /// <returns>A <see cref="BrandResponse"/> containing the brand's ID, name, and image URL.</returns>
    public static BrandResponse MapToBrandResponse(this Brand brand)
    {
        return new BrandResponse()
        {
            Id = brand.Id,
            Name = brand.Name,
            ImageUrl = brand.ImageUrl
        };
    }
    /// <summary>
    /// Creates a new <see cref="Brand"/> entity from the provided <see cref="BrandRequest"/>.
    /// </summary>
    /// <param name="brandRequest">The request containing brand details.</param>
    /// <returns>A new <see cref="Brand"/> entity with properties set from the request.</returns>
    public static Brand MapToBrand(this BrandRequest brandRequest)
    {
        return new Brand()
        {
            Name = brandRequest.Name,
        };
    }

    /// <summary>
    /// Updates the specified Brand entity's Name property using values from the BrandRequest.
    /// </summary>
    /// <param name="request">The BrandRequest containing updated brand information.</param>
    /// <param name="brand">The Brand entity to update.</param>
    /// <returns>The updated Brand entity.</returns>
    public static Brand ApplyToBrand(this BrandRequest request, Brand brand)
    {
        brand.Name = request.Name;
        return brand;
    }
}