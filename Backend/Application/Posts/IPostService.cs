using Application.Posts.Dtos;
using Application.Shared;

namespace Application.Posts;

public interface IPostService
{
    Task<Result<PaginatedList<PostResponse>>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<PaginatedList<PostListItemResponse>>> GetListItemAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<List<PostListItemResponse>>> GetRelatedPostAsync(
        Guid id,
        CancellationToken cancellationToken = default
    );

    Task<Result<PostDetailResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    );

    Task<Result<PostDetailResponse>> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    );

    Task<Result<PostUpdateResponse>> GetForUpdateAsync(Guid id);

    Task<Result<PostResponse>> CreateAsync(PostRequest request);

    Task<Result<PostResponse>> UpdateAsync(PostRequest request);

    Task<Result<string>> DeleteAsync(Guid id);

    Task<Result<string>> DeleteListAsync(List<Guid> ids);
}
