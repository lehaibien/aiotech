'use client';

import { baseNavItems } from '@/constant/routes';
import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathName = usePathname();

  return (
    <Stack
      sx={{
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
      }}>
      {baseNavItems.map((nav) => {
        const isActive = pathName === nav.href;
        return (
          <Button
            key={nav.title}
            LinkComponent={Link}
            href={nav.href}
            startIcon={<nav.icon />}
            className={isActive ? 'active' : ''}>
            {nav.title}
          </Button>
        );
      })}
    </Stack>
  );
}
