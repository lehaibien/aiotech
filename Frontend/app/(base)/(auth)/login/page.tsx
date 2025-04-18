import { LoginForm } from '@/features/auth/login/LoginForm';
import SocialLogin from '@/features/auth/SocialLogin';
import { Divider, Stack, Typography } from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const searchParameters = await searchParams;
  const redirect = searchParameters?.redirect ?? '/';
  return (
    <Stack
      width={{ xs: '100%', md: '400px' }}
      margin='auto'
      gap={2}>
      <Typography
        component='h1'
        variant='h4'>
        Đăng nhập
      </Typography>
      <LoginForm redirectTo={redirect} />
      <Typography sx={{ textAlign: 'center' }}>
        Không có tài khoản?{' '}
        <Link
          href='/register'
          style={{
            fontWeight: 600,
          }}>
          Đăng ký ngay
        </Link>
      </Typography>
      <Divider>Hoặc</Divider>
      <SocialLogin redirectTo={redirect} />
    </Stack>
  );
}
