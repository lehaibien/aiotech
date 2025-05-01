using System.Linq.Expressions;
using Application.Helpers;
using Application.Mail;
using Application.Notification;
using Application.Options;
using Application.Orders.Dtos;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using QuestPDF.Fluent;

namespace Application.Orders;

public class OrderService : IOrderService
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IEmailService _emailService;
    private readonly MomoLibrary _momoLibrary;
    private readonly IHubContext<NotificationHub, INotificationClient> _notificationHubContext;

    // private readonly IDiscountService _discountService;
    private readonly VnPayOption _option;
    private readonly IUnitOfWork _unitOfWork;

    public OrderService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IOptions<VnPayOption> option,
        IEmailService emailService,
        IHubContext<NotificationHub, INotificationClient> notificationHubContext,
        MomoLibrary momoLibrary
    // IDiscountService discountService
    )
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _option = option.Value;
        _emailService = emailService;
        _notificationHubContext = notificationHubContext;
        _momoLibrary = momoLibrary;
        // _discountService = discountService;
    }

    public async Task<Result<PaginatedList<OrderResponse>>> GetListAsync(
        OrderGetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var orderQuery = _unitOfWork.GetRepository<Order>().GetAll();
        if (request.Statuses.Count > 0)
        {
            orderQuery = orderQuery.Where(x => request.Statuses.Contains(x.Status));
        }

        if (request.CustomerId.HasValue && request.CustomerId != Guid.Empty)
        {
            orderQuery = orderQuery.Where(x => x.CustomerId == request.CustomerId);
        }

        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            orderQuery = orderQuery.Where(x =>
                x.Name.ToLower().Contains(request.TextSearch.ToLower())
                || x.PhoneNumber.ToLower().Contains(request.TextSearch.ToLower())
                || x.TrackingNumber.ToLower().Contains(request.TextSearch.ToLower())
            );
        }

        if (request.SortOrder?.ToLower() == "desc")
        {
            orderQuery = orderQuery.OrderByDescending(GetSortExpression(request.SortColumn));
        }
        else
        {
            orderQuery = orderQuery.OrderBy(GetSortExpression(request.SortColumn));
        }

        var dtoQuery = orderQuery.ProjectToOrderResponse();
        var result = await PaginatedList<OrderResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<OrderResponse>>.Success(result);
    }

    public async Task<Result<List<OrderResponse>>> GetByUsernameAsync(
        string username,
        CancellationToken cancellationToken = default
    )
    {
        var entities = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(x => x.Customer.UserName == username)
            .ProjectToOrderResponse()
            .ToListAsync(cancellationToken);
        return Result<List<OrderResponse>>.Success(entities);
    }

    public async Task<Result<List<OrderResponse>>> GetRecentOrdersAsync(
        int count,
        CancellationToken cancellationToken = default
    )
    {
        var entities = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .OrderByDescending(x => x.CreatedDate)
            .Take(count)
            .ProjectToOrderResponse()
            .ToListAsync(cancellationToken);
        return Result<List<OrderResponse>>.Success(entities);
    }

    public async Task<Result<OrderDetailResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(x => x.Id == id)
            .ProjectToOrderDetailResponse()
            .FirstOrDefaultAsync(cancellationToken);
        if (entity is null)
        {
            return Result<OrderDetailResponse>.Failure("Đơn hàng không tồn tại");
        }

        return Result<OrderDetailResponse>.Success(entity);
    }

    public async Task<Result<string>> CreateUrlAsync(OrderCheckoutRequest request)
    {
        var productIds = request.OrderItems.Select(x => x.ProductId);
        var products = _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => productIds.Contains(x.Id))
            .ToList();
        foreach (var product in products)
        {
            var productId = product.Id;
            var quantity =
                request.OrderItems.FirstOrDefault(x => x.ProductId == productId)?.Quantity ?? 0;
            if (product.Stock < quantity)
            {
                return Result<string>.Failure("Sản phẩm đã hết hàng");
            }
        }

        var entity = request.MapToOrder();
        entity.TrackingNumber = GenerateTrackingNumber();
        entity.Status = OrderStatus.Pending;
        foreach (var item in entity.OrderItems)
        {
            item.OrderId = entity.Id;
        }

        // if (!string.IsNullOrWhiteSpace(request.CouponCode))
        // {
        //     var discount = await _discountService.GetDiscountByCode(request.CouponCode);
        //     if (discount.IsSuccess)
        //     {
        //         var disc = discount.Data;
        //         var discountPercentage = disc.DiscountPercentage;
        //         if (entity.TotalPrice > disc.MinimumOrderAmount)
        //         {
        //             var orderDiscount = entity.TotalPrice * discountPercentage / 100;
        //             if (orderDiscount > disc.MaximumDiscountAmount)
        //             {
        //                 entity.TotalPrice -= disc.MaximumDiscountAmount ?? 0;
        //             }
        //             else
        //             {
        //                 entity.TotalPrice -= orderDiscount;
        //             }
        //         }
        //     }
        // }
        _unitOfWork.GetRepository<Order>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var url = request.Provider switch
        {
            PaymentProvider.VnPay => VnPayLibrary.CreatePaymentUrl(
                entity,
                _option,
                _contextAccessor.HttpContext
            ),
            PaymentProvider.Momo => await _momoLibrary.CreatePaymentUrlAsync(entity),
            _ => "",
        };
        return Result<string>.Success(url);
    }

    public async Task<Result<OrderResponse>> CreateAsync(OrderRequest request)
    {
        var entity = request.MapToOrder();
        entity.TrackingNumber = GenerateTrackingNumber();
        entity.Status = OrderStatus.Pending;
        var items = request.OrderItems.ConvertAll(x => x.MapToOrderItem());
        foreach (var item in items)
        {
            item.OrderId = entity.Id;
        }

        _unitOfWork.GetRepository<Order>().Add(entity);
        _unitOfWork.GetRepository<OrderItem>().AddRange(items);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToOrderResponseWithOrderItems();
        return Result<OrderResponse>.Success(response);
    }

    public async Task<Result<OrderResponse>> UpdateAsync(OrderRequest request)
    {
        var entity = await _unitOfWork.GetRepository<Order>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<OrderResponse>.Failure("Đơn hàng không tồn tại");
        }

        entity = request.ApplyToOrder(entity);
        _unitOfWork.GetRepository<Order>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToOrderResponse();
        return Result<OrderResponse>.Success(response);
    }

    public async Task<Result<string>> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Đơn hàng không tồn tại");
        }

        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Order>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteListAsync(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Đơn hàng không tồn tại");
            }

            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Order>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result> ChangeStatusAsync(OrderUpdateStatusRequest request)
    {
        var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(request.Id);
        if (entity is null)
        {
            return Result.Failure("Đơn hàng không tồn tại");
        }

        if (entity.Status == OrderStatus.Cancelled)
        {
            return Result.Failure("Đơn hàng đã bị hủy");
        }

        if (request.Status == OrderStatus.Delivered)
        {
            entity.DeliveryDate = DateTime.UtcNow;
        }

        if (
            entity.Status == OrderStatus.Delivered
            && request.Status != OrderStatus.Delivered
            && entity.Status != OrderStatus.Completed
        )
        {
            entity.DeliveryDate = null;
        }

        entity.Status = request.Status;
        _unitOfWork.GetRepository<Order>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        await _notificationHubContext.Clients.All.ReceiveNotification(
            new NotificationModel(
                $"Đơn hàng {entity.TrackingNumber} đã được cập nhật sang trạng thái {Utilities.GetOrderStatusText(entity.Status)}"
            )
        );
        return Result.Success();
    }

    public async Task<Result<string>> ChangeStatusListAsync(List<Guid> ids, OrderStatus status)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Đơn hàng không tồn tại");
            }

            entity.Status = status;
            _unitOfWork.GetRepository<Order>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Cập nhật trạng thái thành công");
    }

    public async Task<Result<byte[]>> PrintReceiptAsync(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (entity is null)
        {
            return Result<byte[]>.Failure("Đơn hàng không tồn tại");
        }

        var document = new OrderReceiptDocument(entity);
        var pdfBytes = Document.Create(document.Compose).GeneratePdf();
        return Result<byte[]>.Success(pdfBytes);
    }

    public async Task<Result> HandleCallbackPaymentAsync(IQueryCollection queryCollection)
    {
        queryCollection.TryGetValue("partnerCode", out var partnerCode);
        queryCollection.TryGetValue("vnp_BankCode", out var bankCode);
        var paymentResponse = new PaymentResponse();
        try
        {
            if (!string.IsNullOrWhiteSpace(bankCode))
            {
                var pay = new VnPayLibrary();
                paymentResponse = pay.GetFullResponseData(queryCollection, _option.HashSecret);
            }
            else if (!string.IsNullOrWhiteSpace(partnerCode))
            {
                paymentResponse = await _momoLibrary.PaymentExecuteAsync(queryCollection);
            }

            var orderId = Guid.Parse(paymentResponse.OrderId);
            if (!paymentResponse.Success)
            {
                var deleteOrder = await _unitOfWork.GetRepository<Order>().GetByIdAsync(orderId);
                if (deleteOrder is not null)
                {
                    _unitOfWork.GetRepository<Order>().Delete(deleteOrder);
                    await _unitOfWork.SaveChangesAsync();
                    return Result.Failure("Thanh toán không thành công");
                }
            }

            var payment = new Payment
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                TransactionId = paymentResponse.TransactionId,
                Provider = PaymentProvider.VnPay,
                Amount = Convert.ToDouble(paymentResponse.Amount),
                Description = paymentResponse.OrderDescription,
                CreatedDate = paymentResponse.PayDate,
            };

            var order = await _unitOfWork
                .GetRepository<Order>()
                .GetAll()
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == orderId);
            if (order is not null)
            {
                order.Status = OrderStatus.Paid;
                var cartItems = await _unitOfWork
                    .GetRepository<CartItem>()
                    .GetAll(x => x.UserId == order.CustomerId)
                    .ToListAsync();
                _unitOfWork.GetRepository<CartItem>().DeleteRange(cartItems);
                var products = await _unitOfWork
                    .GetRepository<Product>()
                    .GetAll(x => cartItems.Select(x => x.ProductId).Contains(x.Id))
                    .ToListAsync();
                foreach (var product in products)
                {
                    var item = cartItems.FirstOrDefault(x => x.ProductId == product.Id)!;
                    product.Stock -= item.Quantity;
                }

                _unitOfWork.GetRepository<Product>().UpdateRange(products);
                _unitOfWork.GetRepository<Payment>().Add(payment);
                _unitOfWork.GetRepository<Order>().Update(order);
                await _unitOfWork.SaveChangesAsync();
                await _emailService.SendTemplateAsync(
                    "lehaibien321@gmail.com",
                    "Đơn hàng mới",
                    "order-email",
                    new Dictionary<string, object>
                    {
                        { "trackingnumber", order.TrackingNumber },
                        { "name", order.Name ?? "" },
                        { "phonenumber", order.PhoneNumber ?? "" },
                        { "address", order.Address },
                        { "tax", order.Tax.ToString("N0") + " đ" },
                        { "totalprice", order.TotalPrice.ToString("N0") + " đ" },
                        { "note", order.Note ?? "Không" },
                        {
                            "items",
                            order.OrderItems.Select(x => new Dictionary<string, string>
                            {
                                { "name", x.Product.Name },
                                { "quantity", x.Quantity.ToString() },
                                { "price", x.Product.Price.ToString("N0") + " đ" },
                            })
                        },
                    }
                );
                await _notificationHubContext.Clients.All.ReceiveNotification(
                    new NotificationModel("Có 1 đơn hàng mới")
                );
            }
            else
            {
                return Result.Failure("Đơn hàng không tồn tại");
            }
        }
        catch
        {
            return Result.Failure("Thanh toán không thành công");
        }

        return Result.Success();
    }

    public async Task<Result> CancelAsync(OrderCancelRequest request)
    {
        var order = await _unitOfWork.GetRepository<Order>().GetByIdAsync(request.Id);
        if (order is null)
        {
            return Result.Failure("Đơn hàng không tồn tại");
        }

        if (
            order.Status
            is not OrderStatus.Pending
                and not OrderStatus.Paid
                and not OrderStatus.Processing
        )
        {
            return Result.Failure("Không thể hủy đơn hàng");
        }

        if (order.Status == OrderStatus.Cancelled)
        {
            return Result.Failure("Đơn hàng đã được hủy");
        }

        order.Status = OrderStatus.Cancelled;
        order.CancelReason = request.Reason;
        _unitOfWork.GetRepository<Order>().Update(order);
        await _unitOfWork.SaveChangesAsync();
        await _notificationHubContext.Clients.All.ReceiveNotification(
            new NotificationModel($"Đơn hàng #{order.TrackingNumber} đã bị hủy")
        );
        return Result.Success();
    }

    public async Task<Result> ConfirmAsync(Guid id)
    {
        var order = await _unitOfWork.GetRepository<Order>().GetByIdAsync(id);
        if (order is null)
        {
            return Result.Failure("Đơn hàng không tồn tại");
        }

        if (order.Status != OrderStatus.Delivered)
        {
            return Result.Failure("Không thể xác nhận đơn hàng");
        }

        order.Status = OrderStatus.Completed;
        _unitOfWork.GetRepository<Order>().Update(order);
        await _unitOfWork.SaveChangesAsync();
        await _notificationHubContext.Clients.All.ReceiveNotification(
            new NotificationModel($"Đơn hàng #{order.TrackingNumber} đã nhận hàng")
        );
        return Result.Success();
    }

    private static Expression<Func<Order, object>> GetSortExpression(string? orderBy)
    {
        return orderBy?.ToLower() switch
        {
            "name" => x => x.Name,
            "trackingnumber" => x => x.TrackingNumber,
            "phonenumber" => x => x.PhoneNumber,
            _ => x => x.Id,
        };
    }

    private static string GenerateTrackingNumber()
    {
        var datePart = DateTime.UtcNow.ToString("yyMMdd");

        var randomPart = Utilities.GetRandomAlphanumeric(10);

        return datePart + randomPart;
    }
}
