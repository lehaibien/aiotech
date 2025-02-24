using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Application.Posts.Dtos;

public class PostRequest
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "Tiêu đề không được để trống")]
    public string Title { get; set; } = null!;

    [Required(AllowEmptyStrings = false, ErrorMessage = "Nội dung không được để trống")]
    public string Content { get; set; } = null!;
    public IFormFile Image { get; set; } = null!;
    public bool IsPublished { get; set; } = true;
    public List<string> Tags { get; set; } = [];
}
