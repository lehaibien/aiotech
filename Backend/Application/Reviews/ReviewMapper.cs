using Application.Reviews.Dtos;
using Domain.Entities;

namespace Application.Reviews;

public static class ReviewMapper
{
    public static ReviewResponse MapToReviewResponse(this Review review)
    {
        return new ReviewResponse
        {
            Id = review.Id,
            UserName = review.User.UserName,
            ProductName = review.Product.Name,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedDate = review.CreatedDate,
            UpdatedDate = review.UpdatedDate,
        };
    }

    public static ReviewProductResponse MapToReviewProductResponse(this Review review)
    {
        return new ReviewProductResponse(
            review.Id,
            review.User.AvatarUrl,
            review.User.UserName,
            review.Comment,
            review.Rating,
            review.CreatedDate
        );
    }

    public static Review MapToReview(this ReviewRequest request)
    {
        return new Review
        {
            ProductId = request.ProductId,
            UserId = request.UserId,
            Rating = request.Rating,
            Comment = request.Comment,
        };
    }

    public static Review ApplyToReview(this ReviewRequest request, Review review)
    {
        review.ProductId = request.ProductId;
        review.UserId = request.UserId;
        review.Rating = request.Rating;
        review.Comment = request.Comment;
        return review;
    }

    // Projection
    public static IQueryable<ReviewResponse> ProjectToReviewResponse(this IQueryable<Review> query)
    {
        return query.Select(x => new ReviewResponse
        {
            Id = x.Id,
            UserName = x.User.UserName,
            ProductName = x.Product.Name,
            Rating = x.Rating,
            Comment = x.Comment,
            CreatedDate = x.CreatedDate,
            UpdatedDate = x.UpdatedDate,
        });
    }

    public static IQueryable<ReviewProductResponse> ProjectToReviewProductResponse(
        this IQueryable<Review> query
    )
    {
        return query.Select(x => new ReviewProductResponse(
            x.Id,
            x.User.AvatarUrl,
            x.User.UserName,
            x.Comment,
            x.Rating,
            x.CreatedDate
        ));
    }
}
