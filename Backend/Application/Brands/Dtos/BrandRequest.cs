using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Application.Brands.Dtos;

public class BrandRequest
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên thương hiệu không được để trống")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Ảnh thương hiệu không được để trống")]
    public IFormFile Image { get; set; } = null!;
}
