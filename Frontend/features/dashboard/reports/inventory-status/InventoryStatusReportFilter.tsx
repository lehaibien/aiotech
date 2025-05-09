"use client";

import { ComboBoxItem } from "@/types";
import { UUID } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Autocomplete, Button, SimpleGrid } from "@mantine/core";

type InventoryStatusReportFilterProps = {
  brandList: ComboBoxItem[];
  categoryList: ComboBoxItem[];
  defaultBrandId?: UUID;
  defaultCategoryId?: UUID;
};

export const InventoryStatusReportFilter = ({
  brandList,
  categoryList,
  defaultBrandId,
  defaultCategoryId,
}: InventoryStatusReportFilterProps) => {
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
    <SimpleGrid cols={4} spacing="md">
      <Autocomplete
        label="Thương hiệu"
        data={brandList.map(item => ({ value: item.value, label: item.text }))}
        value={selectedBrand?.text || ''}
        onChange={(value) => {
          if (!value) {
            setSelectedBrand(null);
            return;
          }
          const newValue = brandList.find(item => item.text === value);
          setSelectedBrand(newValue || null);
        }}
        placeholder="Chọn thương hiệu"
        size="sm"
        clearable
      />
      <Autocomplete
        label="Danh mục"
        data={categoryList.map(item => ({ value: item.value, label: item.text }))}
        value={selectedCategory?.text || ''}
        onChange={(value) => {
          if (!value) {
            setSelectedCategory(null);
            return;
          }
          const newValue = categoryList.find(item => item.text === value);
          setSelectedCategory(newValue || null);
        }}
        placeholder="Chọn danh mục"
        size="sm"
        clearable
      />
      <Button onClick={onApplyFilter} variant="filled" color="blue">
        Lọc
      </Button>
    </SimpleGrid>
  );
};
