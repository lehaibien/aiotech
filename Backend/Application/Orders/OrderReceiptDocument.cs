using Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Application.Orders;

public class OrderReceiptDocument : IDocument
{
    private readonly Order _order;
    private const string PrimaryColor = "#2d3748";
    private const string SecondaryColor = "#4a5568";

    public OrderReceiptDocument(Order order) => _order = order;

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public DocumentSettings GetSettings() => DocumentSettings.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(50);
            page.Size(PageSizes.A4);
            page.DefaultTextStyle(x => x.FontSize(12).FontColor(PrimaryColor));

            page.Header().Element(ComposeHeader);
            page.Content().Element(ComposeContent);
            page.Footer()
                .Height(30)
                .AlignCenter()
                .Text(x =>
                {
                    x.CurrentPageNumber().FontColor(SecondaryColor);
                    x.Span(" / ").FontColor(SecondaryColor);
                    x.TotalPages().FontColor(SecondaryColor);
                });
        });
    }

    void ComposeHeader(IContainer container)
    {
        container.Column(column =>
        {
            column.Spacing(10);

            column
                .Item()
                .Row(row =>
                {
                    row.RelativeItem()
                        .AlignLeft()
                        .Column(c =>
                        {
                            c.Item().Text("AioTech").Bold().FontSize(24).FontColor(PrimaryColor);
                            c.Item()
                                .Text("Hóa đơn mua hàng")
                                .FontColor(SecondaryColor)
                                .FontSize(14);
                        });

                    row.RelativeItem()
                        .AlignRight()
                        .Column(c =>
                        {
                            c.Item()
                                .Text($"Mã đơn: {_order.TrackingNumber}")
                                .FontColor(SecondaryColor);
                            c.Item()
                                .Text($"Ngày: {_order.CreatedDate:dd/MM/yyyy HH:mm}")
                                .FontColor(SecondaryColor);
                        });
                });

            column.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
        });
    }

    void ComposeContent(IContainer container)
    {
        container.Column(column =>
        {
            column.Spacing(15);

            // Recipient Information
            column
                .Item()
                .Background(Colors.Grey.Lighten3)
                .Border(1)
                .BorderColor(Colors.Grey.Lighten2)
                .Padding(15)
                .Column(c =>
                {
                    c.Spacing(8);
                    c.Item().Text("Thông tin người nhận").Bold().FontSize(14);
                    c.Item()
                        .Row(r =>
                        {
                            r.RelativeItem().Text("Họ tên:");
                            r.RelativeItem(2).Text(_order.Name).SemiBold();
                        });
                    c.Item()
                        .Row(r =>
                        {
                            r.RelativeItem().Text("Điện thoại:");
                            r.RelativeItem(2).Text(_order.PhoneNumber);
                        });
                    c.Item()
                        .Row(r =>
                        {
                            r.RelativeItem().Text("Địa chỉ:");
                            r.RelativeItem(2).Text(_order.Address);
                        });
                });

            // Order Items Table
            column.Item().Element(TableComponent);

            // Payment Summary
            column
                .Item()
                .PaddingTop(20)
                .AlignRight()
                .Width(200)
                .Column(c =>
                {
                    c.Item()
                        .Row(r =>
                        {
                            r.RelativeItem().Text("Tạm tính:");
                            r.RelativeItem()
                                .AlignRight()
                                .Text(_order.TotalPrice.ToString("N0") + " đ");
                        });
                    c.Item()
                        .Row(r =>
                        {
                            r.RelativeItem().Text("Thuế GTGT:");
                            r.RelativeItem().AlignRight().Text(_order.Tax.ToString("N0") + " đ");
                        });
                    c.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
                    c.Item()
                        .Row(r =>
                        {
                            r.RelativeItem().Text("Tổng cộng:").Bold();
                            r.RelativeItem()
                                .AlignRight()
                                .Text(_order.TotalPrice.ToString("N0") + " đ")
                                .Bold();
                        });
                });
        });
    }

    void TableComponent(IContainer container)
    {
        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(25); // Index
                columns.RelativeColumn(2); // SKU
                columns.RelativeColumn(4); // Product
                columns.RelativeColumn(1.5f); // Qty
                columns.RelativeColumn(2); // Unit Price
                columns.RelativeColumn(2); // Total
            });

            // Table Header
            table.Header(header =>
            {
                header.Cell().Element(HeaderCellStyle).Text("#");
                header.Cell().Element(HeaderCellStyle).Text("Mã SP");
                header.Cell().Element(HeaderCellStyle).Text("Tên sản phẩm");
                header.Cell().Element(HeaderCellStyle).AlignRight().Text("SL");
                header.Cell().Element(HeaderCellStyle).AlignRight().Text("Đơn giá");
                header.Cell().Element(HeaderCellStyle).AlignRight().Text("Thành tiền");

                static IContainer HeaderCellStyle(IContainer container) =>
                    container.BorderBottom(1).BorderColor(Colors.Grey.Darken1).PaddingVertical(5);
            });

            // Table Rows
            foreach (var (item, index) in _order.OrderItems.Select((x, i) => (x, i)))
            {
                table.Cell().Element(CellStyle).Text($"{index + 1}");
                table.Cell().Element(CellStyle).Text(item.Product?.Sku ?? "N/A");
                table.Cell().Element(CellStyle).Text(item.Product?.Name ?? "N/A");
                table.Cell().Element(CellStyle).AlignRight().Text(item.Quantity.ToString());
                table.Cell().Element(CellStyle).AlignRight().Text(item.Price.ToString("N0") + " đ");
                table
                    .Cell()
                    .Element(CellStyle)
                    .AlignRight()
                    .Text((item.Quantity * item.Price).ToString("N0") + " đ");
            }

            static IContainer CellStyle(IContainer container) =>
                container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(8);
        });
    }
}
