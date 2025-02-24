using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class ProductCollection : BaseEntity
{
    [Key]
    public Guid Id { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string Name { get; set; } = null!;

    // Navigation properties
    public virtual ICollection<Product> Products { get; set; } = [];
}
