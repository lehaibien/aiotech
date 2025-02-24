CREATE VIEW VI_RatingPerProduct AS
    -- Calculate avg rating of each product
SELECT RV.ProductId, AVG(RV.Rating) AS [Rating]
FROM Review RV
GROUP BY RV.ProductId
GO

