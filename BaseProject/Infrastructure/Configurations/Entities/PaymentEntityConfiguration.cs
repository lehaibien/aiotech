using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Entities;

public class PaymentEntityConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.HasKey(x => x.Id);
        builder
            .Property(x => x.Provider)
            .HasConversion(
                v => v.ToString(),
                v => (PaymentProvider)Enum.Parse(typeof(PaymentProvider), v)
            );
    }
}
