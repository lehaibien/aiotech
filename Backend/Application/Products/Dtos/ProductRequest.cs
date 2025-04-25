using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Application.Products.Dtos;

public class ProductRequest
{
    public Guid Id { get; set; }
    public string Sku { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal CostPrice { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int Stock { get; set; }
    public Guid BrandId { get; set; }
    public Guid CategoryId { get; set; }
    public List<string> Tags { get; set; } = [];
    public IFormFile Thumbnail { get; set; } = null!;
    public List<IFormFile> Images { get; set; } = [];
    public bool IsFeatured { get; set; }
    public bool IsImageEdited { get; set; }
}

public class ProductRequestValidator : AbstractValidator<ProductRequest>
{
    /// <summary>
    /// Defines validation rules for the <see cref="ProductRequest"/> data transfer object using FluentValidation.
    /// </summary>
    public ProductRequestValidator()
    {
        RuleFor(x => x.Sku)
            .NotEmpty()
            .WithMessage("Mã sản phẩm không được để trống.")
            .MaximumLength(20)
            .WithMessage("Mã sản phẩm không được vượt quá 20 ký tự.");

        RuleFor(x => x.Name).NotEmpty().WithMessage("Tên sản phẩm không được để trống.");

        RuleFor(x => x.CostPrice)
            .NotEmpty()
            .WithMessage("Giá nhập sản phẩm không được để trống.")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Giá nhập sản phẩm không hợp lệ.");

        RuleFor(x => x.Price)
            .NotEmpty()
            .WithMessage("Giá sản phẩm không được để trống.")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Giá sản phẩm không hợp lệ.");

        RuleFor(x => x.DiscountPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Giá khuyến mãi sản phẩm không hợp lệ.");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Số lượng sản phẩm không hợp lệ.");

        RuleFor(x => x.Thumbnail).NotNull().WithMessage("Ảnh sản phẩm không được để trống.");

        RuleFor(x => x.Images).NotEmpty().WithMessage("Ảnh sản phẩm không được để trống.");
    }
}
