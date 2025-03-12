using System.Data;
using Application.ProductCollections.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Shared;

namespace Application.ProductCollections;

[RegisterClassAsScoped]
public class ProductCollectionService : IProductCollectionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _contextAccessor;

    public ProductCollectionService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor contextAccessor)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
    }

    public async Task<Result<PaginatedList>> GetList(GetListRequest request)
    {
        SqlParameter totalRow = new()
        {
            ParameterName = "@oTotalRow",
            SqlDbType = SqlDbType.BigInt,
            Direction = ParameterDirection.Output
        };
        var parameters = new SqlParameter[]
        {
            new("@iTextSearch", request.TextSearch),
            new("@iPageIndex", request.PageIndex),
            new("@iPageSize", request.PageSize),
            totalRow
        };
        var result = await _unitOfWork.GetRepository<ProductCollectionResponse>()
            .ExecuteStoredProcedureAsync("usp_ProductCollection_GetList", parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
            Items = result
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<ProductCollectionResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<ProductCollection>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<ProductCollectionResponse>.Failure("Bộ sản phẩm không tồn tại");
        }

        var response = _mapper.Map<ProductCollectionResponse>(entity);
        return Result<ProductCollectionResponse>.Success(response);
    }

    public async Task<Result<ProductCollectionResponse>> Create(ProductCollectionRequest request)
    {
        var isExists = await _unitOfWork.GetRepository<ProductCollection>()
            .FindAsync(x => x.Name == request.Name);
        if (isExists != null)
        {
            return Result<ProductCollectionResponse>.Failure("Bộ sản phẩm đã tồn tại");
        }
        var entity = _mapper.Map<ProductCollection>(request);
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<ProductCollection>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ProductCollectionResponse>(entity);
        return Result<ProductCollectionResponse>.Success(response);
    }

    public async Task<Result<ProductCollectionResponse>> Update(ProductCollectionRequest request)
    {
        var isExists = await _unitOfWork.GetRepository<ProductCollection>()
            .AnyAsync(x => x.Name == request.Name && x.Id!= request.Id);
        if (isExists)
        {
            return Result<ProductCollectionResponse>.Failure("Bộ sản phẩm đã tồn tại");
        }
        var entity = await _unitOfWork.GetRepository<ProductCollection>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<ProductCollectionResponse>.Failure("Bộ sản phẩm không tồn tại");
        }
        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<ProductCollection>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ProductCollectionResponse>(entity);
        return Result<ProductCollectionResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<ProductCollection>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Bộ sản phẩm không tồn tại");
        }
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<ProductCollection>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<ProductCollection>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Bộ sản phẩm không tồn tại");
            }
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<ProductCollection>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }
}