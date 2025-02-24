-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách thẻ phân trang và tìm kiếm
-- =============================================
CREATE PROCEDURE [dbo].[usp_Tag_GetList]
    @iTextSearch NVARCHAR(4000),
    @iPageIndex INT,
    @iPageSize INT,
    @oTotalRow	BIGINT OUTPUT
AS
BEGIN

SELECT Tg.*
INTO #TEMP
FROM Tag Tg
WHERE Tg.IsDeleted = 0
  AND (
    ISNULL(@iTextSearch, '') = ''
        OR Tg.Name LIKE N'%' + @iTextSearch + '%'
    )
    SET @oTotalRow = (SELECT COUNT(*) FROM #TEMP)

SELECT *
FROM #TEMP
ORDER BY UpdatedDate DESC, CreatedDate DESC
OFFSET @iPageIndex * @iPageSize  ROWS
    FETCH NEXT @iPageSize ROWS ONLY
END
go

