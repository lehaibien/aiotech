using System.Data;
using Application.Helpers;
using Application.Roles.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Roles;

public class RoleService : IRoleService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _contextAccessor;

    public RoleService(IHttpContextAccessor contextAccessor, IMapper mapper, IUnitOfWork unitOfWork)
    {
        _contextAccessor = contextAccessor;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Retrieves a paginated list of roles based on search criteria.
    /// </summary>
    /// <param name="request">The pagination and search parameters.</param>
    /// <returns>A result containing the paginated list of roles.</returns>
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
            .GetRepository<RoleResponse>()
            .ExecuteStoredProcedureAsync("sp_Role_GetList", parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<RoleResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Role>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<RoleResponse>.Failure("Vai trò không tồn tại");
        }

        var response = _mapper.Map<RoleResponse>(entity);
        return Result<RoleResponse>.Success(response);
    }

    /// <summary>
    /// Creates a new role if a role with the same name does not already exist.
    /// </summary>
    /// <param name="request">The details of the role to create.</param>
    /// <returns>A result containing the created role information, or a failure if the role name already exists.</returns>
    public async Task<Result<RoleResponse>> Create(CreateRoleRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Role>()
            .FindAsync(x => x.Name == request.Name);
        if (isExists != null)
        {
            return Result<RoleResponse>.Failure("Vai trò đã tồn tại");
        }
        var entity = _mapper.Map<Role>(request);
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        _unitOfWork.GetRepository<Role>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<RoleResponse>(entity);
        return Result<RoleResponse>.Success(response);
    }

    /// <summary>
    /// Updates an existing role with new information.
    /// </summary>
    /// <param name="request">The update request containing the role ID and updated fields.</param>
    /// <returns>A result containing the updated role data if successful, or a failure message if the role does not exist or the name is already in use.</returns>
    public async Task<Result<RoleResponse>> Update(UpdateRoleRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Role>()
            .AnyAsync(x => x.Name == request.Name && x.Id != request.Id);
        if (isExists)
        {
            return Result<RoleResponse>.Failure("Vai trò đã tồn tại");
        }
        var entity = await _unitOfWork.GetRepository<Role>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<RoleResponse>.Failure("Vai trò không tồn tại");
        }
        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        _unitOfWork.GetRepository<Role>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<RoleResponse>(entity);
        return Result<RoleResponse>.Success(response);
    }

    /// <summary>
    /// Marks a role as deleted by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the role to delete.</param>
    /// <returns>A result indicating success or failure with a corresponding message.</returns>
    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Role>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Vai trò không tồn tại");
        }
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Role>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    /// <summary>
    /// Marks multiple roles as deleted by their IDs.
    /// </summary>
    /// <param name="ids">A list of role IDs to delete.</param>
    /// <returns>A result indicating success or failure of the deletion operation.</returns>
    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Role>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Vai trò không tồn tại");
            }
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Role>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    /// <summary>
    /// Retrieves all roles as a list of combo box items with role names and IDs.
    /// </summary>
    /// <returns>A result containing a list of combo box items representing roles.</returns>
    public async Task<Result<List<ComboBoxItem>>> GetComboBox()
    {
        var result = await _unitOfWork
            .GetRepository<Role>()
            .GetAll()
            .Select(x => new ComboBoxItem { Text = x.Name, Value = x.Id.ToString() })
            .ToListAsync();
        return Result<List<ComboBoxItem>>.Success(result);
    }
}
