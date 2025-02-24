import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { UserRequest } from '@/types';
import { EMPTY_UUID } from '@/constant/common';
import { IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { postApi, putApi } from '@/lib/apiClient';
import { API_URL } from '@/constant/apiUrl';
import { useSnackbar } from 'notistack';

interface UpsertDialogProps {
  open: boolean;
  handleClose: () => void;
  user: UserRequest;
}

export default function FormDialog({
  open,
  handleClose,
  user,
}: UpsertDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [userRequest, setUserRequest] = React.useState<UserRequest>({
    id: EMPTY_UUID,
    userName: '',
    familyName: '',
    givenName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roleId: EMPTY_UUID,
  });
  const [fullName, setFullName] = React.useState('');
  React.useEffect(() => {
    setUserRequest(user);
    setFullName(user.familyName + ' ' + user.givenName);
  }, [user]);
  return (
    <React.Fragment>
      <Dialog
        aria-labelledby='modal-upsert-user'
        aria-describedby='modal-user-description'
        keepMounted
        maxWidth='sm'
        fullWidth
        open={open}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(
              formData.entries()
            ) as object as UserRequest;
            formJson.familyName = fullName.split(' ')[0].trim();
            formJson.givenName = fullName.split(' ').slice(1).join(' ').trim();
            if (user.id === undefined || user.id === EMPTY_UUID) {
              postApi(API_URL.user, formJson)
                .then((response) => {
                  if (response.success) {
                    enqueueSnackbar('Thêm mới tài khoản thành công', {
                      variant: 'success',
                    });
                    handleClose();
                  } else {
                    enqueueSnackbar(response.message, { variant: 'error' });
                  }
                })
                .catch((err) => {
                  enqueueSnackbar('Thêm mới tài khoản thất bại ' + err, {
                    variant: 'error',
                  });
                });
            } else {
              putApi(API_URL.user, formJson)
                .then((response) => {
                  if (response.success) {
                    enqueueSnackbar('Cập nhật tài khoản thành công', {
                      variant: 'success',
                    });
                    handleClose();
                  } else {
                    enqueueSnackbar(response.message, { variant: 'error' });
                  }
                })
                .catch((err) => {
                  enqueueSnackbar('Cập nhật tài khoản thất bại ' + err, {
                    variant: 'error',
                  });
                });
            }
          },
        }}
      >
        <DialogTitle
          id='modal-upsert-user'
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography fontSize='1.4rem'>
            {user.id === undefined || user.id === EMPTY_UUID
              ? 'Thêm mới tài khoản'
              : 'Cập nhật tài khoản'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ ml: 'auto' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          aria-describedby='modal-user-description'
          dividers
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 2,
          }}
        >
          <TextField name='id' type='hidden' value={user.id ?? EMPTY_UUID} sx={{display: 'none'}}/>
          <TextField
            name='username'
            label='Tên người dùng'
            value={userRequest.userName ?? ''}
            onChange={(event) => {
              setUserRequest({ ...userRequest, userName: event.target.value });
            }}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            type='password'
            name='password'
            label='Mật khẩu'
            value={userRequest.password ?? ''}
            onChange={(event) => {
              setUserRequest({ ...userRequest, password: event.target.value });
            }}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            name='fullname'
            label='Họ và tên'
            value={fullName ?? ''}
            onChange={(event) => {
              setFullName(event.target.value);
            }}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            type='email'
            name='email'
            label='Email'
            value={userRequest.email ?? ''}
            onChange={(event) => {
              setUserRequest({
                ...userRequest,
                email: event.target.value,
              });
            }}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
          <TextField
            type='tel'
            name='phoneNumber'
            label='Số điện thoại'
            value={userRequest.phoneNumber ?? ''}
            onChange={(event) => {
              setUserRequest({
                ...userRequest,
                phoneNumber: event.target.value,
              });
            }}
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button type='submit'>Lưu</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
