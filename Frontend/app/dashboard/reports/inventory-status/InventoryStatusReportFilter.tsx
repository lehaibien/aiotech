"use client";

import { ComboBoxItem } from "@/types";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { UUID } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type InventoryStatusReportFilterProps = {
  brandList: ComboBoxItem[];
  categoryList: ComboBoxItem[];
  defaultBrandId?: UUID;
  defaultCategoryId?: UUID;
};

/**
 * Renders filter controls for the inventory status report, allowing users to filter by brand and category.
 *
 * Displays two autocomplete dropdowns for selecting a brand and a category, and a button to apply the selected filters. When the filter is applied, the component updates the URL query parameters and navigates to the inventory status report page with the selected filters.
 *
 * @param brandList - List of available brands to filter by.
 * @param categoryList - List of available categories to filter by.
 * @param defaultBrandId - Optional UUID of the initially selected brand.
 * @param defaultCategoryId - Optional UUID of the initially selected category.
 */
export default function InventoryStatusReportFilter({
  brandList,
  categoryList,
  defaultBrandId,
  defaultCategoryId,
}: InventoryStatusReportFilterProps) {
  const router = useRouter();

  const defaultBrand = defaultBrandId
    ? brandList.find((item) => item.value === defaultBrandId.toString())
    : null;

  const defaultCategory = defaultCategoryId
    ? categoryList.find((item) => item.value === defaultCategoryId.toString())
    : null;

  const [selectedBrand, setSelectedBrand] = useState<
    ComboBoxItem | null | undefined
  >(defaultBrand);
  const [selectedCategory, setSelectedCategory] = useState<
    ComboBoxItem | null | undefined
  >(defaultCategory);

  const onApplyFilter = () => {
    const params = new URLSearchParams();

    if (selectedBrand) {
      params.set("brand_id", selectedBrand.value);
    } else {
      params.delete("brand_id");
    }

    if (selectedCategory) {
      params.set("category_id", selectedCategory.value);
    } else {
      params.delete("category_id");
    }

    router.push(`/dashboard/reports/inventory-status?${params.toString()}`);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Autocomplete
        id="brand-filter"
        size="small"
        options={brandList}
        value={selectedBrand}
        onChange={(_, newValue) => {
          setSelectedBrand(newValue);
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => option.text}
        renderInput={(params) => <TextField {...params} label="Thương hiệu" />}
        sx={{
          flex: 1,
          maxWidth: "25%",
          minWidth: 200,
        }}
      />
      <Autocomplete
        id="category-filter"
        size="small"
        options={categoryList}
        value={selectedCategory}
        onChange={(_, newValue) => {
          setSelectedCategory(newValue);
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => option.text}
        renderInput={(params) => <TextField {...params} label="Danh mục" />}
        sx={{
          flex: 1,
          maxWidth: "25%",
          minWidth: 200,
        }}
      />
      <Button
        onClick={onApplyFilter}
        variant="contained"
        color="primary"
      >
        Lọc
      </Button>
    </Stack>
  );
}
