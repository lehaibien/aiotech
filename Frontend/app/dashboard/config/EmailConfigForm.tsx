'use client';

import { ControlledTextField } from '@/components/core/ControlledTextField';
import { API_URL } from '@/constant/apiUrl';
import { postApi } from '@/lib/apiClient';
import { EmailConfiguration } from '@/types/sys-config';
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

const emailSchema = z.object({
  email: z.string().email('Vui lòng nhập email hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  host: z.string().min(1, 'Vui lòng nhập host'),
  port: z.string().min(1, 'Vui lòng nhập port hợp lệ'),
});

type EmailConfigFormProps = {
  email: EmailConfiguration;
};

export const EmailConfigForm = ({ email }: EmailConfigFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: email,
  });
  const onSubmit = async (data: EmailConfiguration) => {
    const response = await postApi(API_URL.emailConfig, data);
    if (response.success) {
      enqueueSnackbar('Lưu cấu hình email thành công', { variant: 'success' });
    } else {
      enqueueSnackbar('Lưu cấu hình email thất bại: ' + response.message, {
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
        Cấu Hình Email
      </Typography>
      <Grid
        container
        spacing={2}
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        noValidate>
        <Grid size={12}>
          <FormLabel required>Email</FormLabel>
          <ControlledTextField
            name='email'
            control={control}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid size={12}>
          <FormLabel required>Mật khẩu</FormLabel>
          <ControlledTextField
            name='password'
            control={control}
            fullWidth
            size='small'
            type='password'
          />
        </Grid>
        <Grid size={12}>
          <FormLabel required>Máy chủ</FormLabel>
          <ControlledTextField
            name='host'
            control={control}
            fullWidth
            size='small'
          />
        </Grid>
        <Grid size={12}>
          <FormLabel required>Cổng</FormLabel>
          <ControlledTextField
            name='port'
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
