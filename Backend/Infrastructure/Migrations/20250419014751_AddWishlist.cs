using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Product_Sku",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Post_Title",
                table: "Post");

            migrationBuilder.CreateTable(
                name: "WishlistItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WishlistItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WishlistItem_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WishlistItem_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                column: "CreatedDate",
                value: new DateTime(2025, 4, 19, 1, 47, 50, 927, DateTimeKind.Utc).AddTicks(9150));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                column: "CreatedDate",
                value: new DateTime(2025, 4, 19, 1, 47, 50, 927, DateTimeKind.Utc).AddTicks(9154));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"),
                column: "CreatedDate",
                value: new DateTime(2025, 4, 19, 1, 47, 50, 927, DateTimeKind.Utc).AddTicks(9156));

            migrationBuilder.CreateIndex(
                name: "IX_Product_Sku",
                table: "Product",
                column: "Sku");

            migrationBuilder.CreateIndex(
                name: "IX_Post_Title",
                table: "Post",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItem_ProductId",
                table: "WishlistItem",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_WishlistItem_UserId",
                table: "WishlistItem",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WishlistItem");

            migrationBuilder.DropIndex(
                name: "IX_Product_Sku",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Post_Title",
                table: "Post");

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                column: "CreatedDate",
                value: new DateTime(2025, 4, 2, 14, 26, 44, 691, DateTimeKind.Utc).AddTicks(4419));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                column: "CreatedDate",
                value: new DateTime(2025, 4, 2, 14, 26, 44, 691, DateTimeKind.Utc).AddTicks(4422));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"),
                column: "CreatedDate",
                value: new DateTime(2025, 4, 2, 14, 26, 44, 691, DateTimeKind.Utc).AddTicks(4424));

            migrationBuilder.CreateIndex(
                name: "IX_Product_Sku",
                table: "Product",
                column: "Sku",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Post_Title",
                table: "Post",
                column: "Title",
                filter: "IsPublished = 1");
        }
    }
}
