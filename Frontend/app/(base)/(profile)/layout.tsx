'use client';

import { Box, Tab, Tabs } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

const tabs = [
  {
    label: 'Thông tin',
    href: '/profile',
  },
  {
    label: 'Bảo mật',
    href: '/security',
  },
  {
    label: 'Lịch sử mua hàng',
    href: '/orders',
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].href);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabs.findIndex((tab) => tab.href === pathname)}
          onChange={handleTabChange}>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ p: 2 }}>{children}</Box>
    </>
  );
}
