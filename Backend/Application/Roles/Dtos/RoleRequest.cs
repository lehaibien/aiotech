using FluentValidation;

namespace Application.Roles.Dtos;

public record RoleRequest(
    Guid Id,
    string Code,
    string Name
);

public class RoleRequestValidator : AbstractValidator<RoleRequest>
{
    public RoleRequestValidator()
    {
        RuleFor(x => x.Code).NotEmpty().WithMessage("Mã vai trò không được để trống");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Tên vai trò không được để trống");
    }
}