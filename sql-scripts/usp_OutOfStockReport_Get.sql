-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách sản phẩm hết hàng
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_OutOfStockReport_Get] @iPageIndex INT,
@iPageSize INT,
@iCategoryId UNIQUEIDENTIFIER,
@iBrandId UNIQUEIDENTIFIER,
@oTotalRow BIGINT OUTPUT AS BEGIN
SELECT Prd.Id,
    Prd.Sku,
    Prd.Name,
    Prd.Stock,
    Brd.Name AS Brand,
    Cat.Name AS Category,
    Prd.ImageUrls,
    Prd.CreatedDate,
    Prd.UpdatedDate INTO #Temp
FROM Product Prd
    JOIN Category Cat ON Cat.Id = Prd.CategoryId
    JOIN Brand Brd ON Brd.Id = Prd.BrandId
WHERE Prd.Stock <= 10
    AND (
        @iCategoryId IS NULL
        OR Cat.Id = @iCategoryId
    )
    AND (
        @iBrandId IS NULL
        OR Brd.Id = @iBrandId
    )
SET @oTotalRow = (
        SELECT COUNT(*)
        FROM #TEMP)
        SELECT *
        FROM #TEMP
        ORDER BY UpdatedDate DESC,
            CreatedDate DESC OFFSET @iPageIndex * @iPageSize ROWS FETCH NEXT @iPageSize ROWS ONLY
    END
go