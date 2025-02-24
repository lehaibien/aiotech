-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách danh mục phân trang và tìm kiếm
-- =============================================
CREATE PROCEDURE [dbo].[usp_Category_GetList]
    @iTextSearch NVARCHAR(4000),
    @iPageIndex INT,
    @iPageSize INT,
    @oTotalRow	BIGINT OUTPUT
AS
BEGIN

SELECT Cat.*
INTO #TEMP
FROM Category Cat
WHERE Cat.IsDeleted = 0
  AND (
    ISNULL(@iTextSearch, '') = ''
        OR Cat.Name LIKE N'%' + @iTextSearch + '%'
    )
    SET @oTotalRow = (SELECT COUNT(*) FROM #TEMP)

SELECT *
FROM #TEMP
ORDER BY UpdatedDate, CreatedDate
OFFSET @iPageIndex * @iPageSize  ROWS
    FETCH NEXT @iPageSize ROWS ONLY
END
go

