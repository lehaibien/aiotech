import BrandLogo from '@/components/core/BrandLogo';
import ColorSchemeSwitch from '@/components/core/ColorSchemeSwitch';
import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import AccountSection from './Account';
import { MenuButton } from './MenuButton';

export default async function Header() {
  return (
    <Stack
      direction='row'
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        py: 1,
        px: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
      spacing={2}>
      <Box
        width='220px'
        display='flex'
        alignItems='center'
        justifyContent='space-between'>
        <BrandLogo />
        <MenuButton />
      </Box>
      <Stack
        direction='row'
        sx={{ gap: 1 }}>
        {/* <Notification showBadge /> */}
        <ColorSchemeSwitch />
        <AccountSection />
      </Stack>
    </Stack>
  );
}
