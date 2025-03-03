using Application.Posts.Dtos;
using Shared;

namespace Application.Posts;

public interface IPostService
{
    Task<Result<PaginatedList>> GetListAsync(GetListRequest request);
    Task<Result<PaginatedList>> GetPostPreviewAsync(GetListRequest request);
    Task<Result<PostResponse>> GetByIdAsync(Guid id);
    Task<Result<PostResponse>> CreateAsync(CreatePostRequest request);
    Task<Result<PostResponse>> UpdateAsync(UpdatePostRequest request);
    Task<Result<string>> DeleteAsync(Guid id);
    Task<Result<string>> DeleteListAsync(List<Guid> ids);
}
