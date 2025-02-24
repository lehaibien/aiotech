using Application.Roles.Dtos;
using Shared;

namespace Application.Roles;

public interface IRoleService
{
    Task<Result<PaginatedList>> GetList(GetListRequest request);
    Task<Result<RoleResponse>> GetById(Guid id);
    Task<Result<RoleResponse>> Create(CreateRoleRequest request);
    Task<Result<RoleResponse>> Update(UpdateRoleRequest request);
    Task<Result<string>> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
    Task<Result<List<ComboBoxItem>>> GetComboBox();
}