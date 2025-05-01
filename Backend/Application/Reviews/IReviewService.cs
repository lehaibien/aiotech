using Application.Reviews.Dtos;
using Application.Shared;

namespace Application.Reviews;

public interface IReviewService
{
    Task<Result<PaginatedList<ReviewResponse>>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<List<ReviewProductResponse>>> GetByProductIdAsync(
        GetListReviewByProductIdRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<ReviewResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<ReviewResponse>> CreateAsync(ReviewRequest request);
    Task<Result<ReviewResponse>> UpdateAsync(ReviewRequest request);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> DeleteListAsync(List<Guid> ids);
}
