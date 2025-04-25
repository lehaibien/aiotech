using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeparateThumbnailFromProductImages : Migration
    {
        /// <summary>
        /// Adds a non-nullable "ThumbnailUrl" column to the "Product" table with a default empty string value.
        /// </summary>
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <summary>
        /// Removes the "ThumbnailUrl" column from the "Product" table, reverting the schema change made in the Up method.
        /// </summary>
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "Product");
        }
    }
}
