'use client';

import FilterDropdown from '@/components/core/FilterDropDown';
import { formatNumberWithSeperator } from '@/lib/utils';
import { ComboBoxItem } from '@/types';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

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
    router.push('/products');
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('brand');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');
    if (category.length > 0) {
      params.set('category', flatCategory.join(','));
    }
    if (brand.length > 0) {
      params.set('brand', flatBrand.join(','));
    }
    if (priceRange[0] > 0 || priceRange[1] < defaultMaxPrice) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    }

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        variant='outlined'
        startIcon={<TuneIcon />}>
        Lọc sản phẩm
      </Button>

      <Drawer
        anchor='bottom'
        open={open}
        onClose={toggleDrawer(false)}>
        <Stack
          gap={2}
          padding={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon />
              <Typography variant='h6'>Bộ lọc sản phẩm</Typography>
            </Box>
            <IconButton
              onClick={toggleDrawer(false)}
              size='small'>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}>
            <FilterDropdown
              title='Danh mục'
              items={categories}
              size='small'
              width='100%'
              initialValue={categoryValues}
              onValueChange={handleCategoryChange}
            />

            <FilterDropdown
              title='Thương hiệu'
              items={brands}
              size='small'
              width='100%'
              initialValue={brandValues}
              onValueChange={handleBrandChange}
            />
          </Box>

          <Paper>
            <Typography gutterBottom>Khoảng giá</Typography>

            <Box>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay='auto'
                min={0}
                max={defaultMaxPrice}
                valueLabelFormat={(value) =>
                  `${formatNumberWithSeperator(value)} đ`
                }
                sx={{
                  mx: 1,
                  '& .MuiSlider-thumb': {
                    height: 16,
                    width: 16,
                  },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <TextField
                  label='Giá tối thiểu'
                  type='number'
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  InputProps={{
                    inputProps: { min: 0, max: priceRange[1] },
                  }}
                  sx={{
                    width: '100%',
                  }}
                  size='small'
                />
                <Typography
                  variant='body2'
                  sx={{ color: theme.palette.text.secondary }}>
                  đến
                </Typography>
                <TextField
                  label='Giá tối đa'
                  type='number'
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  InputProps={{
                    inputProps: { min: priceRange[0], max: defaultMaxPrice },
                  }}
                  sx={{
                    width: '100%',
                  }}
                  size='small'
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <Typography
                  variant='body2'
                  sx={{ color: theme.palette.text.secondary }}>
                  {formatNumberWithSeperator(priceRange[0])} đ
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ color: theme.palette.text.secondary }}>
                  {formatNumberWithSeperator(priceRange[1])} đ
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
            }}>
            <Button
              fullWidth
              variant='contained'
              color='info'
              onClick={handleReset}>
              Đặt lại
            </Button>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              onClick={handleSubmit}>
              Áp dụng bộ lọc
            </Button>
          </Box>
        </Stack>
      </Drawer>
    </div>
  );
}
