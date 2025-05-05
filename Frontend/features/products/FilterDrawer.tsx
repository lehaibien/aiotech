"use client";

import { ComboBoxItem } from "@/types";
import {
  Button,
  Drawer,
  Group,
  Input,
  MultiSelect,
  NumberInput,
  RangeSlider,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type FilterDrawerProps = {
  brands: ComboBoxItem[];
  categories: ComboBoxItem[];
  defaultBrands?: string[];
  defaultCategories?: string[];
};

export const FilterDrawer = ({
  brands,
  categories,
  defaultBrands = [],
  defaultCategories = [],
}: FilterDrawerProps) => {
  const defaultMaxPrice = 900000000;
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(defaultCategories);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(defaultBrands);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    defaultMaxPrice,
  ]);
  const categoriesData = categories.map((x) => {
    return {
      label: x.text,
      value: x.value,
    };
  });
  const brandsData = brands.map((x) => {
    return {
      label: x.text,
      value: x.value,
    };
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, defaultMaxPrice]);
    close();
    router.push("/products");
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("brand");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");
    if (selectedCategories.length > 0) {
      const selectedCategoryTexts = categories
        .filter((x) => selectedCategories.includes(x.value))
        .map((x) => x.text);
      params.set("category", selectedCategoryTexts.join(","));
    }
    if (selectedBrands.length > 0) {
      const selectedBrandsTexts = brands
        .filter((x) => selectedBrands.includes(x.value))
        .map((x) => x.text);
      params.set("brand", selectedBrandsTexts.join(","));
    }
    if (priceRange[0] > 0 || priceRange[1] < defaultMaxPrice) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    }

    router.push(`?${params.toString()}`);
    close();
  };

  return (
    <>
      <Button variant="outline" onClick={open} leftSection={<TuneIcon />}>
        Lọc sản phẩm
      </Button>

      <Drawer
        position="left"
        opened={opened}
        onClose={close}
        title="Bộ lọc sản phẩm"
        size="sm"
      >
        <Stack gap="md">
          <MultiSelect
            label="Danh mục"
            data={categoriesData}
            value={selectedCategories}
            onChange={setSelectedCategories}
            searchable
          />
          <MultiSelect
            label="Thương hiệu"
            data={brandsData}
            value={selectedBrands}
            onChange={setSelectedBrands}
            searchable
          />
          <Input.Label htmlFor="price-slider">Khoảng giá</Input.Label>
          <RangeSlider
            id="price-slider"
            color="blue"
            min={0}
            max={defaultMaxPrice}
            value={priceRange}
            onChange={setPriceRange}
          />
          <NumberInput
            label="Giá tối thiểu"
            value={priceRange[0]}
            onChange={(value) => setPriceRange([Number(value), priceRange[1]])}
            size="sm"
            flex={1}
            suffix="đ"
            thousandSeparator="."
            decimalSeparator=","
          />
          <NumberInput
            label="Giá tối đa"
            value={priceRange[1]}
            onChange={(value) => setPriceRange([priceRange[0], Number(value)])}
            size="sm"
            flex={1}
            suffix="đ"
            thousandSeparator="."
            decimalSeparator=","
          />

          <Group justify="space-between" gap={4}>
            <Button
              variant="contained"
              color="info"
              onClick={handleReset}
              flex={1}
            >
              Đặt lại
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              flex={1}
            >
              Áp dụng
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
};
