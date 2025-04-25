using Application.Posts.Dtos;
using Application.Products.Dtos;
using Domain.Entities;

namespace Application.Products;

public static class ProductMapper
{
    /// <summary>
    /// Maps a <see cref="Product"/> entity to a <see cref="ProductResponse"/> DTO, including calculated average rating and related brand and category information.
    /// </summary>
    /// <param name="product">The product entity to map.</param>
    /// <returns>A <see cref="ProductResponse"/> containing the mapped product data.</returns>
    public static ProductResponse MapToProductResponse(this Product product)
    {
        return new ProductResponse()
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
            CreatedDate = product.CreatedDate,
        };
    }

    /// <summary>
    /// Maps a <see cref="Product"/> entity to a <see cref="ProductListItemResponse"/> DTO for use in product list displays.
    /// </summary>
    /// <returns>A <see cref="ProductListItemResponse"/> containing summary information, including average rating and tags.</returns>
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
            product.ThumbnailUrl,
            product.Tags
        );
    }

    /// <summary>
    /// Maps a <see cref="Product"/> entity to a <see cref="ProductDetailResponse"/> DTO, including detailed product information and average rating.
    /// </summary>
    /// <param name="product">The product entity to map.</param>
    /// <returns>A <see cref="ProductDetailResponse"/> containing detailed product data, including brand and category names, description, image URLs, tags, and the average rating calculated from reviews.</returns>
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
            Tags = product.Tags,
        };
    }

    /// <summary>
    /// Maps a <see cref="Product"/> entity to a <see cref="ProductUpdateResponse"/> DTO for update operations.
    /// </summary>
    /// <param name="product">The product entity to map.</param>
    /// <returns>A <see cref="ProductUpdateResponse"/> containing the product's updateable fields.</returns>
    public static ProductUpdateResponse MapToProductUpdateResponse(this Product product)
    {
        return new ProductUpdateResponse
        {
            Id = product.Id,
            Sku = product.Sku,
            Name = product.Name,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            Stock = product.Stock,
            BrandId = product.BrandId,
            CategoryId = product.CategoryId,
            IsFeatured = product.IsFeatured,
            Description = product.Description,
            ImageUrls = product.ImageUrls,
            Tags = product.Tags,
        };
    }

    /// <summary>
    /// Creates a new <see cref="Product"/> entity from the values in a <see cref="ProductRequest"/>.
    /// </summary>
    /// <returns>A new <see cref="Product"/> populated with the request's data.</returns>
    public static Product MapToProduct(this ProductRequest request)
    {
        return new Product
        {
            Sku = request.Sku,
            Name = request.Name,
            CostPrice = request.CostPrice,
            Price = request.Price,
            DiscountPrice = request.DiscountPrice,
            Stock = request.Stock,
            BrandId = request.BrandId,
            CategoryId = request.CategoryId,
            IsFeatured = request.IsFeatured,
            Tags = request.Tags,
        };
    }

    /// <summary>
    /// Updates an existing Product entity with values from a ProductRequest.
    /// </summary>
    /// <param name="request">The ProductRequest containing updated product data.</param>
    /// <param name="product">The Product entity to update.</param>
    /// <returns>The updated Product entity.</returns>
    public static Product ApplyToProduct(this ProductRequest request, Product product)
    {
        product.Sku = request.Sku;
        product.Name = request.Name;
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

    /// <summary>
    /// Projects an <see cref="IQueryable{Product}"/> to an <see cref="IQueryable{ProductResponse}"/>, mapping each product entity to a response DTO with relevant properties and computed average rating.
    /// </summary>
    public static IQueryable<ProductResponse> ProjectToProductResponse(
        this IQueryable<Product> query
    )
    {
        return query.Select(product => new ProductResponse()
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
            CreatedDate = product.CreatedDate,
        });
    }

    /// <summary>
    /// Projects a queryable collection of products to a queryable collection of product list item response DTOs.
    /// </summary>
    /// <param name="query">The queryable collection of <see cref="Product"/> entities.</param>
    /// <returns>A queryable collection of <see cref="ProductListItemResponse"/> DTOs with mapped properties and computed average ratings.</returns>
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
            product.ThumbnailUrl,
            product.Tags
        ));
    }
}
