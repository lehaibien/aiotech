using Application.Products.Dtos;

namespace Application.ProductCollections.Dtos;

public class ProductCollectionResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public List<ProductResponse> Products { get; set; } = [];
}