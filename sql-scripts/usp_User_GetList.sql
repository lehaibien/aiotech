SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO -- =============================================
    -- Author:			Lê Hải Biên
    -- Create date:		25-12-2024
    -- Description:		Lấy danh sách người dùng phân trang và tìm kiếm
    -- =============================================
CREATE
OR ALTER PROCEDURE [dbo].[usp_User_GetList] @iTextSearch NVARCHAR(4000),
@iPageIndex INT,
@iPageSize INT,
@oTotalRow BIGINT OUTPUT AS BEGIN
SELECT U.*,
    R.[Name] AS [Role] INTO #TEMP
FROM [User] U
    JOIN Role R ON R.Id = U.RoleId
WHERE U.IsDeleted = 0
    AND (
        ISNULL(@iTextSearch, '') = ''
        OR U.UserName LIKE N'%' + @iTextSearch + '%'
        OR U.FamilyName LIKE N'%' + @iTextSearch + '%'
        OR U.GivenName LIKE N'%' + @iTextSearch + '%'
        OR U.Email LIKE N'%' + @iTextSearch + '%'
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