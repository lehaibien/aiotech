using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeProductDescriptionLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Product",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                column: "CreatedDate",
                value: new DateTime(2025, 3, 9, 15, 22, 28, 896, DateTimeKind.Local).AddTicks(5761));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                column: "CreatedDate",
                value: new DateTime(2025, 3, 9, 15, 22, 28, 896, DateTimeKind.Local).AddTicks(5773));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"),
                column: "CreatedDate",
                value: new DateTime(2025, 3, 9, 15, 22, 28, 896, DateTimeKind.Local).AddTicks(5775));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Product",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

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

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"),
                column: "CreatedDate",
                value: new DateTime(2025, 3, 6, 19, 35, 17, 672, DateTimeKind.Local).AddTicks(9632));
        }
    }
}
