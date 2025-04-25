using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Application.Categories.Dtos;

public class CategoryRequest
{
    public Guid Id { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Tên danh mục không được để trống.")]
    [MaxLength(100, ErrorMessage = "Tên danh mục không được vượt quá 100 ký tự.")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Ảnh danh mục không được để trống.")]
    public IFormFile Image { get; set; } = null!;

    public bool IsImageEdited { get; set; }
}
