using Application.Categories.Dtos;
using Domain.Entities;

namespace Application.Categories;

public static class CategoryMapper
{
    public static IQueryable<CategoryResponse> ProjectToCategoryResponse(
        this IQueryable<Category> query
    )
    {
        return query.Select(x => new CategoryResponse()
        {
            Id = x.Id,
            Name = x.Name,
            ImageUrl = x.ImageUrl,
            CreatedDate = x.CreatedDate,
            UpdatedDate = x.UpdatedDate,
        });
    }

    public static CategoryResponse MapToCategoryResponse(this Category Category)
    {
        return new CategoryResponse()
        {
            Id = Category.Id,
            Name = Category.Name,
            ImageUrl = Category.ImageUrl,
        };
    }

    public static Category MapToCategory(this CategoryRequest CategoryRequest)
    {
        return new Category() { Name = CategoryRequest.Name };
    }

    public static Category ApplyToCategory(this CategoryRequest request, Category Category)
    {
        Category.Name = request.Name;
        return Category;
    }
}
