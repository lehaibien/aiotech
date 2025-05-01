using System.Data;
using Application.Helpers;
using Application.Roles.Dtos;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Application.Roles;

public class RoleService : IRoleService
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IUnitOfWork _unitOfWork;

    public RoleService(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
    {
        _contextAccessor = contextAccessor;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<PaginatedList<RoleResponse>>> GetListAsync(GetListRequest request,
        CancellationToken cancellationToken = default)
    {
        SqlParameter totalRow = new()
        {
            ParameterName = "@oTotalRow", SqlDbType = SqlDbType.BigInt, Direction = ParameterDirection.Output
        };
        var parameters = new[]
        {
            new("@iTextSearch", request.TextSearch), new("@iPageIndex", request.PageIndex),
            new("@iPageSize", request.PageSize), totalRow
        };
        var result = await _unitOfWork
            .GetRepository<RoleResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetListRole, parameters, cancellationToken);
        var response =
            PaginatedList<RoleResponse>.Create(result, request.PageIndex, request.PageSize, (int) totalRow.Value);
        return Result<PaginatedList<RoleResponse>>.Success(response);
    }

    public async Task<Result<RoleResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.GetRepository<Role>().GetByIdAsync(id, cancellationToken);
        if(entity is null)
        {
            return Result<RoleResponse>.Failure("Vai trò không tồn tại");
        }

        var response = entity.MapToRoleResponse();
        return Result<RoleResponse>.Success(response);
    }

    public async Task<Result<RoleResponse>> CreateAsync(RoleRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Role>()
            .FindAsync(x => x.Name == request.Name);
        if(isExists != null)
        {
            return Result<RoleResponse>.Failure("Vai trò đã tồn tại");
        }

        var entity = request.MapToRole();
        _unitOfWork.GetRepository<Role>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToRoleResponse();
        return Result<RoleResponse>.Success(response);
    }

    public async Task<Result<RoleResponse>> UpdateAsync(RoleRequest request)
    {
        if(request.Id == Guid.Empty)
        {
            return Result<RoleResponse>.Failure("Vai trò không tồn tại");
        }

        var isExists = await _unitOfWork
            .GetRepository<Role>()
            .AnyAsync(x => x.Name == request.Name && x.Id != request.Id);
        if(isExists)
        {
            return Result<RoleResponse>.Failure("Vai trò đã tồn tại");
        }

        var entity = await _unitOfWork.GetRepository<Role>().FindAsync(x => x.Id == request.Id);
        if(entity is null)
        {
            return Result<RoleResponse>.Failure("Vai trò không tồn tại");
        }

        entity = request.ApplyToRole(entity);
        _unitOfWork.GetRepository<Role>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToRoleResponse();
        return Result<RoleResponse>.Success(response);
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Role>().GetByIdAsync(id);
        if(entity is null)
        {
            return Result.Failure("Vai trò không tồn tại");
        }

        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Role>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result> DeleteListAsync(List<Guid> ids)
    {
        foreach(var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Role>().GetByIdAsync(id);
            if(entity is null)
            {
                return Result.Failure("Vai trò không tồn tại");
            }

            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Role>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result<List<ComboBoxItem>>> GetComboBoxAsync(CancellationToken cancellationToken = default)
    {
        var result = await _unitOfWork
            .GetRepository<Role>()
            .GetAll()
            .Select(x => new ComboBoxItem { Text = x.Name, Value = x.Id.ToString() })
            .ToListAsync(cancellationToken);
        return Result<List<ComboBoxItem>>.Success(result);
    }
}