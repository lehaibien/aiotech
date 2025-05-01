using Domain.Entities;
using Application.Shared;

namespace Application.Discounts;

public interface IDiscountService
{
    Task<Result<Discount>> GetDiscountByCodeAsync(string couponCode);
    Task<Result> IsDiscountValidAsync(string couponCode);
    Task<Result> ApplyDiscountAsync(string couponCode);
}
