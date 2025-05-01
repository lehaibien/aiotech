namespace Application.Reviews.Dtos;

public record ReviewProductResponse(
    Guid Id,
    string? UserImageUrl,
    string UserName,
    string Comment,
    int Rating,
    DateTime CreatedDate
);
