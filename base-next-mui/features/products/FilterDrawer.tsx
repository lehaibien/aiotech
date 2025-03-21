"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { ComboBoxItem } from "@/types";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import FilterDropdown from "@/components/core/FilterDropDown";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Slider,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

interface FilterDrawerProps {
  brands: ComboBoxItem[];
  categories: ComboBoxItem[];
  defaultBrands?: string[];
  defaultCategories?: string[];
}

export default function FilterDrawer({
  brands,
  categories,
  defaultBrands = [],
  defaultCategories = [],
}: FilterDrawerProps) {
  const theme = useTheme();
  const defaultMaxPrice = 200000000;
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string[]>(defaultCategories);
  const [brand, setBrand] = useState<string[]>(defaultBrands);
  const [priceRange, setPriceRange] = useState<number[]>([0, defaultMaxPrice]);

  // Convert category text values to category values for FilterDropdown
  const categoryValues = useMemo(
    () =>
      categories.filter((x) => category?.includes(x.text)).map((x) => x.value),
    [categories, category]
  );

  // Convert brand text values to brand values for FilterDropdown
  const brandValues = useMemo(
    () => brands.filter((x) => brand?.includes(x.text)).map((x) => x.value),
    [brands, brand]
  );

  // For URL parameters, we need the text values
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

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Handle category selection from FilterDropdown
  const handleCategoryChange = (values: string[]) => {
    const selectedCategories = categories
      .filter((x) => values.includes(x.value))
      .map((x) => x.text);
    setCategory(selectedCategories);
  };

  // Handle brand selection from FilterDropdown
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
    router.push("/products");
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("brand");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");
    if (category) params.set("category", flatCategory.join(","));
    if (brand) params.set("brand", flatBrand.join(","));
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        variant="outlined"
        startIcon={<TuneIcon />}
        sx={{
          mb: 2,
          borderRadius: 2,
          px: 2,
          py: 1,
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.shadows[2],
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        Lọc sản phẩm
      </Button>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "80vh",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            maxWidth: 800,
            mx: "auto",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Bộ lọc sản phẩm
              </Typography>
            </Box>
            <IconButton onClick={toggleDrawer(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <FilterDropdown
              title="Danh mục"
              items={categories}
              size="medium"
              width="100%"
              initialValue={categoryValues}
              onValueChange={handleCategoryChange}
            />

            <FilterDropdown
              title="Thương hiệu"
              items={brands}
              size="medium"
              width="100%"
              initialValue={brandValues}
              onValueChange={handleBrandChange}
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Khoảng giá
            </Typography>

            <Box sx={{ px: 2, pt: 1, pb: 2 }}>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={defaultMaxPrice}
                valueLabelFormat={(value) =>
                  `${formatNumberWithSeperator(value)} đ`
                }
                sx={{
                  "& .MuiSlider-thumb": {
                    height: 20,
                    width: 20,
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: `0px 0px 0px 8px ${alpha(
                        theme.palette.primary.main,
                        0.16
                      )}`,
                    },
                  },
                  mb: 3,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <TextField
                  label="Giá tối thiểu"
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  InputProps={{
                    inputProps: { min: 0, max: priceRange[1] },
                  }}
                  sx={{
                    width: "100%",
                  }}
                  size="small"
                />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  đến
                </Typography>
                <TextField
                  label="Giá tối đa"
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  InputProps={{
                    inputProps: { min: priceRange[0], max: defaultMaxPrice },
                  }}
                  sx={{
                    width: "100%",
                  }}
                  size="small"
                />
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {formatNumberWithSeperator(priceRange[0])} đ
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {formatNumberWithSeperator(priceRange[1])} đ
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: 2,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.04),
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                },
                flex: 1,
              }}
            >
              Đặt lại
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[4],
                },
                flex: 2,
              }}
            >
              Áp dụng bộ lọc
            </Button>
          </Box>
        </Paper>
      </Drawer>
    </div>
  );
}
