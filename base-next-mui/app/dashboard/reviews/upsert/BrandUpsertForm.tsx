'use client';

import { API_URL } from '@/constant/apiUrl';
import { EMPTY_UUID } from '@/constant/common';
import { postApi, putApi } from '@/lib/apiClient';
import { BrandRequest, BrandRequestSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControl, FormLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

type BrandUpsertFormProps = {
  data: BrandRequest;
};

function BrandUpsertForm({ data }: BrandUpsertFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandRequest>({
    defaultValues: data,
    resolver: zodResolver(BrandRequestSchema),
  });
  const onSubmit = async (request: BrandRequest) => {
    try {
      if (data.id === EMPTY_UUID) {
        const response = await postApi(API_URL.brand, request);
        if (response.success) {
          enqueueSnackbar('Thêm mới thương hiệu thành công', {
            variant: 'success',
          });
          router.push('/dashboard/brands');
        } else {
          enqueueSnackbar('Lỗi xảy ra: ' + response.message, {
            variant: 'error',
          });
        }
      } else {
        const response = await putApi(API_URL.brand, request);
        if (response.success) {
          enqueueSnackbar('Cập nhật thương hiệu thành công', {
            variant: 'success',
          });
          router.push('/dashboard/brands');
        } else {
          enqueueSnackbar('Lỗi xảy ra: ' + response.message, {
            variant: 'error',
          });
        }
      }
    } catch (err) {
      enqueueSnackbar('Lỗi xảy ra: ' + (err as Error).message, {
        variant: 'error',
      });
    }
  };
  const goBack = () => {
    router.push('/dashboard/brands');
  };
  return (
    <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        type='hidden'
        sx={{
          display: 'none',
        }}
        {...register('id')}
      />
      <FormControl margin='normal' fullWidth>
        <FormLabel htmlFor='name' required>
          Tên thương hiệu
        </FormLabel>
        <TextField
          id='name'
          required
          {...register('name')}
          error={errors.name ? true : false}
          helperText={errors.name ? errors.name.message : undefined}
        />
      </FormControl>
      <FormControl
        margin='normal'
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 1,
        }}
        fullWidth
      >
        <Button
          type='button'
          variant='contained'
          color='inherit'
          onClick={goBack}
        >
          Hủy
        </Button>
        <Button type='submit' variant='contained' color='primary'>
          {data.id === EMPTY_UUID ? 'Thêm mới' : 'Cập nhật'}
        </Button>
      </FormControl>
    </Box>
  );
}

export default BrandUpsertForm;
