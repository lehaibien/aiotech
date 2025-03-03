-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách sale
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_SaleReport_Get] @iStartDate DATE,
@iEndDate DATE,
@iCategory NVARCHAR(4000),
@iProduct NVARCHAR(4000) AS BEGIN WITH Months AS (
  SELECT DATEFROMPARTS(YEAR(@iStartDate), MONTH(@iStartDate), 1) AS MonthStart
  UNION ALL
  SELECT DATEADD(MONTH, 1, MonthStart)
  FROM Months
  WHERE DATEADD(MONTH, 1, MonthStart) <= @iEndDate
),
SalesData AS (
  SELECT DATEFROMPARTS(YEAR(Ord.CreatedDate), MONTH(Ord.CreatedDate), 1) AS OrderMonth,
    SUM(OrdItm.Price * OrdItm.Quantity) AS Revenue
  FROM Payment Pmt
    JOIN [Order] Ord ON Ord.Id = Pmt.OrderId
    JOIN OrderItem OrdItm ON OrdItm.OrderId = Ord.Id
    JOIN Product Prd ON Prd.Id = OrdItm.ProductId
    JOIN Category Cat ON Cat.Id = Prd.CategoryId
  WHERE Ord.CreatedDate BETWEEN @iStartDate AND @iEndDate
    AND (
      ISNULL(@iProduct, '') = ''
      OR Prd.Name LIKE '%' + @iProduct + '%'
    )
    AND (
      ISNULL(@iCategory, '') = ''
      OR Cat.Name LIKE '%' + @iCategory + '%'
    )
  GROUP BY DATEFROMPARTS(YEAR(Ord.CreatedDate), MONTH(Ord.CreatedDate), 1)
)
SELECT M.MonthStart AS [Date],
  COALESCE(S.Revenue, 0) AS Revenue
FROM Months M
  LEFT JOIN SalesData S ON M.MonthStart = S.OrderMonth
ORDER BY M.MonthStart;
END
go