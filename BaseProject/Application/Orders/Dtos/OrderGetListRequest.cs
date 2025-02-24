using Shared;

namespace Application.Orders.Dtos;

public class OrderGetListRequest : GetListRequest
{
    public Guid? CustomerId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    
}