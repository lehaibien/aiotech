-- =============================================
-- Author:			Lê Hải Biên
-- Create date:		25-12-2024
-- Description:		Lấy danh sách thương hiệu phân trang và tìm kiếm
-- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_OrderStatusReport_Get] @StartDate DATETIME,
@EndDate DATETIME AS
BEGIN
SET NOCOUNT ON;
-- Temporary table to store orders within date range
CREATE TABLE #TempOrders (
OrderId INT,
Status NVARCHAR(50),
TotalPrice FLOAT,
CreatedAt DATETIME,
DeliveryDate DATETIME NULL,
CancelReason NVARCHAR(255) NULL
);
-- Get all orders in date range
INSERT INTO #TempOrders
SELECT OrderId,
    Status,
    TotalPrice,
    CreatedAt,
    DeliveryDate,
    CancelReason
FROM Orders
WHERE CreatedAt >= @StartDate
    AND CreatedAt <= @EndDate;
-- Get total order count
DECLARE @TotalOrders INT;
SELECT @TotalOrders = COUNT(*)
FROM #TempOrders;
    -- Get count by status
SELECT Status,
    COUNT(*) AS Count,
    SUM(TotalPrice) AS TotalValue,
    CAST(
        COUNT(*) * 100.0 / @TotalOrders AS FLOAT
    ) AS Percentage
FROM #TempOrders
GROUP BY Status;
-- Get cancellation reasons
DECLARE @CanceledCount INT;
SELECT @CanceledCount = COUNT(*)
FROM #TempOrders WHERE Status = 'Canceled';
SELECT CancelReason AS Reason,
    COUNT(*) AS Count,
    CAST(
        COUNT(*) * 100.0 / NULLIF(@CanceledCount, 0) AS FLOAT
    ) AS Percentage
FROM #TempOrders
WHERE Status = 'Canceled'
    AND CancelReason IS NOT NULL
    AND CancelReason <> ''
GROUP BY CancelReason
ORDER BY Count DESC;
-- Get average delivery time
SELECT CAST(
        AVG(
            CASE
                WHEN DeliveryDate IS NOT NULL
                AND Status = 'Delivered' THEN DATEDIFF(DAY, CreatedAt, DeliveryDate)
                ELSE NULL
            END
        ) AS FLOAT
    ) AS AverageDeliveryTime
FROM #TempOrders;
    -- Get total order count
SELECT @TotalOrders AS TotalOrders;
-- Clean up
DROP TABLE #TempOrders;
END
go