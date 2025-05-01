using System.ComponentModel.DataAnnotations;

namespace Application.Products.Dtos;

public class SearchProductRequest
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "Từ khóa tìm kiếm bắt buộc nhập")]
    public string TextSearch { get; set; } = "";

    public string? Category { get; set; }
    public int SearchLimit { get; set; }
}