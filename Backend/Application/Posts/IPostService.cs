using Application.Posts.Dtos;
using Shared;

namespace Application.Posts;

public interface IPostService
{
    /// <summary>
    /// Retrieves a paginated list of posts based on the specified request parameters.
    /// </summary>
    /// <param name="request">The filtering and pagination criteria for retrieving posts.</param>
    /// <returns>A result containing a paginated list of posts.</returns>
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Retrieves a paginated list of post items based on the specified request parameters.
    /// </summary>
    /// <param name="request">The parameters for filtering, sorting, and paginating the post items.</param>
    /// <returns>A result containing a paginated list of post items.</returns>
    Task<Result<PaginatedList>> GetListItemAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Retrieves a list of posts related to the specified post.
    /// </summary>
    /// <param name="id">The unique identifier of the post for which related posts are requested.</param>
    /// <returns>A result containing a list of related post items.</returns>
    Task<Result<List<PostListItemResponse>>> GetRelatedPostAsync(
        Guid id,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Retrieves detailed information for a post by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the post.</param>
    /// <returns>A result containing the post details if found; otherwise, an error result.</returns>
    Task<Result<PostDetailResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Retrieves detailed information for a post identified by its slug.
    /// </summary>
    /// <param name="slug">The unique slug string of the post.</param>
    /// <returns>A result containing the post details if found.</returns>
    Task<Result<PostDetailResponse>> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Creates a new post using the provided request data.
    /// </summary>
    /// <param name="request">The data for the post to be created.</param>
    /// <returns>A result containing the created post information.</returns>
    Task<Result<PostResponse>> CreateAsync(
        PostRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Updates an existing post with the provided data.
    /// </summary>
    /// <param name="request">The post data to update.</param>
    /// <returns>A result containing the updated post information.</returns>
    Task<Result<PostResponse>> UpdateAsync(
        PostRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Deletes a post identified by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the post to delete.</param>
/// <returns>A result containing a status message indicating the outcome of the deletion.</returns>
Task<Result<string>> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    /// <summary>
    /// Deletes multiple posts identified by their unique IDs.
    /// </summary>
    /// <param name="ids">A list of post GUIDs to delete.</param>
    /// <returns>A result containing a status message indicating the outcome of the deletion.</returns>
    Task<Result<string>> DeleteListAsync(
        List<Guid> ids,
        CancellationToken cancellationToken = default
    );
}
