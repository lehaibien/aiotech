import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ComboBoxItem } from "@/types";
import { Stack, Typography } from "@mui/material";
import "server-only";
import InventoryStatusReportGrid from "./InventoryStatusReportGrid";
import InventoryStatusReportFilter from "./InventoryStatusReportFilter";

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
      label: "Thống kê trạng thái kho",
      href: "inventory-status",
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
    <Stack spacing={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4">Thống kê trạng thái kho</Typography>
      <InventoryStatusReportFilter
        brandList={brandList}
        categoryList={categoryList}
        defaultBrandId={defaultBrandId}
        defaultCategoryId={defaultCategoryId}
      />
      <InventoryStatusReportGrid
        brandId={defaultBrandId}
        categoryId={defaultCategoryId}
      />
    </Stack>
  );
}
