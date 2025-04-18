'use client';

import ControlledComboBox from '@/components/core/ControlledComboBox';
import { ControlledTextField } from '@/components/core/ControlledTextField';
import RichTextEditor, {
  RichTextEditorRef,
} from '@/components/core/RichTextEditor';
import { API_URL } from '@/constant/apiUrl';
import { EMPTY_UUID } from '@/constant/common';
import { postApi, putApi } from '@/lib/apiClient';
import { convertObjectToFormData } from '@/lib/utils';
import { ComboBoxItem } from '@/types';
import { type ProductRequest, ProductRequestSchema } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, FormLabel, Grid2 as Grid, Typography } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { ImageUpload } from './ImageUpload';
import { FormActions } from './ProductFormActions';

type ProductUpsertFormProps = {
  brands: ComboBoxItem[];
  categories: ComboBoxItem[];
  defaultImages?: string[];
  product: ProductRequest;
};

const featuredOptions = [
  { value: 'true', text: 'Có' },
  { value: 'false', text: 'Không' },
];

export const ProductUpsertForm = ({
  brands,
  categories,
  product,
  defaultImages = [],
}: ProductUpsertFormProps) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const rteRef = useRef<RichTextEditorRef>(null);

  const { control, handleSubmit } = useForm<ProductRequest>({
    defaultValues: {
      ...product,
      discountPrice: product.discountPrice ?? undefined,
    },
    resolver: zodResolver(ProductRequestSchema),
  });

  const [chips, setChips] = useState<string[]>(product.tags ?? []);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const onSubmit = async (data: ProductRequest) => {
    setIsLoading(true);
    try {
      const request: ProductRequest = {
        ...data,
        discountPrice: data.discountPrice || undefined,
        description: rteRef.current?.content ?? '',
        tags: chips,
        images,
      };

      const formData = convertObjectToFormData(request);
      const action = product.id === EMPTY_UUID ? postApi : putApi;
      const response = await action(API_URL.product, formData);

      if (response.success) {
        const message =
          product.id === EMPTY_UUID
            ? 'Thêm mới sản phẩm thành công'
            : 'Cập nhật sản phẩm thành công';
        enqueueSnackbar(message, { variant: 'success' });
        router.push('/dashboard/products');
      } else {
        enqueueSnackbar(response.message ?? 'Đã xảy ra lỗi khi xử lý yêu cầu', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar('Đã xảy ra lỗi khi xử lý yêu cầu', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getImages = async (urls: string[]) => {
      if (urls.length == 0) return [];

      try {
        const responses = await Promise.all(
          urls.map(async (url) => {
            const response = await fetch(url, {
              mode: 'cors', // Enable CORS
            });
            if (!response.ok) throw new Error('Failed to fetch image');

            const blob = await response.blob();
            return new File([blob], url.substring(url.lastIndexOf('/') + 1));
          })
        );

        const files: File[] = responses.filter(
          (file) => file !== undefined
        ) as File[];
        return files;
      } catch (err) {
        console.error('Image fetch error:', err);
        return [];
      }
    };

    getImages(defaultImages)
      .then(setImages)
      .catch((err) => console.error('Image processing error:', err));
  }, [defaultImages]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate>
      <Grid
        container
        spacing={4}>
        {/* Product Information Section */}
        <Grid size={{ sm: 12, md: 8 }}>
          <Box sx={{ py: 2 }}>
            <Typography
              variant='h5'
              gutterBottom>
              Thông tin chung
            </Typography>

            <Grid
              container
              spacing={2}>
              <Grid size={6}>
                <FormLabel
                  htmlFor='sku'
                  required>
                  Mã sản phẩm
                </FormLabel>
                <ControlledTextField
                  control={control}
                  name='sku'
                  required
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid size={6}>
                <FormLabel
                  htmlFor='name'
                  required>
                  Tên sản phẩm
                </FormLabel>
                <ControlledTextField
                  control={control}
                  name='name'
                  required
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid size={6}>
                <FormLabel required>Giá gốc</FormLabel>
                <ControlledTextField
                  control={control}
                  name='price'
                  type='number'
                  required
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid size={6}>
                <FormLabel>Giá khuyến mãi</FormLabel>
                <ControlledTextField
                  control={control}
                  name='discountPrice'
                  type='number'
                  fullWidth
                  size='small'
                  InputProps={{
                    inputProps: { min: 0, max: Number.MAX_SAFE_INTEGER },
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    return value === '' ? null : Number(value);
                  }}
                />
              </Grid>
              <Grid size={6}>
                <FormLabel required>Số lượng tồn kho</FormLabel>
                <ControlledTextField
                  control={control}
                  name='stock'
                  type='number'
                  required
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid size={6}>
                <FormLabel>Nổi bật</FormLabel>
                <ControlledComboBox
                  control={control as unknown as Control<FieldValues>}
                  name='isFeatured'
                  items={featuredOptions}
                  required
                  size='small'
                />
              </Grid>

              <Grid size={6}>
                <FormLabel required>Thương hiệu</FormLabel>
                <ControlledComboBox
                  control={control as unknown as Control<FieldValues>}
                  name='brandId'
                  items={brands}
                  required
                  size='small'
                />
              </Grid>

              <Grid size={6}>
                <FormLabel required>Danh mục</FormLabel>
                <ControlledComboBox
                  control={control as unknown as Control<FieldValues>}
                  name='categoryId'
                  items={categories}
                  required
                  size='small'
                />
              </Grid>

              <Grid size={12}>
                <FormLabel htmlFor='tags'>Thẻ</FormLabel>
                <MuiChipsInput
                  fullWidth
                  name='tags'
                  size='small'
                  value={chips}
                  onChange={setChips}
                  placeholder='Nhập và nhấn Enter để thêm thẻ'
                />
              </Grid>

              <Grid size={12}>
                <Typography
                  variant='body1'
                  gutterBottom
                  sx={{ mt: 1 }}>
                  Mô tả
                </Typography>
                <RichTextEditor
                  ref={rteRef}
                  defaultContent={product.description ?? ''}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Product Images Section */}
        <Grid size={{ sm: 12, md: 4 }}>
          <Box sx={{ py: 2 }}>
            <Typography
              variant='h5'
              gutterBottom>
              Ảnh sản phẩm
            </Typography>
            <ImageUpload
              images={images}
              onUpload={setImages}
              onDelete={handleDeleteImage}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Form Actions */}
      <FormActions
        isLoading={isLoading}
        isNew={product.id === EMPTY_UUID}
      />
    </form>
  );
};
