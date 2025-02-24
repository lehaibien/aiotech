using Application.Reviews.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Reviews;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<Review, ReviewResponse>().ReverseMap();
        CreateMap<ReviewRequest, Review>().ReverseMap();
        CreateMap<CreateReviewRequest, Review>().ReverseMap();
        CreateMap<UpdateReviewRequest, Review>().ReverseMap();
    }
}