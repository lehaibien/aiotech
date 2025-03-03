import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ComboBoxItem } from "@/types";
import { Box, Typography } from "@mui/material";
import OutOfStockReportFilter from "./OutOfStockReportFilter";
import OutOfStockReportGrid from "./OutOfStockReportGrid";
import 'server-only';

export default async function OutOfStockReportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const breadcrums = [
    {
      label: "",
      href: "dashboard",
    },
    {
      label: "Báo cáo sản phẩm gần hết hàng",
      href: "out-of-stock",
    },
  ];

  const defaultBrandId = searchParams?.brand_id
    ? parseUUID(searchParams.brand_id)
    : undefined;
  const defaultCategoryId = searchParams?.category_id
    ? parseUUID(searchParams.category_id)
    : undefined;

  const brandComboboxResponse = await getApi(API_URL.brandComboBox);
  const brandList = (brandComboboxResponse.data as ComboBoxItem[]) ?? [];
  const categoryComboboxResponse = await getApi(API_URL.categoryComboBox);
  const categoryList = (categoryComboboxResponse.data as ComboBoxItem[]) ?? [];

  return (
    <>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4" gutterBottom>
        Báo cáo sản phẩm gần hết hàng
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Danh sách sản phẩm có số lượng tồn kho dưới 10
      </Typography>
      <OutOfStockReportFilter
        brandList={brandList}
        categoryList={categoryList}
        defaultBrandId={defaultBrandId}
        defaultCategoryId={defaultCategoryId}
      />
      <Box sx={{ mt: 2 }}>
        <OutOfStockReportGrid brandId={defaultBrandId} categoryId={defaultCategoryId}/>
      </Box>
    </>
  );
}
