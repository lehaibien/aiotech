using Application.Products.Dtos;
using Domain.Entities;

namespace Application.Products;

public static class ProductMapper
{
    public static ProductResponse MapToProductResponse(this Product product)
    {
        return new ProductResponse
        {
            Id = product.Id,
            Sku = product.Sku,
            Name = product.Name,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Stock = product.Stock,
            Brand = product.Brand.Name,
            Rating = product.Reviews.Count > 0 ? product.Reviews.Average(r => r.Rating) : 0,
            Category = product.Category.Name,
            CategoryId = product.CategoryId,
            BrandId = product.BrandId,
            ImageUrls = product.ImageUrls,
            IsFeatured = product.IsFeatured,
            CreatedDate = product.CreatedDate
        };
    }

    public static ProductListItemResponse MapToProductListItemResponse(this Product product)
    {
        return new ProductListItemResponse(
            product.Id,
            product.Name,
            product.Price,
            product.DiscountPrice,
            product.Stock,
            product.Brand.Name,
            product.Reviews.Count > 0 ? product.Reviews.Average(r => r.Rating) : 0,
            product.ThumbnailUrl
        );
    }

    public static ProductDetailResponse MapToProductDetailResponse(this Product product)
    {
        return new ProductDetailResponse
        {
            Id = product.Id,
            Sku = product.Sku,
            Name = product.Name,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Stock = product.Stock,
            Brand = product.Brand.Name,
            Category = product.Category.Name,
            Description = product.Description,
            ImageUrls = product.ImageUrls,
            Rating = product.Reviews.Count > 0 ? product.Reviews.Average(r => r.Rating) : 0,
            Tags = product.Tags
        };
    }

    public static ProductUpdateResponse MapToProductUpdateResponse(this Product product)
    {
        return new ProductUpdateResponse
        {
            Id = product.Id,
            Sku = product.Sku,
            Name = product.Name,
            Description = product.Description,
            CostPrice = product.CostPrice,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Stock = product.Stock,
            BrandId = product.BrandId,
            CategoryId = product.CategoryId,
            ThumbnailUrl = product.ThumbnailUrl,
            IsFeatured = product.IsFeatured,
            ImageUrls = product.ImageUrls,
            Tags = product.Tags
        };
    }

    // Request
    public static Product MapToProduct(this ProductRequest request)
    {
        return new Product
        {
            Sku = request.Sku,
            Name = request.Name,
            CostPrice = request.CostPrice,
            Price = request.Price,
            Description = request.Description,
            DiscountPrice = request.DiscountPrice,
            Stock = request.Stock,
            BrandId = request.BrandId,
            CategoryId = request.CategoryId,
            IsFeatured = request.IsFeatured,
            Tags = request.Tags
        };
    }

    public static Product ApplyToProduct(this ProductRequest request, Product product)
    {
        product.Sku = request.Sku;
        product.Name = request.Name;
        product.Description = request.Description;
        product.CostPrice = request.CostPrice;
        product.Price = request.Price;
        product.DiscountPrice = request.DiscountPrice;
        product.Stock = request.Stock;
        product.BrandId = request.BrandId;
        product.CategoryId = request.CategoryId;
        product.BrandId = request.BrandId;
        product.IsFeatured = request.IsFeatured;
        product.Tags = request.Tags;
        return product;
    }

    // Projection
    public static IQueryable<ProductResponse> ProjectToProductResponse(
        this IQueryable<Product> query
    )
    {
        return query.Select(product => new ProductResponse
        {
            Id = product.Id,
            Sku = product.Sku,
            Name = product.Name,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Stock = product.Stock,
            Brand = product.Brand.Name,
            Rating = product.Reviews.Count > 0 ? product.Reviews.Average(r => r.Rating) : 0,
            Category = product.Category.Name,
            CategoryId = product.CategoryId,
            BrandId = product.BrandId,
            ImageUrls = product.ImageUrls,
            IsFeatured = product.IsFeatured,
            CreatedDate = product.CreatedDate
        });
    }

    public static IQueryable<ProductListItemResponse> ProjectToProductListItemResponse(
        this IQueryable<Product> query
    )
    {
        return query.Select(product => new ProductListItemResponse(
            product.Id,
            product.Name,
            product.Price,
            product.DiscountPrice,
            product.Stock,
            product.Brand.Name,
            product.Reviews.Count > 0 ? product.Reviews.Average(r => r.Rating) : 0,
            product.ThumbnailUrl
        ));
    }

    public static IQueryable<ProductDetailResponse> ProjectToProductDetailResponse(
        this IQueryable<Product> query
    )
    {
        return query.Select(x => new ProductDetailResponse
        {
            Id = x.Id,
            Sku = x.Sku,
            Name = x.Name,
            Brand = x.Brand != null ? x.Brand.Name : "",
            Category = x.Category != null ? x.Category.Name : "",
            Rating = x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0,
            ImageUrls = x.ImageUrls,
            Price = x.Price,
            DiscountPrice = x.DiscountPrice,
            Stock = x.Stock,
            Description = x.Description,
            IsFeatured = x.IsFeatured,
            Tags = x.Tags
        });
    }
}