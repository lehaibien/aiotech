-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách đánh giá phân trang và tìm kiếm
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_Review_GetList] @iTextSearch NVARCHAR(4000),
@iPageIndex INT,
@iPageSize INT,
@oTotalRow BIGINT OUTPUT AS BEGIN
SELECT Rv.Id,
  Rv.Rating,
  Rv.Comment,
  Usr.UserName AS [UserName],
  Prd.Name AS [ProductName],
  Rv.CreatedDate,
  Rv.UpdatedDate INTO #TEMP
FROM Review Rv
  JOIN [User] Usr ON Usr.Id = Rv.UserId
  JOIN Product Prd ON Prd.Id = Rv.ProductId
WHERE Rv.IsDeleted = 0
  AND (
    ISNULL(@iTextSearch, '') = ''
    OR Prd.Name LIKE N'%' + @iTextSearch + '%'
  )
  AND (
    ISNULL(@iTextSearch, '') = ''
    OR Usr.UserName LIKE N'%' + @iTextSearch + '%'
  )
  AND (
    ISNULL(@iTextSearch, '') = ''
    OR Rv.Comment LIKE N'%' + @iTextSearch + '%'
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