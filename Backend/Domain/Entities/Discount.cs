namespace Domain.Entities;

public class Discount
{
    public Guid Id { get; set; }
    public string CouponCode { get; set; } = null!;
    public int DiscountPercentage { get; set; }
    public DateTime ValidUntil { get; set; }
    public decimal MinimumOrderAmount { get; set; }
    public decimal? MaximumDiscountAmount { get; set; }
    public int? Uses { get; set; }
}
