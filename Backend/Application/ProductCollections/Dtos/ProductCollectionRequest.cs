using System.ComponentModel.DataAnnotations;

namespace Application.ProductCollections.Dtos;

public class ProductCollectionRequest
{
    public Guid Id { get; set; }
    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên bộ sản phẩm không được để trống")]
    public string? Name { get; set; }

    public List<Guid> ProductIds { get; set; } = [];
}