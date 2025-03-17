namespace Application.Helpers;

public class PaymentResponse
{
    public string OrderDescription { get; set; } = null!;
    public string TransactionId { get; set; } = null!;
    public string OrderId { get; set; } = null!;
    public string PaymentMethod { get; set; } = null!;
    public string PaymentId { get; set; } = null!;
    public decimal Amount { get; set; } = 0m;
    public DateTime PayDate { get; set; }
    public bool Success { get; set; }
    public string Token { get; set; } = null!;
    public string ResponseCode { get; set; } = null!;
}
