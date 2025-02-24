namespace Application.Products.Dtos;

public class UpdateProductRequest : ProductRequest
{
    public Guid Id { get; set; }
}