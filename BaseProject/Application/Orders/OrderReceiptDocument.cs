using Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Application.Orders;

public class OrderReceiptDocument : IDocument
{
    private readonly Order _order;

    public OrderReceiptDocument(Order order)
    {
        _order = order;
    }

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public DocumentSettings GetSettings() => DocumentSettings.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(50);
            page.Size(PageSizes.A4);
            page.DefaultTextStyle(x => x.FontSize(12));

            page.Header().Element(ComposeHeader);
            page.Content().Element(ComposeContent);
            page.Footer()
                .AlignCenter()
                .Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
        });
    }

    void ComposeHeader(IContainer container)
    {
        // var iconBytes = File.ReadAllBytes("favicon.svg");
        container.Row(row =>
        {
            row.RelativeItem()
                .Column(column =>
                {
                    column
                        .Item()
                        .Column(c =>
                        {
                            c.Spacing(2);
                            // c.Item().Image(iconBytes);
                            c.Item().Text("AioTech").Bold().FontSize(20);
                        });
                    column.Item().PaddingBottom(10).LineHorizontal(1);
                });
        });
    }

    void ComposeContent(IContainer container)
    {
        container
            .PaddingVertical(10)
            .Column(column =>
            {
                column.Spacing(10);

                // Order Details
                column.Item().Text($"Đơn hàng #{_order.TrackingNumber}");
                column.Item().Text($"Ngày đặt hàng: {_order.CreatedDate:dd/MM/yyyy}");

                // Recipient Information
                column
                    .Item()
                    .Background(Colors.Grey.Lighten3)
                    .Padding(10)
                    .Column(c =>
                    {
                        c.Spacing(5);
                        c.Item().Text("Thông tin người nhận hàng:").Bold();
                        c.Item().Text("Họ và tên: " + _order.Name);
                        c.Item().Text("Số điện thoại: " + _order.PhoneNumber);
                        c.Item().Text("Địa chỉ: " + _order.Address);
                    });

                // Order Items Table
                column
                    .Item()
                    .Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(25); // Index
                            columns.RelativeColumn(2); // SKU
                            columns.RelativeColumn(3); // Product
                            columns.RelativeColumn(1); // Qty
                            columns.RelativeColumn(2); // Unit Price
                            columns.RelativeColumn(2); // Total
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("#");
                            header.Cell().Text("Mã sản phẩm").Bold();
                            header.Cell().Text("Tên sản phẩm").Bold();
                            header.Cell().AlignRight().Text("Số lượng").Bold();
                            header.Cell().AlignRight().Text("Đơn giá").Bold();
                            header.Cell().AlignRight().Text("Tổng cộng").Bold();

                            header.Cell().ColumnSpan(6).PaddingTop(5).LineHorizontal(1);
                        });

                        foreach (
                            var (item, index) in _order.OrderItems.Select((item, i) => (item, i))
                        )
                        {
                            var rowNumber = index + 1;
                            var lineTotal = item.Quantity * item.Price;

                            table.Cell().Element(CellStyle).Text(rowNumber.ToString());
                            table.Cell().Element(CellStyle).Text(item.Product?.Sku ?? "N/A");
                            table.Cell().Element(CellStyle).Text(item.Product?.Name ?? "N/A");
                            table
                                .Cell()
                                .Element(CellStyle)
                                .AlignRight()
                                .Text(item.Quantity.ToString());
                            table
                                .Cell()
                                .Element(CellStyle)
                                .AlignRight()
                                .Text(item.Price.ToString("N") + " đ");
                            table
                                .Cell()
                                .Element(CellStyle)
                                .AlignRight()
                                .Text(lineTotal.ToString("N") + " đ");
                        }

                        static IContainer CellStyle(IContainer container) =>
                            container
                                .BorderBottom(1)
                                .BorderColor(Colors.Grey.Lighten2)
                                .PaddingVertical(5);
                    });

                // Totals
                column
                    .Item()
                    .AlignRight()
                    .Column(c => c.Item().Text($"Tổng thanh toán: {_order.TotalPrice:N} đ").Bold());
            });
    }
}
