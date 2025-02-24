'use client';

import { API_URL } from '@/constant/apiUrl';
import { EMPTY_UUID } from '@/constant/common';
import { postApi, putApi } from '@/lib/apiClient';
import { convertObjectToFormData } from '@/lib/utils';
import { ComboBoxItem } from '@/types';
import { type ProductRequest, ProductRequestSchema } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import {
  AutocompleteElement,
  SwitchElement,
  TextFieldElement,
  useForm,
} from 'react-hook-form-mui';
import RichTextEditor, {
  RichTextEditorRef,
} from '../../../../components/core/RichTextEditor';
import ImageUpload from './ImageUpload';

type ProductUpsertFormProps = {
  brands: ComboBoxItem[];
  categories: ComboBoxItem[];
  defaultImages?: string[];
  product: ProductRequest;
};

function ProductUpsertForm({
  brands,
  categories,
  product,
  defaultImages = [],
}: ProductUpsertFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const rteRef = useRef<RichTextEditorRef>(null);
  const { control, handleSubmit } = useForm<ProductRequest>({
    defaultValues: product,
    resolver: zodResolver(ProductRequestSchema),
  });
  const [chips, setChips] = useState<string[]>(product.tags ?? []);
  const [images, setImages] = useState<File[]>([]);

  const handleChipChange = (newChips: string[]) => {
    setChips(newChips);
  };

  const handleImageUpload = (newImages: File[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  const onSubmit = async (data: ProductRequest) => {
    const request: ProductRequest = {
      ...data,
      description: rteRef.current?.content ?? '',
      tags: chips,
      images: images,
    };
    const formData = convertObjectToFormData(request);
    if (product.id === EMPTY_UUID) {
      const response = await postApi(API_URL.product, formData);
      if (response.success) {
        enqueueSnackbar('Thêm mới sản phẩm thành công', {
          variant: 'success',
        });
        router.push('/dashboard/products');
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } else {
      const response = await putApi(API_URL.product, formData);
      if (response.success) {
        enqueueSnackbar('Cập nhật sản phẩm thành công', {
          variant: 'success',
        });
        router.push('/dashboard/products');
      } else {
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    const imagePromises = defaultImages.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], url.substring(url.lastIndexOf('/') + 1));
    });
    Promise.all(imagePromises).then((res) => {
      setImages(res);
    });
  }, [defaultImages]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate>
      <Grid
        container
        spacing={4}>
        <Grid
          item
          xs={12}
          md={8}>
          <Paper
            elevation={3}
            className='p-4 mb-4'>
            <Typography
              variant='h6'
              className='mb-4'>
              Thông tin cơ bản
            </Typography>
            <Grid
              container
              spacing={2}>
              <Grid
                item
                xs={12}>
                <TextFieldElement
                  control={control}
                  name='sku'
                  label='Mã sản phẩm'
                  required
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <TextFieldElement
                  control={control}
                  name='name'
                  label='Tên sản phẩm'
                  required
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={6}>
                <TextFieldElement
                  control={control}
                  name='price'
                  label='Giá gốc'
                  type='number'
                  required
                  fullWidth
                />
              </Grid>
              {/* <Grid
                item
                xs={6}>
                <TextFieldElement
                  name='discountPrice'
                  label='Giá khuyến mãi'
                  type='number'
                  fullWidth
                />
              </Grid> */}
              <Grid
                item
                xs={6}>
                <TextFieldElement
                  control={control}
                  name='stock'
                  label='Số lượng tồn kho'
                  type='number'
                  required
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={6}>
                <SwitchElement
                  control={control}
                  name='isFeatured'
                  label='Nổi bật'
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={3}
            className='p-4 mb-4'>
            <Typography
              variant='h6'
              className='mb-4'>
              Phân loại
            </Typography>
            <Grid
              container
              spacing={2}>
              <Grid
                item
                xs={12}>
                <AutocompleteElement
                  options={brands}
                  control={control}
                  name='brandId'
                  label='Thương hiệu'
                  autocompleteProps={{
                    autoHighlight: true,
                    noOptionsText: 'Không có kết quả',
                    getOptionLabel(option: ComboBoxItem) {
                      return option.text || '';
                    },
                    isOptionEqualToValue(
                      option: ComboBoxItem,
                      newValue: ComboBoxItem
                    ) {
                      return (
                        option.value.toLowerCase() ===
                        newValue.value.toLowerCase()
                      );
                    },
                  }}
                  transform={{
                    input: (value: string) =>
                      brands.find(
                        (brand) =>
                          brand.value.toLowerCase() === value.toLowerCase()
                      ) || null,
                    output: (event, value: ComboBoxItem | null) =>
                      value?.value || '',
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <AutocompleteElement
                  options={categories}
                  control={control}
                  name='categoryId'
                  label='Danh mục'
                  autocompleteProps={{
                    autoHighlight: true,
                    noOptionsText: 'Không có kết quả',
                    getOptionLabel(option: ComboBoxItem) {
                      return option.text || '';
                    },
                    isOptionEqualToValue(
                      option: ComboBoxItem,
                      newValue: ComboBoxItem
                    ) {
                      return (
                        option.value.toLowerCase() ===
                        newValue.value.toLowerCase()
                      );
                    },
                  }}
                  transform={{
                    input: (value: string) =>
                      categories.find(
                        (category) =>
                          category.value.toLowerCase() === value.toLowerCase()
                      ) || null,
                    output: (event, value: ComboBoxItem | null) =>
                      value?.value || '',
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <MuiChipsInput
                  fullWidth
                  value={chips}
                  onChange={handleChipChange}
                  label='Thẻ'
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={3}
            className='p-4 mb-4'>
            <Typography
              variant='h6'
              className='mb-4'>
              Mô tả sản phẩm
            </Typography>
            <RichTextEditor
              ref={rteRef}
              defaultContent={product.description ?? ''}
            />
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}>
          <Paper
            elevation={3}
            className='p-4 mb-4'>
            <Typography
              variant='h6'
              className='mb-4'>
              Ảnh sản phẩm
            </Typography>
            <ImageUpload
              onUpload={handleImageUpload}
              images={images}
            />
          </Paper>
        </Grid>
      </Grid>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 1,
          mt: 2,
        }}>
        <Button
          LinkComponent={Link}
          href='/dashboard/products'
          type='button'
          variant='contained'
          color='inherit'>
          Hủy
        </Button>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          sx={{
            textTransform: 'initial',
          }}>
          {product.id === EMPTY_UUID ? 'Thêm mới' : 'Cập nhật'}
        </Button>
      </Box>
    </form>
  );
}

export default ProductUpsertForm;
