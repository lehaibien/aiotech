using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddThumbnailAndSlugToPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Order_OrderId",
                table: "Payment");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Post",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "Post",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_PaymentId",
                table: "Payment",
                column: "OrderId",
                principalTable: "Order",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_PaymentId",
                table: "Payment");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Post");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "Post");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Order_OrderId",
                table: "Payment",
                column: "OrderId",
                principalTable: "Order",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
