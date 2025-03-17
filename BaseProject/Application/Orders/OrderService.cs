using System.Data;
using System.Linq.Expressions;
using System.Security.Claims;
using Application.Helpers;
using Application.Mail;
using Application.Notification;
using Application.Options;
using Application.Orders.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using QuestPDF.Fluent;
using Shared;

namespace Application.Orders;

[RegisterClassAsScoped]
public class OrderService : IOrderService
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    // private readonly IDiscountService _discountService;
    private readonly VnPayOption _option;
    private readonly IEmailService _emailService;
    private readonly IHubContext<NotificationHub, INotificationClient> _notificationHubContext;
    private readonly MomoLibrary _momoLibrary;

    public OrderService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor,
        IOptions<VnPayOption> option,
        IEmailService emailService,
        IHubContext<NotificationHub, INotificationClient> notificationHubContext,
        MomoLibrary momoLibrary
    // IDiscountService discountService
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
        _option = option.Value;
        _emailService = emailService;
        _notificationHubContext = notificationHubContext;
        _momoLibrary = momoLibrary;
        // _discountService = discountService;
    }

    public async Task<Result<PaginatedList>> GetListAsync(
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
        var totalRow = await orderQuery.CountAsync(cancellationToken);
        var result = await orderQuery
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new OrderResponse
            {
                Id = x.Id,
                TrackingNumber = x.TrackingNumber,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber,
                Address = x.Address,
                Tax = x.Tax,
                TotalPrice = x.TotalPrice,
                Status = x.Status.ToString(),
                Note = x.Note,
                DeliveryDate = x.DeliveryDate,
                CancelReason = x.CancelReason,
                PaymentProvider = x.Payment.Provider.ToString(),
                CreatedDate = x.CreatedDate,
                CreatedBy = x.CreatedBy,
                UpdatedDate = x.UpdatedDate,
                UpdatedBy = x.UpdatedBy,
            })
            .ToListAsync(cancellationToken);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = totalRow,
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<OrderResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .Select(x => new OrderResponse
            {
                Id = x.Id,
                TrackingNumber = x.TrackingNumber,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber,
                PaymentProvider = x.Payment.Provider.ToString(),
                Address = x.Address,
                Tax = x.Tax,
                TotalPrice = x.TotalPrice,
                Status = x.Status.ToString(),
                DeliveryDate = x.DeliveryDate,
                Note = x.Note,
                CreatedDate = x.CreatedDate,
                OrderItems = x
                    .OrderItems.Select(y => new OrderItemResponse
                    {
                        ProductId = y.ProductId,
                        ProductName = y.Product.Name,
                        Price = (double)y.Product.Price,
                        Quantity = y.Quantity,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
            return Result<OrderResponse>.Failure("Đơn hàng không tồn tại");

        return Result<OrderResponse>.Success(entity);
    }

    public async Task<Result<List<OrderResponse>>> GetByUsername(string username)
    {
        var entities = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(x => x.Customer.UserName == username)
            .Select(x => new OrderResponse
            {
                Id = x.Id,
                TrackingNumber = x.TrackingNumber,
                // Name = x.Customer.FamilyName == null || x.Customer.FamilyName == ""
                //     ? x.Customer.GivenName
                //     : x.Customer.FamilyName + " " + x.Customer.GivenName,
                Name = x.Name,
                PhoneNumber = x.PhoneNumber,
                PaymentProvider = x.Payment.Provider.ToString(),
                Address = x.Address,
                TotalPrice = x.TotalPrice,
                Status = x.Status.ToString(),
                DeliveryDate = x.DeliveryDate,
                Note = x.Note,
                CreatedDate = x.CreatedDate,
            })
            .ToListAsync();
        return Result<List<OrderResponse>>.Success(entities);
    }

    public async Task<Result<List<OrderResponse>>> GetRecentOrders(int count)
    {
        var entities = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .OrderByDescending(x => x.CreatedDate)
            .Take(count)
            .Select(x => new OrderResponse
            {
                Id = x.Id,
                TrackingNumber = x.TrackingNumber,
                Name = x.Name,
                Address = x.Address,
                Tax = x.Tax,
                TotalPrice = x.TotalPrice,
                Status = x.Status.ToString(),
                DeliveryDate = x.DeliveryDate,
                Note = x.Note,
                CreatedDate = x.CreatedDate,
                CancelReason = x.CancelReason,
                PaymentProvider = x.Payment.Provider.ToString(),
                PhoneNumber = x.PhoneNumber,
            })
            .ToListAsync();
        return Result<List<OrderResponse>>.Success(entities);
    }

    public async Task<Result<string>> CreateUrl(OrderCheckoutRequest request)
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

        var entity = _mapper.Map<Order>(request);
        entity.Id = request.Id == Guid.Empty ? Guid.NewGuid() : request.Id;
        entity.TrackingNumber = GenerateTrackingNumber();
        entity.Status = OrderStatus.Pending;
        foreach (var item in entity.OrderItems)
        {
            item.Id = Guid.NewGuid();
            item.OrderId = entity.Id;
        }

        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
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

    public async Task<Result<OrderResponse>> Create(OrderRequest request)
    {
        var entity = _mapper.Map<Order>(request);
        entity.Id = request.Id == Guid.Empty ? Guid.NewGuid() : request.Id;
        entity.TrackingNumber = GenerateTrackingNumber();
        entity.Status = OrderStatus.Pending;
        var items = _mapper.Map<List<OrderItem>>(request.OrderItems);
        foreach (var item in items)
        {
            item.Id = Guid.NewGuid();
            item.OrderId = entity.Id;
        }

        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Add(entity);
        _unitOfWork.GetRepository<OrderItem>().AddRange(items);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<OrderResponse>(entity);
        response.OrderItems = _mapper.Map<List<OrderItemResponse>>(items);
        return Result<OrderResponse>.Success(response);
    }

    public async Task<Result<OrderResponse>> Update(OrderRequest request)
    {
        var isExists = await _unitOfWork.GetRepository<Order>().AnyAsync(x => x.Id != request.Id);
        if (isExists)
            return Result<OrderResponse>.Failure("Đơn hàng đã tồn tại");
        var entity = await _unitOfWork.GetRepository<Order>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
            return Result<OrderResponse>.Failure("Đơn hàng không tồn tại");
        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<OrderResponse>(entity);
        return Result<OrderResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(id);
        if (entity is null)
            return Result<string>.Failure("Đơn hàng không tồn tại");
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Order>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(id);
            if (entity is null)
                return Result<string>.Failure("Đơn hàng không tồn tại");
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Order>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result> ChangeStatus(OrderUpdateStatusRequest request)
    {
        var role = _contextAccessor
            .HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role)
            ?.Value;
        if (role == "Shipper" && request.Status != OrderStatus.Delivered)
        {
            return Result.Failure("Bạn không có quyền thực hiện hành động này");
        }
        if (role != "Admin" && role != "Shipper")
        {
            return Result.Failure("Bạn không có quyền thực hiện hành động này");
        }
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
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        await _notificationHubContext.Clients.All.ReceiveNotification(
            new NotificationModel(
                $"Đơn hàng {entity.TrackingNumber} đã được cập nhật sang trạng thái {Utilities.GetOrderStatusText(entity.Status)}"
            )
        );
        return Result.Success();
    }

    public async Task<Result<string>> ChangeStatusList(List<Guid> ids, OrderStatus status)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(id);
            if (entity is null)
                return Result<string>.Failure("Đơn hàng không tồn tại");
            entity.Status = status;
            entity.UpdatedDate = DateTime.UtcNow;
            entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            _unitOfWork.GetRepository<Order>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Cập nhật trạng thái thành công");
    }

    public async Task<Result<byte[]>> PrintReceipt(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (entity is null)
            return Result<byte[]>.Failure("Đơn hàng không tồn tại");
        var document = new OrderReceiptDocument(entity);
        var pdfBytes = Document.Create(document.Compose).GeneratePdf();
        return Result<byte[]>.Success(pdfBytes);
    }

    public async Task<Result> HandleCallbackPayment(IQueryCollection queryCollection)
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
            else if (!string.IsNullOrEmpty(partnerCode))
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

    public async Task<Result> Cancel(OrderCancelRequest request)
    {
        var order = await _unitOfWork.GetRepository<Order>().GetByIdAsync(request.Id);
        if (order is null)
        {
            return Result.Failure("Đơn hàng không tồn tại");
        }
        if (
            order.Status != OrderStatus.Pending
            && order.Status != OrderStatus.Paid
            && order.Status != OrderStatus.Processing
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
        order.UpdatedDate = DateTime.UtcNow;
        order.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Update(order);
        await _unitOfWork.SaveChangesAsync();
        await _notificationHubContext.Clients.All.ReceiveNotification(
            new NotificationModel($"Đơn hàng #{order.TrackingNumber} đã bị hủy")
        );
        return Result.Success();
    }

    public async Task<Result> Confirm(Guid id)
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
        order.UpdatedDate = DateTime.UtcNow;
        order.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Update(order);
        await _unitOfWork.SaveChangesAsync();
        await _notificationHubContext.Clients.All.ReceiveNotification(
            new NotificationModel($"Đơn hàng #{order.TrackingNumber} đã nhận hàng")
        );
        return Result.Success();
    }

    private string GenerateTrackingNumber()
    {
        var random = new Random();
        const string prefix = "ORD";
        string dateTimePart = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        int randomNumber = random.Next(100, 1000);
        return $"{prefix}{dateTimePart}{randomNumber}";
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
}
