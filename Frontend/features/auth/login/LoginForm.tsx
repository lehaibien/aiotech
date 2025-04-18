'use client';

import { UserLoginRequest, UserLoginSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Stack,
  TextField,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginRequest>({ resolver: zodResolver(UserLoginSchema) });
  const onSubmit = async (data: UserLoginRequest) => {
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        enqueueSnackbar(result.code, { variant: 'error' });
        return;
      }
      enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
      router.push(redirectTo);
    } catch (err) {
      enqueueSnackbar((err as Error).message, { variant: 'error' });
    }
    return;
  };

  return (
    <Stack
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      gap={2}
      width='100%'>
      <FormControl>
        <FormLabel
          htmlFor='username'
          required>
          Tài khoản
        </FormLabel>
        <TextField
          id='username'
          autoFocus
          required
          fullWidth
          placeholder='Nhập tài khoản'
          {...register('username')}
          error={errors.username ? true : false}
          helperText={errors.username ? errors.username.message : undefined}
        />
      </FormControl>
      <FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormLabel
            htmlFor='password'
            required>
            Mật khẩu
          </FormLabel>
          <Link
            href='/forgot-password'
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            tabIndex={-1}>
            Quên mật khẩu?
          </Link>
        </Box>
        <TextField
          required
          fullWidth
          type='password'
          placeholder='••••••'
          {...register('password')}
          error={errors.password ? true : false}
          helperText={errors.password ? errors.password.message : undefined}
        />
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            value='remember'
            color='primary'
          />
        }
        label='Ghi nhớ tôi'
      />
      <Button
        type='submit'
        fullWidth
        variant='contained'
        color='primary'
        data-umami-event='Đăng nhập'>
        Đăng nhập
      </Button>
    </Stack>
  );
}
