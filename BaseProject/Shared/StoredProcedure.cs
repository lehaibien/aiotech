﻿namespace Shared;

public class StoredProcedure
{
    private const string Prefix = "usp_";
    public const string GetListBrand = Prefix + "Brand_GetList";
    public const string GetListCategory = Prefix + "Category_GetList";
    public const string GetListProduct = Prefix + "Product_GetList";
    public const string GetListProductPreview = Prefix + "ProductPreview_GetList";
    public const string GetListUser = Prefix + "User_GetList";
    public const string GetListTag = Prefix + "Tag_GetList";
    public const string GetListOrder = Prefix + "Order_GetList";
    public const string GetListReview = Prefix + "Review_GetList";
    public const string GetListPost = Prefix + "Post_GetList";
    public const string GetSaleReport = Prefix + "SaleReport_Get";
    public const string GetOrderReport = Prefix + "OrderReport_Get";
    public const string GetLowRatingProductReport = Prefix + "LowRatingProductReport_Get";
}
