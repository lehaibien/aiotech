﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Post",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                column: "CreatedDate",
                value: new DateTime(2025, 2, 21, 16, 16, 15, 0, DateTimeKind.Local).AddTicks(1212));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                column: "CreatedDate",
                value: new DateTime(2025, 2, 21, 16, 16, 15, 0, DateTimeKind.Local).AddTicks(1223));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Post");

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("85844e35-f6a0-4f8e-90c4-071366bf5ff6"),
                column: "CreatedDate",
                value: new DateTime(2025, 2, 21, 12, 21, 18, 804, DateTimeKind.Local).AddTicks(1039));

            migrationBuilder.UpdateData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("a8b42a83-b1bc-4937-99d9-0aaa70b896e5"),
                column: "CreatedDate",
                value: new DateTime(2025, 2, 21, 12, 21, 18, 804, DateTimeKind.Local).AddTicks(1052));
        }
    }
}
