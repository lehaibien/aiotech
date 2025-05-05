import { API_URL } from "@/constant/apiUrl";
import { InventoryStatusReportFilter } from "@/features/dashboard/reports/inventory-status/InventoryStatusReportFilter";
import { InventoryStatusReportGrid } from "@/features/dashboard/reports/inventory-status/InventoryStatusReportGrid";
import { getApi } from "@/lib/apiClient";
import { parseUUID } from "@/lib/utils";
import { ComboBoxItem, SearchParams } from "@/types";
import { Stack, Title } from "@mantine/core";

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
    <Stack>
      <Title order={5}>Thống kê trạng thái kho</Title>
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
