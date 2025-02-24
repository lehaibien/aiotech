using Shared;

namespace Application.Products.Dtos;

public class GetListProductRequest : GetListRequest
{
    public double MinPrice { get; set; } = 0;
    public double MaxPrice { get; set; } = double.MaxValue;
    public string? Categories { get; set; } = string.Empty;
    public string? Brands { get; set; } = string.Empty;
    public ProductSort? Sort { get; set; } = ProductSort.Default;
}

public enum ProductSort
{
    Default,
    PriceAsc,
    PriceDesc,
    Newest,
    Oldest,
}
