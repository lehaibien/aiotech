using Application.Roles.Dtos;
using Application.Shared;

namespace Application.Roles;

public interface IRoleService
{
    Task<Result<PaginatedList<RoleResponse>>> GetListAsync(GetListRequest request,
        CancellationToken cancellationToken = default);

    Task<Result<RoleResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<RoleResponse>> CreateAsync(RoleRequest request);
    Task<Result<RoleResponse>> UpdateAsync(RoleRequest request);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> DeleteListAsync(List<Guid> ids);
    Task<Result<List<ComboBoxItem>>> GetComboBoxAsync(CancellationToken cancellationToken = default);
}