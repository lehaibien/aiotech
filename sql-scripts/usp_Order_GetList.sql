-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách đơn hàng phân trang và tìm kiếm
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_Order_GetList] @iStatuses NVARCHAR(MAX),
@iCustomerId UNIQUEIDENTIFIER,
@iTextSearch NVARCHAR(4000),
@iPageIndex INT,
@iPageSize INT,
@oTotalRow BIGINT OUTPUT AS BEGIN
SELECT Ord.*,
    Pmt.Provider AS [PaymentProvider] INTO #TEMP
FROM [Order] Ord
    JOIN Payment Pmt ON Pmt.OrderId = Ord.Id
WHERE Ord.IsDeleted = 0
    AND (
        ISNULL(@iCustomerId, 0x0) = 0x0
        OR Ord.CustomerId = @iCustomerId
    )
    AND (
        ISNULL(@iTextSearch, '') = ''
        OR Ord.Address LIKE N'%' + @iTextSearch + '%'
    )
    AND (
        ISNULL(@iStatuses, '') = ''
        OR Ord.Status IN (
            SELECT LTRIM(RTRIM(value))
            FROM STRING_SPLIT(@iStatuses, ',')
        )
    )
SET @oTotalRow = (
        SELECT COUNT(*)
        FROM #TEMP)
        SELECT *
        FROM #TEMP
        ORDER BY UpdatedDate DESC,
            CreatedDate DESC OFFSET @iPageIndex * @iPageSize ROWS FETCH NEXT @iPageSize ROWS ONLY
    END
GO