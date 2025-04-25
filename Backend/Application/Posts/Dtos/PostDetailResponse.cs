namespace Application.Posts.Dtos;

public record PostDetailResponse(
    Guid Id,
    string Title,
    string Content,
    string ImageUrl,
    List<string> Tags,
    DateTime CreatedAt
);
