using Application.Categories.Dtos;
using AutoMapper;

namespace Application.Categories;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<Domain.Entities.Category, CategoryResponse>().ReverseMap();
        CreateMap<CategoryRequest, Domain.Entities.Category>().ReverseMap();
        CreateMap<CreateCategoryRequest, Domain.Entities.Category>().ReverseMap();
        CreateMap<UpdateCategoryRequest, Domain.Entities.Category>().ReverseMap();
    }
}
