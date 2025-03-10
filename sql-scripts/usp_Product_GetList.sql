-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách sản phẩm xem trước với phân trang và tìm kiếm
-- Sort type:
-- Default = 0
-- PriceAsc = 1
-- PriceDesc = 2
-- Newest = 3
-- Oldest = 4
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_Product_GetFilteredList] @iMinPrice FLOAT,
@iMaxPrice FLOAT,
@iCategories NVARCHAR(4000),
@iBrands NVARCHAR(4000),
@iSort SMALLINT,
@iTextSearch NVARCHAR(4000),
@iPageIndex INT,
@iPageSize INT,
@oTotalRow BIGINT OUTPUT AS BEGIN
SELECT Prd.Id,
    Prd.Sku,
    Prd.Name,
    Prd.Price,
    Prd.DiscountPrice,
    Prd.Stock,
    Prd.ImageUrls,
    Prd.CreatedDate,
    Prd.UpdatedDate,
    Brd.Name AS [Brand],
    Cat.Name AS [Category],
    ROUND(RPP.Rating, 1) AS [Rating] INTO #TEMP
FROM Product Prd
    JOIN Category Cat ON Cat.Id = Prd.CategoryId
    AND (
        @iCategories = ''
        OR Cat.Name IN (
            SELECT LTRIM(RTRIM(value))
            FROM STRING_SPLIT(@iCategories, ',')
        )
    )
    JOIN Brand Brd ON Brd.Id = Prd.BrandId
    AND (
        @iBrands = ''
        OR Brd.Name IN (
            SELECT LTRIM(RTRIM(value))
            FROM STRING_SPLIT(@iBrands, ',')
        )
    )
    LEFT JOIN VI_RatingPerProduct RPP ON RPP.ProductId = Prd.Id
WHERE Prd.IsDeleted = 0
    AND (
        @iMinPrice <= Prd.Price
        AND Prd.Price <= @iMaxPrice
    )
    AND (
        ISNULL(@iTextSearch, '') = ''
        OR Prd.Sku LIKE N'%' + @iTextSearch + '%'
        OR Prd.Name LIKE N'%' + @iTextSearch + '%'
        OR Prd.Description LIKE N'%' + @iTextSearch + '%'
    )
SET @oTotalRow = (
        SELECT COUNT(*)
        FROM #TEMP)
        SELECT *
        FROM #TEMP
        ORDER BY -- Handle sorting dynamically based on @iSort
            CASE
                WHEN @iSort = 1 THEN CAST(Price AS FLOAT) -- Price Ascending
                WHEN @iSort = 2 THEN CAST(Price AS FLOAT) * -1 -- Price Descending
                WHEN @iSort = 3 THEN NULL -- Skip for Newest
                WHEN @iSort = 4 THEN NULL -- Skip for Oldest
                ELSE NULL -- Default: Handled below
            END ASC,
            CASE
                WHEN @iSort = 3 THEN CreatedDate -- Newest (Descending)
                WHEN @iSort = 4 THEN CreatedDate -- Oldest (Ascending)
                ELSE UpdatedDate -- Default: UpdatedDate
            END DESC,
            -- Apply descending sort for Newest
            CASE
                WHEN @iSort = 4 THEN CreatedDate -- For Oldest (Ascending)
                ELSE NULL -- Do nothing for other cases
            END ASC,
            UpdatedDate DESC,
            -- Secondary sorting for Default
            CreatedDate DESC -- Secondary sorting for other cases
            OFFSET @iPageIndex * @iPageSize ROWS FETCH NEXT @iPageSize ROWS ONLY DROP TABLE #TEMP;
    END
go