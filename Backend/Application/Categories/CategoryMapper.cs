using Application.Categories.Dtos;
using Domain.Entities;

namespace Application.Categories;

public static class CategoryMapper
{
    /// <summary>
    /// Projects an <see cref="IQueryable{Category}"/> to an <see cref="IQueryable{CategoryResponse}"/>, mapping each category entity to a response DTO with selected properties.
    /// </summary>
    /// <param name="query">The queryable collection of category entities to project.</param>
    /// <returns>An <see cref="IQueryable{CategoryResponse}"/> containing the mapped category responses.</returns>
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

    /// <summary>
    /// Maps a <see cref="Category"/> entity to a <see cref="CategoryResponse"/> DTO, copying the Id, Name, and ImageUrl properties.
    /// </summary>
    /// <param name="Category">The category entity to map.</param>
    /// <returns>A <see cref="CategoryResponse"/> containing the mapped properties.</returns>
    public static CategoryResponse MapToCategoryResponse(this Category Category)
    {
        return new CategoryResponse()
        {
            Id = Category.Id,
            Name = Category.Name,
            ImageUrl = Category.ImageUrl,
        };
    }

    /// <summary>
    /// Creates a new <see cref="Category"/> entity from a <see cref="CategoryRequest"/> DTO, setting the Name property.
    /// </summary>
    /// <param name="CategoryRequest">The DTO containing category data.</param>
    /// <returns>A new <see cref="Category"/> entity with the Name property set.</returns>
    public static Category MapToCategory(this CategoryRequest CategoryRequest)
    {
        return new Category() { Name = CategoryRequest.Name };
    }

    /// <summary>
    /// Updates the Name property of an existing Category entity using values from a CategoryRequest DTO.
    /// </summary>
    /// <param name="request">The CategoryRequest containing the new Name value.</param>
    /// <param name="Category">The Category entity to update.</param>
    /// <returns>The updated Category entity.</returns>
    public static Category ApplyToCategory(this CategoryRequest request, Category Category)
    {
        Category.Name = request.Name;
        return Category;
    }
}
