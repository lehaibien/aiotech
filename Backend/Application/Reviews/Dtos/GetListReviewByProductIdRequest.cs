using Application.Shared;

namespace Application.Reviews.Dtos;

public class GetListReviewByProductIdRequest : GetListRequest
{
    public Guid ProductId { get; set; }
}
