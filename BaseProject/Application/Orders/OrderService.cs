﻿using System.Data;
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
using Microsoft.Data.SqlClient;
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
    private readonly VnPayOption _option;
    private readonly IEmailService _emailService;
    private readonly IHubContext<NotificationHub, INotificationClient> _notificationHubContext;

    public OrderService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor,
        IOptions<VnPayOption> option,
        IEmailService emailService,
        IHubContext<NotificationHub, INotificationClient> notificationHubContext
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
        _option = option.Value;
        _emailService = emailService;
        _notificationHubContext = notificationHubContext;
    }

    public async Task<Result<PaginatedList>> GetList(OrderGetListRequest request)
    {
        SqlParameter totalRow = new()
        {
            ParameterName = "@oTotalRow",
            SqlDbType = SqlDbType.BigInt,
            Direction = ParameterDirection.Output,
        };
        var parameters = new[]
        {
            new(
                "@iCustomerId",
                request.CustomerId.HasValue ? request.CustomerId.Value : DBNull.Value
            ),
            // new("@iFromDate", request.FromDate.HasValue ? request.FromDate.Value : DBNull.Value),
            // new("@iToDate", request.ToDate.HasValue ? request.ToDate.Value : DBNull.Value),
            new("@iTextSearch", request.TextSearch),
            new("@iPageIndex", request.PageIndex),
            new("@iPageSize", request.PageSize),
            totalRow,
        };
        var result = await _unitOfWork
            .GetRepository<OrderResponse>()
            .ExecuteStoredProcedureAsync("usp_Order_GetList", parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
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

    public async Task<Result<string>> CreateUrl(OrderCheckoutRequest request)
    {
        // var isExists = await _unitOfWork.GetRepository<Domain.Entities.Order>()
        //     .FindAsync();
        // if (isExists != null)
        // {
        //     return Result<OrderResponse>.Failure("Đơn hàng đã tồn tại");
        // }
        var productIds = request.OrderItems.Select(x => x.ProductId);
        // Check if there are any products that are deleted or stock is more or equal to OrderItem quantity
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

        entity.CreatedDate = DateTime.Now;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var order = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .Include(x => x.Customer)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == entity.Id);
        var url = request.Provider switch
        {
            PaymentProvider.VnPay => VnPayLibrary.CreatePaymentUrl(
                order,
                _option,
                _contextAccessor.HttpContext
            ),
            _ => "",
        };
        // var url = VnPayLibrary.CreatePaymentUrl(order, _option.Value, _contextAccessor.HttpContext);
        return Result<string>.Success(url);
    }

    public async Task<Result<OrderResponse>> Create(OrderRequest request)
    {
        // var isExists = await _unitOfWork.GetRepository<Domain.Entities.Order>()
        //     .FindAsync();
        // if (isExists != null)
        // {
        //     return Result<OrderResponse>.Failure("Đơn hàng đã tồn tại");
        // }
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

        entity.CreatedDate = DateTime.Now;
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
        entity.UpdatedDate = DateTime.Now;
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
        entity.DeletedDate = DateTime.Now;
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
            entity.DeletedDate = DateTime.Now;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Order>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result> ChangeStatus(OrderUpdateStatusRequest request)
    {
        var entity = await _unitOfWork.GetRepository<Order>().GetByIdAsync(request.Id);
        if (entity is null)
            return Result.Failure("Đơn hàng không tồn tại");
        entity.Status = request.Status;
        if (entity.Status == OrderStatus.Delivered)
        {
            entity.DeliveryDate = DateTime.Now;
        }
        entity.UpdatedDate = DateTime.Now;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
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
            entity.UpdatedDate = DateTime.Now;
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
        try
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(queryCollection, _option.HashSecret);
            var orderId = Guid.Parse(response.OrderId);
            if (!response.Success)
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
                TransactionId = response.TransactionId,
                Provider = PaymentProvider.VnPay,
                Amount = Convert.ToDouble(response.Amount),
                Description = response.OrderDescription,
                CreatedDate = response.PayDate,
            };

            var order = await _unitOfWork.GetRepository<Order>().GetByIdAsync(orderId);
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
                _ = await _emailService.SendTemplateAsync(
                    "lehaibien321@gmail.com",
                    "Đơn hàng mới",
                    "order-email",
                    new Dictionary<string, object>
                    {
                        { "trackingnumber", order.TrackingNumber },
                        { "name", order.Name ?? "" },
                        { "phonenumber", order.PhoneNumber ?? "" },
                        { "address", order.Address },
                        { "totalprice", order.TotalPrice.ToString("N0") + " đ" },
                        { "note", order.Note ?? "Không" },
                    }
                );
                await _notificationHubContext.Clients.All.ReceiveNotification(
                    new NotificationModel($"Có 1 đơn hàng mới")
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
        order.UpdatedDate = DateTime.Now;
        order.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Order>().Update(order);
        await _unitOfWork.SaveChangesAsync();
        await _notificationHubContext.Clients.All.ReceiveNotification(
            new NotificationModel($"Đơn hàng #{order.TrackingNumber} đã bị hủy")
        );
        return Result.Success();
    }

    private string GenerateTrackingNumber()
    {
        var random = new Random();
        string prefix = "ORD";
        string dateTimePart = DateTime.Now.ToString("yyyyMMddHHmmss");
        int randomNumber = random.Next(100, 1000);
        string trackingNumber = $"{prefix}{dateTimePart}{randomNumber}";
        return trackingNumber;
    }
}
