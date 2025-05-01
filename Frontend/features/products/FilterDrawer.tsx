"use client";

import FilterDropdown from "@/components/core/FilterDropDown";
import { ComboBoxItem } from "@/types";
import {
  Button,
  Drawer,
  Flex,
  Group,
  NumberInput,
  Paper,
  RangeSlider,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import TuneIcon from "@mui/icons-material/Tune";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

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
  const [category, setCategory] = useState<string[]>(defaultCategories);
  const [brand, setBrand] = useState<string[]>(defaultBrands);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    defaultMaxPrice,
  ]);

  const categoryValues = useMemo(
    () =>
      categories.filter((x) => category?.includes(x.text)).map((x) => x.value),
    [categories, category]
  );

  const brandValues = useMemo(
    () => brands.filter((x) => brand?.includes(x.text)).map((x) => x.value),
    [brands, brand]
  );

  const flatCategory = useMemo(
    () => categories.map((x) => x.text).filter((x) => category?.includes(x)),
    [categories, category]
  );

  const flatBrand = useMemo(
    () => brands.map((x) => x.text).filter((x) => brand?.includes(x)),
    [brands, brand]
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (values: string[]) => {
    const selectedCategories = categories
      .filter((x) => values.includes(x.value))
      .map((x) => x.text);
    setCategory(selectedCategories);
  };

  const handleBrandChange = (values: string[]) => {
    const selectedBrands = brands
      .filter((x) => values.includes(x.value))
      .map((x) => x.text);
    setBrand(selectedBrands);
  };

  const handleReset = () => {
    setCategory([]);
    setBrand([]);
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
    if (category.length > 0) {
      params.set("category", flatCategory.join(","));
    }
    if (brand.length > 0) {
      params.set("brand", flatBrand.join(","));
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
        position="bottom"
        opened={opened}
        onClose={close}
        title="Bộ lọc sản phẩm"
        size="xs"
      >
        <Stack gap={8} p={2}>
          <Flex
            direction={{
              base: "column",
              sm: "row",
            }}
            gap={4}
          >
            <FilterDropdown
              title="Danh mục"
              items={categories}
              size="small"
              width="100%"
              initialValue={categoryValues}
              onValueChange={handleCategoryChange}
            />

            <FilterDropdown
              title="Thương hiệu"
              items={brands}
              size="small"
              width="100%"
              initialValue={brandValues}
              onValueChange={handleBrandChange}
            />
          </Flex>

          <Paper>
            <Text>Khoảng giá</Text>

            <RangeSlider
              color="blue"
              min={0}
              max={defaultMaxPrice}
              value={priceRange}
              onChange={setPriceRange}
            />
            <Group gap={4} justify="space-between" align="flex-end">
              <NumberInput
                label="Giá tối thiểu"
                value={priceRange[0]}
                onChange={(value) =>
                  setPriceRange([Number(value), priceRange[1]])
                }
                size="sm"
                flex={1}
                suffix="đ"
                thousandSeparator="."
                decimalSeparator=","
              />
              <Text>đến</Text>
              <NumberInput
                label="Giá tối đa"
                value={priceRange[1]}
                onChange={(value) =>
                  setPriceRange([priceRange[0], Number(value)])
                }
                size="sm"
                flex={1}
                suffix="đ"
                thousandSeparator="."
                decimalSeparator=","
              />
            </Group>
          </Paper>

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
              Áp dụng bộ lọc
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
};
