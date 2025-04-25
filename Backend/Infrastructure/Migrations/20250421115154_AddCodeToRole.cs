using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCodeToRole : Migration
    {
        /// <summary>
        /// Applies schema changes to add a "Code" column to the "Role" table and a "CostPrice" column to the "Product" table, and updates seed data for specific roles.
        /// </summary>
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Role",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "CostPrice",
                table: "Product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                columns: new[] { "Code", "CreatedDate", "Name" },
                values: new object[] { "admin", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Quản trị" });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                columns: new[] { "Code", "CreatedDate", "Name" },
                values: new object[] { "user", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Khách hàng" });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"),
                columns: new[] { "Code", "CreatedDate", "Name" },
                values: new object[] { "shipper", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Giao hàng" });
        }

        /// <summary>
        /// Reverts the schema and data changes made by the migration, removing the "Code" column from the "Role" table and the "CostPrice" column from the "Product" table, and restoring original "CreatedDate" and "Name" values for specific roles.
        /// </summary>
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Code",
                table: "Role");

            migrationBuilder.DropColumn(
                name: "CostPrice",
                table: "Product");

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                columns: new[] { "CreatedDate", "Name" },
                values: new object[] { new DateTime(2025, 4, 19, 1, 47, 50, 927, DateTimeKind.Utc).AddTicks(9150), "Admin" });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                columns: new[] { "CreatedDate", "Name" },
                values: new object[] { new DateTime(2025, 4, 19, 1, 47, 50, 927, DateTimeKind.Utc).AddTicks(9154), "User" });

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("b2f02c43-4d58-45d2-84a4-caf92a976672"),
                columns: new[] { "CreatedDate", "Name" },
                values: new object[] { new DateTime(2025, 4, 19, 1, 47, 50, 927, DateTimeKind.Utc).AddTicks(9156), "Shipper" });
        }
    }
}
