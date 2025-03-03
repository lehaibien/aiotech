using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Discounts;

public class DiscountService : IDiscountService
{
    private readonly IUnitOfWork _unitOfWork;

    public DiscountService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Discount>> GetDiscountByCode(string couponCode)
    {
        var discount = await _unitOfWork
            .GetRepository<Discount>()
            .GetAll(d => d.CouponCode == couponCode)
            .FirstOrDefaultAsync();
        if (discount is null)
        {
            return Result<Discount>.Failure("Mã giảm giá không tồn tại");
        }
        return Result<Discount>.Success(discount);
    }

    public async Task<Result> IsDiscountValid(string couponCode)
    {
        var discount = await _unitOfWork
            .GetRepository<Discount>()
            .GetAll(d => d.CouponCode == couponCode)
            .FirstOrDefaultAsync();
        if (discount is null)
        {
            return Result.Failure("Mã giảm giá không tồn tại");
        }
        if (discount.ValidUntil >= DateTime.Now && discount.Uses > 0)
        {
            return Result.Failure("Mã giảm giá đã hết hạn hoặc không còn hiệu lực");
        }
        return Result.Success();
    }

    public async Task<Result> ApplyDiscount(string couponCode)
    {
        var discount = await _unitOfWork
            .GetRepository<Discount>()
            .GetAll(d => d.CouponCode == couponCode)
            .FirstOrDefaultAsync();
        if (discount is null)
        {
            return Result.Failure("Mã giảm giá không tồn tại");
        }
        discount.Uses--;
        _unitOfWork.GetRepository<Discount>().Update(discount);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }
}
