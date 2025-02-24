using System.Data;
using Application.Categories.Dtos;
using Application.Images;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Categories;

[RegisterClassAsScoped]
public class CategoryService : ICategoryService
{
    private const string FolderUpload = "categories";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;

    public CategoryService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
    }

    public async Task<Result<PaginatedList>> GetList(GetListRequest request)
    {
        SqlParameter totalRow = new()
        {
            ParameterName = "@oTotalRow",
            SqlDbType = SqlDbType.BigInt,
            Direction = ParameterDirection.Output,
        };
        var parameters = new SqlParameter[]
        {
            new("@iTextSearch", request.TextSearch),
            new("@iPageIndex", request.PageIndex),
            new("@iPageSize", request.PageSize),
            totalRow,
        };
        var result = await _unitOfWork
            .GetRepository<CategoryResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetListCategory, parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<CategoryResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<CategoryResponse>.Failure("Thể loại không tồn tại");
        }

        var response = _mapper.Map<CategoryResponse>(entity);
        return Result<CategoryResponse>.Success(response);
    }

    public async Task<Result<CategoryResponse>> Create(CreateCategoryRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Category>()
            .FindAsync(x => x.Name == request.Name);
        if (isExists != null)
        {
            return Result<CategoryResponse>.Failure("Thể loại đã tồn tại");
        }

        var entity = _mapper.Map<Category>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.Now;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<CategoryResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Data;
        _unitOfWork.GetRepository<Category>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<CategoryResponse>(entity);
        return Result<CategoryResponse>.Success(response);
    }

    public async Task<Result<CategoryResponse>> Update(UpdateCategoryRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Category>()
            .AnyAsync(x => x.Name == request.Name && x.Id != request.Id);
        if (isExists)
        {
            return Result<CategoryResponse>.Failure("Thể loại đã tồn tại");
        }

        var entity = await _unitOfWork.GetRepository<Category>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<CategoryResponse>.Failure("Thể loại không tồn tại");
        }

        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.Now;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        if (entity.ImageUrl is not null)
        {
            var deleteResult = await _imageService.Delete(entity.ImageUrl);
            if (deleteResult.IsFailure)
            {
                return Result<CategoryResponse>.Failure(deleteResult.Message);
            }
        }

        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<CategoryResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Data;
        _unitOfWork.GetRepository<Category>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<CategoryResponse>(entity);
        return Result<CategoryResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Thể loại không tồn tại");
        }

        entity.DeletedDate = DateTime.Now;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Category>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Thể loại không tồn tại");
            }

            entity.DeletedDate = DateTime.Now;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Category>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<List<ComboBoxItem>>> GetComboBox()
    {
        var result = await _unitOfWork
            .GetRepository<Category>()
            .GetAll(x => x.IsDeleted == false)
            .Select(x => new ComboBoxItem { Value = x.Id.ToString(), Text = x.Name })
            .ToListAsync();
        return Result<List<ComboBoxItem>>.Success(result);
    }
}
