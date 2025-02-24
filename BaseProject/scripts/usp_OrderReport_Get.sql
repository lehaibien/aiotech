SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách order
-- =============================================
CREATE PROCEDURE [dbo].[usp_OrderReport_Get]
    @iStartDate DATE,
    @iEndDate DATE,
    @iCustomerUsername NVARCHAR(4000)
AS
BEGIN
    SET NOCOUNT ON;
    WITH
        Months
        AS
        (
                            SELECT
                    DATEFROMPARTS(YEAR(@iStartDate), MONTH(@iStartDate), 1) AS MonthStart
            UNION ALL
                SELECT
                    DATEADD(MONTH, 1, MonthStart)
                FROM
                    Months
                WHERE 
      DATEADD(MONTH, 1, MonthStart) <= @iEndDate
        ),
        SalesData
        AS
        (
            SELECT
                DATEFROMPARTS(YEAR(Ord.CreatedDate), MONTH(Ord.CreatedDate), 1) AS OrderMonth,
                COUNT(DISTINCT Ord.Id) AS OrderCount
            FROM
                [Order] Ord
                JOIN [User] Usr ON Ord.CustomerId = Usr.Id
            WHERE 
      Ord.CreatedDate BETWEEN @iStartDate AND @iEndDate
                AND (ISNULL(@iCustomerUsername, '') = '' OR Usr.Username LIKE '%' + @iCustomerUsername + '%')
            GROUP BY 
      DATEFROMPARTS(YEAR(Ord.CreatedDate), MONTH(Ord.CreatedDate), 1)
        )
    SELECT
        M.MonthStart AS [Date],
        COALESCE(S.OrderCount, 0) AS OrderCount
    FROM
        Months M
        LEFT JOIN SalesData S ON M.MonthStart = S.OrderMonth
    ORDER BY 
    M.MonthStart;
END
GO
