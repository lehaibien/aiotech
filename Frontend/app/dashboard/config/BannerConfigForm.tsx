'use client';

import { ControlledTextField } from '@/components/core/ControlledTextField';
import { API_URL } from '@/constant/apiUrl';
import { postApi } from '@/lib/apiClient';
import { BannerConfiguration } from '@/types/sys-config';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Paper,
  Typography,
  Grid,
  FormLabel,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const bannerSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().min(1, 'Vui lòng nhập mô tả'),
  imageUrl: z.string().url('Vui lòng nhập URL hình ảnh hợp lệ'),
});

type BannerConfigFormProps = {
  banner: BannerConfiguration;
};

export const BannerConfigForm = ({ banner }: BannerConfigFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: banner,
  });
  const onSubmit = async (data: BannerConfiguration) => {
    const response = await postApi(API_URL.bannerConfig, data);
    if (response.success) {
      enqueueSnackbar('Lưu cấu hình banner thành công', { variant: 'success' });
    } else {
      enqueueSnackbar('Lưu cấu hình banner thất bại: ' + response.message, {
        variant: 'error',
      });
    }
  };
  return (
    <Paper
      sx={{
        p: 2,
      }}>
      <Typography
        variant='h6'
        gutterBottom>
        Cấu Hình Banner
      </Typography>
      <Grid
        container
        spacing={2}
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        noValidate>
        <Grid size={12}>
          <FormLabel required>Tiêu đề</FormLabel>
          <ControlledTextField
            name='title'
            control={control}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid size={12}>
          <FormLabel required>Mô tả</FormLabel>
          <ControlledTextField
            name='description'
            control={control}
            fullWidth
            multiline
            rows={4}
            size='small'
          />
        </Grid>
        <Grid size={12}>
          <FormLabel required>Hình ảnh</FormLabel>
          <ControlledTextField
            name='imageUrl'
            control={control}
            fullWidth
            size='small'
          />
        </Grid>
        <Button
          type='submit'
          variant='contained'
          color='primary'>
          Lưu cấu hình
        </Button>
      </Grid>
    </Paper>
  );
};
