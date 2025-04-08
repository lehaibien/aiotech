using Domain.Entities;
using Shared;

namespace Application.Discounts;

public interface IDiscountService
{
    Task<Result<Discount>> GetDiscountByCode(string couponCode);
    Task<Result> IsDiscountValid(string couponCode);
    Task<Result> ApplyDiscount(string couponCode);
}
