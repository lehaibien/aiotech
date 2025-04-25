namespace Application.Products.Dtos;

public class GetRelatedProductsRequest
{
    public Guid Id { get; set; }
    public int Limit { get; set; }
}
