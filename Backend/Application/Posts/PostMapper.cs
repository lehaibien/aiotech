using Application.Posts.Dtos;
using Domain.Entities;

namespace Application.Posts;

public static class PostMapper
{
    /// <summary>
    /// Maps a <see cref="Post"/> entity to a <see cref="PostResponse"/> DTO.
    /// </summary>
    /// <returns>A <see cref="PostResponse"/> containing the post's details.</returns>
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

    /// <summary>
    /// Maps a <see cref="Post"/> entity to a <see cref="PostListItemResponse"/> DTO.
    /// </summary>
    /// <returns>A <see cref="PostListItemResponse"/> containing summary information about the post.</returns>
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

    /// <summary>
    /// Maps a <see cref="Post"/> entity to a <see cref="PostDetailResponse"/> DTO.
    /// </summary>
    /// <returns>A <see cref="PostDetailResponse"/> containing detailed information about the post.</returns>
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

    /// <summary>
    /// Creates a new <see cref="Post"/> entity from the provided <see cref="PostRequest"/>.
    /// </summary>
    /// <returns>A <see cref="Post"/> initialized with values from the request.</returns>

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

    /// <summary>
    /// Updates an existing <see cref="Post"/> entity with values from a <see cref="PostRequest"/>.
    /// </summary>
    /// <param name="request">The request containing updated post data.</param>
    /// <param name="post">The post entity to update.</param>
    /// <returns>The updated <see cref="Post"/> entity.</returns>
    public static Post ApplyToPost(this PostRequest request, Post post)
    {
        post.Title = request.Title;
        post.Slug = request.Slug;
        post.Content = request.Content;
        post.IsPublished = request.IsPublished;
        post.Tags = request.Tags;

        return post;
    }

    /// <summary>
    /// Projects a queryable collection of Post entities to PostListItemResponse DTOs.
    /// </summary>
    /// <returns>An IQueryable of PostListItemResponse representing the projected posts.</returns>
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

    /// <summary>
    /// Projects a queryable collection of <see cref="Post"/> entities to a queryable collection of <see cref="PostDetailResponse"/> DTOs.
    /// </summary>
    /// <returns>
    /// An <see cref="IQueryable{PostDetailResponse}"/> representing the projected post details.
    /// </returns>
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
