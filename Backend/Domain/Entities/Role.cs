namespace Domain.Entities;

public class Role : BaseEntity
{
    public Guid Id { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;

    public ICollection<User> Users { get; set; } = [];
}
