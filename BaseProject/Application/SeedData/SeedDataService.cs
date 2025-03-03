using Application.Helpers;
using Bogus;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Application.SeedData;

public class SeedDataService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly Random _rng = new();
    private readonly Guid _adminRoleId = Guid.Parse("85844E35-F6A0-4F8E-90C4-071366BF5FF6");
    private readonly Guid _userRoleId = Guid.Parse("A8B42A83-B1BC-4937-99D9-0AAA70B896E5");
    private readonly string BaseStaticUrl =
        Environment.GetEnvironmentVariable("BE_StaticUrl") ?? "http://localhost:5554/static";

    public SeedDataService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task SeedData()
    {
        var reviews = await _unitOfWork.GetRepository<Review>().GetAll().ToListAsync();
        _unitOfWork.GetRepository<Review>().DeleteRange(reviews);
        var products = await _unitOfWork.GetRepository<Product>().GetAll().ToListAsync();
        _unitOfWork.GetRepository<Product>().DeleteRange(products);
        var brands = await _unitOfWork.GetRepository<Brand>().GetAll().ToListAsync();
        _unitOfWork.GetRepository<Brand>().DeleteRange(brands);
        var categories = await _unitOfWork.GetRepository<Category>().GetAll().ToListAsync();
        _unitOfWork.GetRepository<Category>().DeleteRange(categories);
        var users = await _unitOfWork.GetRepository<User>().GetAll().ToListAsync();
        _unitOfWork.GetRepository<User>().DeleteRange(users);
        var posts = await _unitOfWork.GetRepository<Post>().GetAll().ToListAsync();
        _unitOfWork.GetRepository<Post>().DeleteRange(posts);
        await _unitOfWork.SaveChangesAsync();
        await SeedBrands();
        await SeedCategories();
        await SeedUsers();
        await SeedProducts();
        await SeedReviews();
        await SeedPosts();
    }

    private async Task SeedBrands()
    {
        var brands = await File.ReadAllTextAsync("Data/brands.json");
        var brandData = JsonConvert.DeserializeObject<List<Brand>>(brands);
        brandData?.ForEach(x =>
        {
            x.ImageUrl = $"{BaseStaticUrl}/images/brands/asus/asus-logo.jpg";
            x.CreatedDate = DateTime.UtcNow.AddDays(-1 * _rng.Next(1, 101));
            x.CreatedBy = "seedservice";
        });
        if (brandData is null || brandData.Count == 0)
        {
            return;
        }
        _unitOfWork.GetRepository<Brand>().AddRange(brandData);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task SeedCategories()
    {
        // read the data from categories.json in the same folder
        var categories = await File.ReadAllTextAsync("Data/categories.json");
        var categoryData = JsonConvert.DeserializeObject<List<Category>>(categories);
        categoryData?.ForEach(x =>
        {
            x.ImageUrl = $"{BaseStaticUrl}/images/brands/asus/asus-logo.jpg";
            x.CreatedDate = DateTime.UtcNow.AddDays(-1 * _rng.Next(1, 101));
            x.CreatedBy = "seedservice";
        });
        if (categoryData is null || categoryData.Count == 0)
        {
            return;
        }
        _unitOfWork.GetRepository<Category>().AddRange(categoryData);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task SeedProducts()
    {
        List<string> tags =
        [
            "Gaming",
            "Office",
            "Design",
            "Student",
            "Home",
            "Workstation",
            "Developer",
            "Music",
            "Video",
            "Photo",
            "Gamer",
            "Streamer",
        ];
        var products = await File.ReadAllTextAsync("Data/products.json");
        var productData = JsonConvert.DeserializeObject<List<Product>>(products);
        productData?.ForEach(x =>
        {
            x.CreatedDate = DateTime.UtcNow.AddDays(-1 * _rng.Next(1, 101));
            x.CreatedBy = "seedservice";
            x.Tags = tags.OrderBy(_ => Guid.NewGuid()).Take(3).ToList();
            x.ImageUrls =
            [
                $"{BaseStaticUrl}/images/products/test/firstimage.png",
                $"{BaseStaticUrl}/images/products/test/secondimage.png",
            ];
        });
        if (productData is null || productData.Count == 0)
        {
            return;
        }
        _unitOfWork.GetRepository<Product>().AddRange(productData);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task SeedUsers()
    {
        var users = await File.ReadAllTextAsync("Data/users.json");
        var userData = JsonConvert.DeserializeObject<List<User>>(users);
        userData?.ForEach(x =>
        {
            x.CreatedDate = DateTime.UtcNow.AddDays(-1 * _rng.Next(1, 101));
            x.CreatedBy = "seedservice";
            x.Password = EncryptionHelper.HashPassword(x.UserName, out var salt);
            x.Salt = Convert.ToBase64String(salt);
            x.RoleId = x.UserName == "admin" ? _adminRoleId : _userRoleId;
        });
        if (userData is null || userData.Count == 0)
        {
            return;
        }
        _unitOfWork.GetRepository<User>().AddRange(userData);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task SeedReviews()
    {
        var reviews = await File.ReadAllTextAsync("Data/reviews.json");
        var reviewData = JsonConvert.DeserializeObject<List<Review>>(reviews);
        reviewData?.ForEach(x =>
        {
            x.CreatedDate = DateTime.UtcNow.AddDays(-1 * _rng.Next(1, 101));
            x.CreatedBy = "seedservice";
        });
        if (reviewData is null || reviewData.Count == 0)
        {
            return;
        }
        _unitOfWork.GetRepository<Review>().AddRange(reviewData);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task SeedPosts()
    {
        var posts = await File.ReadAllTextAsync("Data/posts.json");
        var postData = JsonConvert.DeserializeObject<List<Post>>(posts);
        postData?.ForEach(x =>
        {
            x.ImageUrl = $"{BaseStaticUrl}/images/posts/NotebookLM.webp";
            x.CreatedDate = DateTime.UtcNow.AddDays(-1 * _rng.Next(1, 101));
            x.CreatedBy = "seedservice";
        });
        if (postData is null || postData.Count == 0)
        {
            return;
        }
        _unitOfWork.GetRepository<Post>().AddRange(postData);
        await _unitOfWork.SaveChangesAsync();
    }
}
