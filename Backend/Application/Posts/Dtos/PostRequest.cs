using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Application.Posts.Dtos;

public record PostRequest(
    Guid Id,
    string Title,
    string Slug,
    string Content,
    IFormFile Image,
    bool IsPublished,
    List<string> Tags,
    bool IsImageEdited
);

public class PostRequestValidator : AbstractValidator<PostRequest>
{
    public PostRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().WithMessage("Tiêu đề không được để trống");
        RuleFor(x => x.Slug).NotEmpty().WithMessage("Slug không được để trống");
        RuleFor(x => x.Content).NotEmpty().WithMessage("Nội dung không được để trống");
        RuleFor(x => x.Image).NotEmpty().WithMessage("Ảnh không được để trống");
    }
}
