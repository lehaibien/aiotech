import 'server-only'

import RegisterComponent from '@/components/base/auth/register/RegisterComponent';
import { Metadata } from 'next';

export const metadata : Metadata = {
  title: 'Register'
}

function Page() {
  return <RegisterComponent />;
}

export default Page
