using Application.Carts.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Carts;

public class CartProfile : Profile
{
    public CartProfile()
    {
        CreateMap<CartItem, CartItemResponse>().ReverseMap();
    }
}