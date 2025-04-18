import NavBreadcrumbs from '@/components/core/NavBreadcrumbs';
import { API_URL } from '@/constant/apiUrl';
import { getApi } from '@/lib/apiClient';
import { BannerConfiguration, EmailConfiguration } from '@/types/config';
import { Stack, Typography } from '@mui/material';
import { BannerConfigForm } from './BannerConfigForm';
import { EmailConfigForm } from './EmailConfigForm';

const breadcrums = [
  {
    label: '',
    href: 'dashboard',
  },
  {
    label: 'Cài đặt hệ thống',
    href: '?',
  },
];

export default async function ConfigurationPage() {
  let banner: BannerConfiguration = {
    title: '',
    description: '',
    imageUrl: '',
  };

  let email: EmailConfiguration = {
    email: '',
    password: '',
    host: '',
    port: 0,
  };

  const bannerResponse = await getApi(API_URL.bannerConfig);
  if (bannerResponse.success) {
    banner = bannerResponse.data as BannerConfiguration;
  } else {
    console.error('Failed to load banner config: ', bannerResponse.message);
  }

  const emailResponse = await getApi(API_URL.emailConfig);
  if (emailResponse.success) {
    email = emailResponse.data as EmailConfiguration;
  } else {
    console.error('Failed to load email config: ', emailResponse.message);
  }
  return (
    <Stack gap={2}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant='h5'>Cài đặt hệ thống</Typography>
      <BannerConfigForm banner={banner} />
      <EmailConfigForm email={email} />
    </Stack>
  );
}
