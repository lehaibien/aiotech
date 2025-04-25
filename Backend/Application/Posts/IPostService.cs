using Application.Posts.Dtos;
using Shared;

namespace Application.Posts;

public interface IPostService
{
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<PaginatedList>> GetListItemAsync(
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
    Task<Result<PostResponse>> CreateAsync(
        PostRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<PostResponse>> UpdateAsync(
        PostRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<string>> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<string>> DeleteListAsync(
        List<Guid> ids,
        CancellationToken cancellationToken = default
    );
}
