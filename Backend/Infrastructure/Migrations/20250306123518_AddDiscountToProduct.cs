using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDiscountToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Discount",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CouponCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DiscountPercentage = table.Column<int>(type: "int", nullable: false),
                    ValidUntil = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MinimumOrderAmount = table.Column<double>(type: "float(18)", precision: 18, scale: 2, nullable: false),
                    MaximumDiscountAmount = table.Column<double>(type: "float(18)", precision: 18, scale: 2, nullable: true),
                    Uses = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discount", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                column: "CreatedDate",
                value: new DateTime(2025, 3, 6, 19, 35, 17, 672, DateTimeKind.Local).AddTicks(9612));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                column: "CreatedDate",
                value: new DateTime(2025, 3, 6, 19, 35, 17, 672, DateTimeKind.Local).AddTicks(9629));

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedDate", "DeletedBy", "DeletedDate", "IsDeleted", "Name", "UpdatedBy", "UpdatedDate" },
                values: new object[] { new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"), "system", new DateTime(2025, 3, 6, 19, 35, 17, 672, DateTimeKind.Local).AddTicks(9632), null, null, false, "Shipper", null, null });

            migrationBuilder.AddForeignKey(
                name: "FK_CartItem_User_UserId",
                table: "CartItem",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItem_User_UserId",
                table: "CartItem");

            migrationBuilder.DropTable(
                name: "Discount");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                column: "CreatedDate",
                value: new DateTime(2025, 2, 23, 15, 29, 53, 70, DateTimeKind.Local).AddTicks(8009));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                column: "CreatedDate",
                value: new DateTime(2025, 2, 23, 15, 29, 53, 70, DateTimeKind.Local).AddTicks(8025));
        }
    }
}
