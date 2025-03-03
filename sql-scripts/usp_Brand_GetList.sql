-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách thương hiệu phân trang và tìm kiếm
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_Brand_GetList] @iTextSearch NVARCHAR(4000),
@iPageIndex INT,
@iPageSize INT,
@oTotalRow BIGINT OUTPUT AS BEGIN
SELECT Br.* INTO #TEMP
FROM Brand Br
WHERE Br.IsDeleted = 0
    AND (
        ISNULL(@iTextSearch, '') = ''
        OR Br.Name LIKE N'%' + @iTextSearch + '%'
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