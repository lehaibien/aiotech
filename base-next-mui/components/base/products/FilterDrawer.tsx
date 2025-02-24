'use client';

import { formatNumberWithSeperator } from '@/lib/utils';
import { ComboBoxItem } from '@/types';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  Slider,
  TextField,
  Typography,
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
  const defaultMaxPrice = 200000000;
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string[]>(defaultCategories);
  const [brand, setBrand] = useState<string[]>(defaultBrands);
  const [priceRange, setPriceRange] = useState<number[]>([0, defaultMaxPrice]);
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

  const handleReset = () => {
    setCategory([]);
    setBrand([]);
    setPriceRange([0, defaultMaxPrice]);
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('brand');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('page');
    if (category) params.set('category', flatCategory.join(','));
    if (brand) params.set('brand', flatBrand.join(','));
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        variant='outlined'
        startIcon={<FilterListIcon />}
        className='mb-4'>
        Lọc
      </Button>
      <Drawer
        anchor='bottom'
        open={open}
        onClose={toggleDrawer(false)}>
        <Box className='p-4 space-y-4'>
          <Typography
            variant='h6'
            className='font-bold'>
            Bộ lọc
          </Typography>
          <Autocomplete
            multiple
            options={categories}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Danh mục'
              />
            )}
            autoHighlight
            noOptionsText='Không có kết quả'
            getOptionLabel={(option) => option.text || ''}
            isOptionEqualToValue={(option, { value }) => option.value === value}
            value={categories.filter((x) => category?.includes(x.text))}
            onChange={(_, newValue) => setCategory(newValue.map((x) => x.text))}
          />
          <Autocomplete
            multiple
            options={brands}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Thương hiệu'
              />
            )}
            autoHighlight
            noOptionsText='Không có kết quả'
            getOptionLabel={(option) => option.text || ''}
            isOptionEqualToValue={(option, { value }) => option.value === value}
            value={brands.filter((x) => brand?.includes(x.text))}
            onChange={(_, newValue) => setBrand(newValue.map((x) => x.text))}
          />
          <Box>
            <Typography gutterBottom>Giá</Typography>
            <Box className='flex gap-4 justify-between'>
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
                  width: 400,
                }}
              />
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
                  width: 400,
                }}
              />
            </Box>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as number[])}
              valueLabelDisplay='auto'
              min={0}
              max={defaultMaxPrice}
            />
            <Box className='flex justify-between'>
              <Typography>{formatNumberWithSeperator(priceRange[0])}đ</Typography>
              <Typography>{formatNumberWithSeperator(priceRange[1])}đ</Typography>
            </Box>
          </Box>
          <Box className='flex justify-between pt-4'>
            <Button
              variant='outlined'
              onClick={handleReset}>
              Đặt lại
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSubmit}>
              Lọc
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
