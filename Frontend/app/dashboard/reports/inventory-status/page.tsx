import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ComboBoxItem, SearchParams } from "@/types";
import { Stack, Typography } from "@mui/material";
import InventoryStatusReportFilter from "./InventoryStatusReportFilter";
import InventoryStatusReportGrid from "./InventoryStatusReportGrid";

/**
 * Renders the inventory status report page with filters and data grid based on selected brand and category.
 *
 * Fetches available brands and categories for filtering, parses default selections from {@link searchParams}, and displays the inventory status report UI.
 *
 * @param searchParams - URL search parameters containing optional `brand_id` and `category_id` values.
 * @returns The inventory status report page as a React element.
 */
export default async function OutOfStockReportPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { brand_id, category_id } = await searchParams;
  const defaultBrandId = brand_id ? parseUUID(brand_id) : undefined;
  const defaultCategoryId = category_id ? parseUUID(category_id) : undefined;

  const brandComboboxPromise = getApi(API_URL.brandComboBox);
  const categoryComboboxPromise = getApi(API_URL.categoryComboBox);
  const [brandComboboxResponse, categoryComboboxResponse] = await Promise.all([
    brandComboboxPromise,
    categoryComboboxPromise,
  ]);

  const brandList = (brandComboboxResponse.data as ComboBoxItem[]) ?? [];
  const categoryList = (categoryComboboxResponse.data as ComboBoxItem[]) ?? [];

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Thống kê trạng thái kho</Typography>
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
