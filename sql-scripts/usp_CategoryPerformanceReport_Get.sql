-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách thương hiệu phân trang và tìm kiếm
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_CategoryPerformanceReport_Get] @iStartDate DATE,
@iEndDate DATE AS BEGIN WITH CategoryOrderStats AS (
    SELECT b.Id AS CategoryId,
        b.Name AS CategoryName,
        SUM(oi.Price * oi.Quantity) AS TotalRevenue,
        SUM(oi.Quantity) AS TotalUnitsSold
    FROM Category b
        LEFT JOIN Product p ON b.Id = p.CategoryId
        LEFT JOIN OrderItem oi ON p.Id = oi.ProductId
        LEFT JOIN [Order] o ON oi.OrderId = o.Id
    WHERE (
            oi.OrderId IS NULL
            OR (
                o.CreatedDate >= @iStartDate
                AND o.CreatedDate <= @iEndDate
                AND o.Status = 'Delivered'
            )
        )
    GROUP BY b.Id,
        b.Name
),
ProductCounts AS (
    SELECT CategoryId,
        COUNT(*) AS ProductCount
    FROM Product
    GROUP BY CategoryId
),
CategoryRatings AS (
    SELECT p.CategoryId,
        AVG(r.Rating) AS AverageRating
    FROM Product p
        JOIN VI_RatingPerProduct r ON p.Id = r.ProductId
    GROUP BY p.CategoryId
)
SELECT bos.CategoryId,
    bos.CategoryName,
    COALESCE(pc.ProductCount, 0) AS ProductCount,
    COALESCE(bos.TotalRevenue, 0) AS TotalRevenue,
    COALESCE(bos.TotalUnitsSold, 0) AS TotalUnitsSold,
    COALESCE(br.AverageRating, 0) AS AverageRating
FROM CategoryOrderStats bos
    LEFT JOIN ProductCounts pc ON bos.CategoryId = pc.CategoryId
    LEFT JOIN CategoryRatings br ON bos.CategoryId = br.CategoryId
ORDER BY TotalRevenue DESC;
END
go