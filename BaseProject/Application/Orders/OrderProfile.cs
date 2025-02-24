using Application.Orders.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Orders;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Order, OrderResponse>().ReverseMap();
        CreateMap<OrderRequest, Order>().ReverseMap();
        CreateMap<OrderCheckoutRequest, Order>().ReverseMap();

        CreateMap<OrderItem, OrderItemResponse>().ReverseMap();
        CreateMap<OrderItemRequest, OrderItem>().ReverseMap();
    }
}