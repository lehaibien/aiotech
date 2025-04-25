using Application.Posts.Dtos;
using Domain.Entities;

namespace Application.Posts;

public static class PostMapper
{
    public static PostResponse MapToPostResponse(this Post post)
    {
        return new PostResponse
        {
            Id = post.Id,
            Title = post.Title,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            IsPublished = post.IsPublished,
            Tags = post.Tags,
            CreatedDate = post.CreatedDate,
            UpdatedDate = post.UpdatedDate,
        };
    }

    public static PostListItemResponse MapToPostListItemResponse(this Post post)
    {
        return new PostListItemResponse(
            post.Id,
            post.Title,
            post.Slug,
            post.ThumbnailUrl,
            post.CreatedDate
        );
    }

    public static PostDetailResponse MapToPostDetailResponse(this Post post)
    {
        return new PostDetailResponse(
            post.Id,
            post.Title,
            post.Content,
            post.ImageUrl,
            post.Tags,
            post.CreatedDate
        );
    }

    // Request

    public static Post MapToPost(this PostRequest request)
    {
        return new Post
        {
            Title = request.Title,
            Slug = request.Slug,
            Content = request.Content,
            IsPublished = request.IsPublished,
            Tags = request.Tags,
        };
    }

    public static Post ApplyToPost(this PostRequest request, Post post)
    {
        post.Title = request.Title;
        post.Slug = request.Slug;
        post.Content = request.Content;
        post.IsPublished = request.IsPublished;
        post.Tags = request.Tags;

        return post;
    }

    // Projection
    public static IQueryable<PostListItemResponse> ProjectToPostListItemResponse(
        this IQueryable<Post> query
    )
    {
        return query.Select(p => new PostListItemResponse(
            p.Id,
            p.Title,
            p.Slug,
            p.ThumbnailUrl,
            p.CreatedDate
        ));
    }

    public static IQueryable<PostDetailResponse> ProjectToPostDetailResponse(
        this IQueryable<Post> query
    )
    {
        return query.Select(p => new PostDetailResponse(
            p.Id,
            p.Title,
            p.Content,
            p.ImageUrl,
            p.Tags,
            p.CreatedDate
        ));
    }
}
