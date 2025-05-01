namespace Application.Shared;

public static class StoredProcedure
{
    private const string Prefix = "usp_";
    public const string GetListBrand = Prefix + "Brand_GetList";
    public const string GetListCategory = Prefix + "Category_GetList";
    public const string GetFilteredProduct = Prefix + "Product_GetFilteredList";
    public const string GetListProductPreview = Prefix + "ProductPreview_GetList";
    public const string GetListUser = Prefix + "User_GetList";
    public const string GetListTag = Prefix + "Tag_GetList";
    public const string GetListOrder = Prefix + "Order_GetList";
    public const string GetListReview = Prefix + "Review_GetList";
    public const string GetListPost = Prefix + "Post_GetList";
    public const string GetListRole = Prefix + "Role_GetList";
    public const string GetSaleReport = Prefix + "SaleReport_Get";
    public const string GetOrderReport = Prefix + "OrderReport_Get";
    public const string GetLowRatingProductReport = Prefix + "LowRatingProductReport_Get";
    public const string GetOutOfStockReport = Prefix + "OutOfStockReport_Get";
    public const string GetBrandPerformanceReport = Prefix + "BrandPerformanceReport_Get";
    public const string GetCategoryPerformanceReport = Prefix + "CategoryPerformanceReport_Get";
    public const string GetTopCustomerReport = Prefix + "TopCustomersReport_Get";
}
