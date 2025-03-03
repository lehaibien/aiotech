-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách thương hiệu phân trang và tìm kiếm
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_BrandPerformanceReport_Get] @iStartDate DATE,
@iEndDate DATE AS BEGIN WITH BrandOrderStats AS (
    SELECT b.Id AS BrandId,
        b.Name AS BrandName,
        SUM(oi.Price * oi.Quantity) AS TotalRevenue,
        SUM(oi.Quantity) AS TotalUnitsSold
    FROM Brand b
        LEFT JOIN Product p ON b.Id = p.BrandId
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
    SELECT BrandId,
        COUNT(*) AS ProductCount
    FROM Product
    GROUP BY BrandId
),
BrandRatings AS (
    SELECT p.BrandId,
        AVG(r.Rating) AS AverageRating
    FROM Product p
        JOIN VI_RatingPerProduct r ON p.Id = r.ProductId
    GROUP BY p.BrandId
)
SELECT bos.BrandId,
    bos.BrandName,
    COALESCE(pc.ProductCount, 0) AS ProductCount,
    COALESCE(bos.TotalRevenue, 0) AS TotalRevenue,
    COALESCE(bos.TotalUnitsSold, 0) AS TotalUnitsSold,
    COALESCE(br.AverageRating, 0) AS AverageRating
FROM BrandOrderStats bos
    LEFT JOIN ProductCounts pc ON bos.BrandId = pc.BrandId
    LEFT JOIN BrandRatings br ON bos.BrandId = br.BrandId
ORDER BY TotalRevenue DESC;
END
go