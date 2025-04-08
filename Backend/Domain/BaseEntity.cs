using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Domain;

public class BaseEntity
{
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    [Unicode(false)]
    [MaxLength(255)]
    public string CreatedBy { get; set; } = "system";
    public DateTime? UpdatedDate { get; set; }

    [Unicode(false)]
    [MaxLength(255)]
    public string? UpdatedBy { get; set; }
    public DateTime? DeletedDate { get; set; }

    [Unicode(false)]
    [MaxLength(255)]
    public string? DeletedBy { get; set; }

    [Required]
    public bool IsDeleted { get; set; }
}
