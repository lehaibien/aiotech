import 'server-only'

import { Metadata } from 'next';
import RegisterComponent from '@/features/auth/register/RegisterComponent';

export const metadata : Metadata = {
  title: 'Register'
}

function Page() {
  return <RegisterComponent />;
}

export default Page
