'use client';

import { ControlledTextField } from '@/components/core/ControlledTextField';
import { API_URL } from '@/constant/apiUrl';
import { postApi } from '@/lib/apiClient';
import { convertObjectToFormData, parseUUID } from '@/lib/utils';
import { ProfileFormData, profileSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  Box,
  Button,
  FormLabel,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EmailChangeDialog } from './EmailChangeDialog';
import { useProfileData } from './hooks/useProfileData';

export const ProfileForm = () => {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const userId = useMemo(() => session?.user?.id, [session?.user?.id]);

  const { data, isValidating, error, mutate } = useProfileData(userId || '');

  const { control, handleSubmit, setValue } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      familyName: data?.familyName,
      givenName: data?.givenName,
      phoneNumber: data?.phoneNumber,
      address: data?.address,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    const parsedId = parseUUID(userId || '');
    const extendedData = {
      ...data,
      id: parsedId,
    };
    const formData = convertObjectToFormData(extendedData);
    // TODO: Send formData to api
    postApi(API_URL.userProfile, formData).then((response) => {
      if (response.success) {
        enqueueSnackbar('Cập nhật tài khoản thành công', {
          variant: 'success',
        });
        mutate();
      } else {
        enqueueSnackbar('Lỗi xảy ra: ' + response.message, {
          variant: 'error',
        });
      }
    });
  };

  useEffect(() => {
    if (data) {
      setValue('familyName', data.familyName);
      setValue('givenName', data.givenName);
      setValue('phoneNumber', data.phoneNumber);
      setValue('address', data.address);
      if (data.avatarUrl.startsWith('http://host.docker.internal:5554/')) {
        data.avatarUrl = data.avatarUrl.replace(
          'http://host.docker.internal:5554/',
          'http://localhost:5554/'
        );
      }
      setAvatarPreview(data.avatarUrl);
    }
  }, [data, setValue]);

  if (error) {
    enqueueSnackbar('Lỗi xảy ra: ' + error.message, { variant: 'error' });
  }
  if (isValidating) return <div>Đang tải...</div>;

  return (
    <Box sx={{ mx: 'auto' }}>
      {/* Avatar Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <input
          accept='image/*'
          id='avatar-upload'
          type='file'
          hidden
          onChange={handleAvatarChange}
        />
        <label htmlFor='avatar-upload'>
          <IconButton component='span'>
            <Avatar
              src={avatarPreview}
              sx={{ width: 100, height: 100 }}
            />
            <CloudUploadIcon
              sx={{ position: 'absolute', bottom: 0, right: 0 }}
            />
          </IconButton>
        </label>
      </Box>
      <Grid
        component='form'
        container
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel htmlFor='familyName'>Họ</FormLabel>
          <ControlledTextField
            control={control}
            name='familyName'
            fullWidth
            size='small'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel
            htmlFor='givenName'
            required>
            Tên
          </FormLabel>
          <ControlledTextField
            control={control}
            name='givenName'
            fullWidth
            size='small'
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel
            htmlFor='email'
            required>
            Email
          </FormLabel>
          <TextField
            name='email'
            fullWidth
            size='small'
            value={data?.email}
            disabled
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setEmailDialogOpen(true)}>
                  <EditIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormLabel htmlFor='phoneNumber'>Số điện thoại</FormLabel>
          <ControlledTextField
            control={control}
            name='phoneNumber'
            fullWidth
            size='small'
          />
        </Grid>
        <Grid size={12}>
          <FormLabel
            htmlFor='address'
            required>
            Địa chỉ
          </FormLabel>
          <ControlledTextField
            control={control}
            name='address'
            multiline
            size='small'
            minRows={3}
            required
            fullWidth
          />
        </Grid>

        <Button
          type='submit'
          variant='contained'
          color='primary'>
          Lưu
        </Button>
      </Grid>

      <EmailChangeDialog
        oldEmail={data?.email}
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
      />
    </Box>
  );
};
