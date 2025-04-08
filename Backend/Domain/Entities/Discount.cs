namespace Domain.Entities;

public class Discount
{
    public Guid Id { get; set; }
    public string CouponCode { get; set; } = null!;
    public int DiscountPercentage { get; set; }
    public DateTime ValidUntil { get; set; }
    public double MinimumOrderAmount { get; set; }
    public double? MaximumDiscountAmount { get; set; }
    public int? Uses { get; set; }
}
