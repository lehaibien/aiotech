'use client';

import ControlledComboBox from '@/components/core/ControlledComboBox';
import { ControlledTextField } from '@/components/core/ControlledTextField';
import { API_URL } from '@/constant/apiUrl';
import { EMPTY_UUID } from '@/constant/common';
import { postApi, putApi } from '@/lib/apiClient';
import { convertObjectToFormData } from '@/lib/utils';
import { userRequestSchema } from '@/schemas/userSchema';
import { ComboBoxItem, UserRequest, UserResponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type UserUpsertFormProps = {
  data: UserResponse;
  roleCombobox: ComboBoxItem[];
};

export function UserUpsertForm({ data, roleCombobox }: UserUpsertFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState(data.avatarUrl);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, control } = useForm<UserRequest>({
    defaultValues: { ...data, password: '' },
    resolver: zodResolver(userRequestSchema),
  });
  const onSubmit = async (request: UserRequest) => {
    setIsLoading(true);
    const formData = convertObjectToFormData(request);
    try {
      const action = data.id === EMPTY_UUID ? postApi : putApi;
      const actionMessage = data.id === EMPTY_UUID ? 'Thêm mới' : 'Cập nhật';
      const response = await action(API_URL.user, formData);
      if (response.success) {
        enqueueSnackbar(`${actionMessage} tài khoản thành công`, {
          variant: 'success',
        });
        router.push('/dashboard/users');
      } else {
        enqueueSnackbar('Lỗi xảy ra: ' + response.message, {
          variant: 'error',
        });
      }
    } catch (err) {
      enqueueSnackbar('Lỗi xảy ra: ' + (err as Error).message, {
        variant: 'error',
      });
    }
    setIsLoading(false);
  };
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  return (
    <Stack
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      spacing={2}>
      <TextField
        type='hidden'
        {...register('id')}
        sx={{
          display: 'none',
        }}
      />
      <Box
        sx={{
          display: { sm: 'block', md: 'flex' },
          gap: 2,
        }}>
        <FormControl fullWidth>
          <FormLabel
            htmlFor='userName'
            required>
            Tên tài khoản
          </FormLabel>
          <ControlledTextField
            required
            control={control}
            name='userName'
            size='small'
            autoFocus
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel
            htmlFor='email'
            required>
            Email
          </FormLabel>
          <ControlledTextField
            required
            control={control}
            name='email'
            size='small'
            type='email'
            autoComplete='email'
          />
        </FormControl>
      </Box>
      <Box
        sx={{
          display: { sm: 'block', md: 'flex' },
          gap: 2,
        }}>
        <FormControl fullWidth>
          <FormLabel
            htmlFor='familyName'
            required>
            Họ
          </FormLabel>
          <ControlledTextField
            required
            control={control}
            name='familyName'
            size='small'
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel
            htmlFor='givenName'
            required>
            Tên
          </FormLabel>
          <ControlledTextField
            required
            control={control}
            name='givenName'
            size='small'
          />
        </FormControl>
      </Box>

      <Box
        sx={{
          display: { sm: 'block', md: 'flex' },
          gap: 2,
        }}>
        <FormControl fullWidth>
          <FormLabel htmlFor='phoneNumber'>Số điện thoại</FormLabel>
          <ControlledTextField
            control={control}
            name='phoneNumber'
            size='small'
            type='tel'
            autoComplete='tel'
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel
            htmlFor='roleId'
            required>
            Vai trò
          </FormLabel>
          <ControlledComboBox
            control={control}
            items={roleCombobox}
            name='roleId'
            size='small'
            compareBy='text'
          />
        </FormControl>
      </Box>
      <FormControl fullWidth>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <ControlledTextField
          control={control}
          name='password'
          size='small'
          type='password'
          autoComplete='current-password'
        />
      </FormControl>
      <FormControl fullWidth>
        <FormLabel htmlFor='avatar-upload'>Hình ảnh</FormLabel>
        <Box>
          <input
            accept='image/*'
            id='avatar-upload'
            name='avatar-upload'
            type='file'
            hidden
            onChange={handleAvatarChange}
          />
          <label htmlFor='avatar-upload'>
            <IconButton
              disableRipple
              component='span'>
              <Avatar
                src={avatarPreview}
                sx={{ width: 100, height: 100, mb: 1 }}
              />
              <CloudUploadIcon
                sx={{ position: 'absolute', bottom: 8, right: 8 }}
              />
            </IconButton>
          </label>
        </Box>
      </FormControl>
      <FormControl
        fullWidth
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 1,
        }}>
        <Button
          type='button'
          LinkComponent={Link}
          href='/dashboard/users'
          variant='contained'
          disabled={isLoading}>
          Hủy
        </Button>
        <Button
          type='submit'
          variant='contained'
          color='primary'>
          {isLoading
            ? 'Đang xử lý...'
            : data.id === EMPTY_UUID
            ? 'Thêm mới'
            : 'Cập nhật'}
        </Button>
      </FormControl>
    </Stack>
  );
}
