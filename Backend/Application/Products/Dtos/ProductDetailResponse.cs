﻿namespace Application.Products.Dtos;

public class ProductDetailResponse
{
    public Guid Id { get; set; }
    public string? Sku { get; set; } = string.Empty;
    public string Name { get; set; } = null!;
    public string? Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int Stock { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public double Rating { get; set; }
    public List<string> Tags { get; set; } = [];
    public List<string> ImageUrls { get; set; } = [];
    public bool IsFeatured { get; set; }
}