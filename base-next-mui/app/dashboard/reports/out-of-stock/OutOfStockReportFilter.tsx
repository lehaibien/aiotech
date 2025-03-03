"use client";

import { ComboBoxItem } from "@/types";
import {
  Autocomplete,
  Button,
  Paper,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { useState } from "react";

type OutOfStockReportFilterProps = {
  brandList: ComboBoxItem[];
  categoryList: ComboBoxItem[];
  defaultBrandId?: UUID;
  defaultCategoryId?: UUID;
};

export default function OutOfStockReportFilter({
  brandList,
  categoryList,
  defaultBrandId,
  defaultCategoryId,
}: OutOfStockReportFilterProps) {
  const theme = useTheme();
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

    router.push(`/dashboard/reports/out-of-stock?${params.toString()}`);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 4,
        backgroundColor: theme.palette.background.paper,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
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
          renderInput={(params) => (
            <TextField {...params} label="Thương hiệu" />
          )}
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
          sx={{
            height: 40,
            px: 3,
            fontWeight: 600,
            borderRadius: 1.5,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Áp dụng bộ lọc
        </Button>
      </Stack>
    </Paper>
  );
}
