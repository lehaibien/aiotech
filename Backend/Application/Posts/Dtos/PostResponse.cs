namespace Application.Posts.Dtos;

public record PostResponse(
    Guid Id,
    string Title,
    string Content,
    string ImageUrl,
    bool IsPublished,
    List<string> Tags,
    DateTime CreatedDate,
    DateTime? UpdatedDate
);