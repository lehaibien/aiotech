namespace Application.Posts.Dtos;

public record PostUpdateResponse(
    Guid Id,
    string Title,
    string Slug,
    string Content,
    string ImageUrl,
    bool IsPublished,
    List<string> Tags
);
