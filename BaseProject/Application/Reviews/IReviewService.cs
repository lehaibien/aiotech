using Application.Reviews.Dtos;
using Shared;

namespace Application.Reviews;

public interface IReviewService
{
    Task<Result<PaginatedList>> GetList(GetListRequest request);
    Task<Result<List<ReviewProductResponse>>> GetByProductId(
        GetListReviewByProductIdRequest request
    );
    Task<Result<ReviewResponse>> GetById(Guid id);
    Task<Result<ReviewResponse>> Create(CreateReviewRequest request);
    Task<Result<ReviewResponse>> Update(UpdateReviewRequest request);
    Task<Result> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
}
