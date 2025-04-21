namespace Domain.Entities;

public class Role : BaseEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public ICollection<User> Users { get; set; } = [];
}
