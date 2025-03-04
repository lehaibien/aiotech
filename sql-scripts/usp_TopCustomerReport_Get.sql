-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách thương hiệu phân trang và tìm kiếm
-- =============================================
CREATE PROCEDURE [dbo].[usp_TopCustomersReport_Get]
    @iStartDate DATE,
    @iEndDate DATE,
    @iCount INT
AS
BEGIN

    WITH CustomerOrderStats AS (
        SELECT
            o.CustomerId,
            ISNULL(c.FamilyName + ' ' + c.GivenName, c.GivenName) AS CustomerName,
            COUNT(o.Id) AS OrderCount,
            SUM(o.TotalPrice) AS TotalSpent,
            AVG(o.TotalPrice) AS AverageOrderValue,
            MIN(o.CreatedDate) AS FirstPurchaseDate,
            MAX(o.CreatedDate) AS LatestPurchaseDate,
            DATEDIFF(day, MAX(o.CreatedDate), GETUTCDATE()) AS DaysSinceLastPurchase
        FROM [Order] o
                 JOIN [User] c ON o.CustomerId = c.Id
        WHERE o.CreatedDate >= @iStartDate
          AND o.CreatedDate <= @iEndDate
          AND o.Status = 'Completed'
        GROUP BY o.CustomerId, c.FamilyName, c.GivenName
    ),
         CustomerCategories AS (
             SELECT
                 o.CustomerId,
                 cat.Name AS CategoryName,
                 SUM(oi.Quantity) AS CategoryQuantity,
                 ROW_NUMBER() OVER (PARTITION BY o.CustomerId ORDER BY SUM(oi.Quantity) DESC) AS CategoryRank
             FROM [Order] o
                      JOIN [OrderItem] oi ON o.Id = oi.OrderId
                      JOIN [Product] p ON oi.ProductId = p.Id
                      JOIN [Category] cat ON p.CategoryId = cat.Id
             WHERE o.CreatedDate >= @iStartDate
               AND o.CreatedDate <= @iEndDate
               AND o.Status = 'Completed'
             GROUP BY o.CustomerId, cat.Name
         )
    SELECT
        cos.CustomerId,
        cos.CustomerName,
        cos.OrderCount,
        cos.TotalSpent,
        cos.AverageOrderValue,
        cos.FirstPurchaseDate,
        cos.LatestPurchaseDate,
        cos.DaysSinceLastPurchase,
        STRING_AGG(cc.CategoryName, ', ') WITHIN GROUP (ORDER BY cc.CategoryRank) AS FrequentlyPurchasedCategories
    FROM CustomerOrderStats cos
             LEFT JOIN CustomerCategories cc ON cos.CustomerId = cc.CustomerId AND cc.CategoryRank <= 3
    GROUP BY
        cos.CustomerId,
        cos.CustomerName,
        cos.OrderCount,
        cos.TotalSpent,
        cos.AverageOrderValue,
        cos.FirstPurchaseDate,
        cos.LatestPurchaseDate,
        cos.DaysSinceLastPurchase
    ORDER BY cos.TotalSpent DESC
    OFFSET 0 ROWS
        FETCH NEXT @iCount ROWS ONLY;
END;