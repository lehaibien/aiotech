using Application.Posts.Dtos;
using AutoMapper;
using Domain.Entities;

namespace Application.Posts;

public class PostProfile : Profile
{
    public PostProfile()
    {
        CreateMap<Post, PostResponse>().ReverseMap();
        CreateMap<Post, PostPreviewResponse>().ReverseMap();
        CreateMap<PostRequest, Post>().ReverseMap();
        CreateMap<CreatePostRequest, Post>().ReverseMap();
        CreateMap<UpdatePostRequest, Post>().ReverseMap();
    }
}
