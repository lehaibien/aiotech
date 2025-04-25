namespace Application.Posts.Dtos;

public record PostListItemResponse(
    Guid Id,
    string Title,
    string Slug,
    string ThumbnailUrl,
    DateTime CreatedDate
);
