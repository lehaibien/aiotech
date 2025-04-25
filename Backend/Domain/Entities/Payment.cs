namespace Domain.Entities;

public class Payment
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public string TransactionId { get; set; } = null!;
    public double Amount { get; set; }
    public string Description { get; set; } = null!;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public PaymentProvider Provider { get; set; }

    public Order Order { get; set; } = null!;
}

public enum PaymentProvider
{
    Cod,
    VnPay,
    Momo,
    Stripe,
}
