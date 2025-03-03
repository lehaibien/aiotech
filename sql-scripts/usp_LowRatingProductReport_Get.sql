SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO -- =============================================
    -- Author:			Lê Hải Biên
    -- Create date:		25-12-2024
    -- Description:		Lấy danh sách sản phẩm có đánh giá thấp
    -- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_LowRatingProductReport_Get] @iStartDate DATE,
@iEndDate DATE,
@iBrandId UNIQUEIDENTIFIER,
@iCategoryId UNIQUEIDENTIFIER AS BEGIN
SET NOCOUNT ON;
SELECT PRD.Name AS [ProductName],
    RPP.Rating AS [AverageRating]
FROM VI_RatingPerProduct RPP
    JOIN Product PRD ON RPP.ProductId = PRD.Id
    JOIN Review REV ON RPP.ProductId = REV.ProductId
WHERE (
        ISNULL(@iBrandId, 0x0) = 0x0
        OR PRD.BrandId = @iBrandId
    )
    AND (
        ISNULL(@iCategoryId, 0x0) = 0x0
        OR PRD.CategoryId = @iCategoryId
    )
    AND (
        ISNULL(@iStartDate, '') = ''
        OR REV.CreatedDate >= @iStartDate
    )
    AND (
        ISNULL(@iEndDate, '') = ''
        OR REV.CreatedDate <= @iEndDate
    )
END
GO