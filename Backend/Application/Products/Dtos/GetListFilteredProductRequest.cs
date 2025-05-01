using Application.Shared;

namespace Application.Products.Dtos;

public class GetListFilteredProductRequest : GetListRequest
{
    public decimal MinPrice { get; set; } = 0;
    public decimal MaxPrice { get; set; } = 900000000;
    public string? Categories { get; set; } = string.Empty;
    public string? Brands { get; set; } = string.Empty;
    public ProductSort Sort { get; set; } = ProductSort.Default;
}

public enum ProductSort
{
    Default,
    PriceAsc,
    PriceDesc,
    Newest,
    Oldest
}