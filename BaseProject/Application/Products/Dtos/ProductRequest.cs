using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Application.Products.Dtos;

public class ProductRequest
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "Mã sản phẩm không được để trống.")]
    public string? Sku { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên sản phẩm không được để trống.")]
    [MaxLength(100, ErrorMessage = "Tên sản phẩm không được vượt quá 100 ký tự.")]
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    [Required(ErrorMessage = "Giá sản phẩm không được để trống.")]
    [Range(0, double.MaxValue, ErrorMessage = "Giá sản phẩm không hợp lệ.")]
    public double Price { get; set; }
    public double? DiscountPrice { get; set; }

    [Required(ErrorMessage = "Số lượng sản phẩm không được để trống.")]
    [Range(0, int.MaxValue, ErrorMessage = "Số lượng sản phẩm không hợp lệ.")]
    public int Stock { get; set; }
    public Guid BrandId { get; set; }
    public Guid CategoryId { get; set; }
    public List<string> Tags { get; set; } = [];
    public List<IFormFile> Images { get; set; } = [];
    public bool IsFeatured { get; set; }
}
