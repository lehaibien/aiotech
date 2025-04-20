'use client';

import { API_URL } from '@/constant/apiUrl';
import { postApi } from '@/lib/apiClient';
import { UserRegisterRequest, UserRegisterSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SocialLogin from '../SocialLogin';

export default function RegisterComponent() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [fullname, setFullname] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterRequest>({
    resolver: zodResolver(UserRegisterSchema),
  });
  const onSubmit = async (data: UserRegisterRequest) => {
    const trimmedName = fullname.trim().split(' ');
    data.givenName = trimmedName.pop();
    data.familyName = trimmedName.join(' ');
    const response = await postApi(API_URL.register, data);
    if (response.success) {
      enqueueSnackbar('Đăng ký thành công!', { variant: 'success' });
      router.push('/');
    } else {
      enqueueSnackbar('Đăng ký thất bại: ' + response.message, {
        variant: 'error',
      });
    }
  };
  return (
    <Box
      sx={{
        padding: 5,
        width: {
          xs: '100%',
          md: '30%',
        },
        mx: 'auto',
      }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
        Đăng ký
      </Typography>
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}>
        <FormControl>
          <FormLabel
            htmlFor='username'
            required>
            Tài khoản
          </FormLabel>
          <TextField
            autoFocus
            required
            fullWidth
            variant='outlined'
            color='primary'
            {...register('userName')}
            error={errors.userName ? true : false}
            helperText={errors.userName ? errors.userName.message : undefined}
            sx={{ ariaLabel: 'email' }}
          />
        </FormControl>
        <FormControl>
          <FormLabel
            htmlFor='password'
            required>
            Mật khẩu
          </FormLabel>
          <TextField
            autoFocus
            required
            fullWidth
            placeholder='••••••'
            type='password'
            {...register('password')}
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : undefined}
            variant='outlined'
            color='primary'
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='fullname'>Họ và tên</FormLabel>
          <TextField
            autoFocus
            required
            fullWidth
            name='fullName'
            value={fullname}
            onChange={(event) => {
              setFullname(event.target.value);
            }}
            // error={fullname.length <= 0}
            // helperText={
            //   fullname.length <= 0 ? 'Họ và tên không được để trống' : undefined
            // }
            variant='outlined'
            color='primary'
          />
        </FormControl>
        <FormControl>
          <FormLabel
            htmlFor='email'
            required>
            Email
          </FormLabel>
          <TextField
            autoFocus
            required
            fullWidth
            type='email'
            {...register('email')}
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : undefined}
            variant='outlined'
            color='primary'
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='phonenumber'>Số điện thoại</FormLabel>
          <TextField
            autoFocus
            required
            fullWidth
            type='tel'
            {...register('phoneNumber')}
            error={errors.phoneNumber ? true : false}
            helperText={
              errors.phoneNumber ? errors.phoneNumber.message : undefined
            }
            variant='outlined'
            color='primary'
          />
        </FormControl>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          data-umami-event='Đăng ký'>
          Đăng ký
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Đã có tài khoản?{' '}
          <span>
            <Link
              href='/login'
              style={{
                fontWeight: 600,
              }}>
              Đăng nhập ngay
            </Link>
          </span>
        </Typography>
        <Divider>Hoặc</Divider>
        <SocialLogin isRegister />
      </Box>
    </Box>
  );
}
