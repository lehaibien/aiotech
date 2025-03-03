import BrandLogo from "@/components/core/BrandLogo";
import ColorSchemeSwitch from "@/components/core/ColorSchemeSwitch";
import { Box, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import AccountSection from "./Account";
import { MenuButton } from "./MenuButton";
import Searchbar from "./SearchBar";

export default async function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        py: 1,
        px: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
      spacing={2}
    >
      <Box
        width="220px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" gap={1}>
          <BrandLogo />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AioTech
          </Typography>
        </Box>
        <MenuButton />
      </Box>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Searchbar />
        {/* <Notification showBadge /> */}
        <ColorSchemeSwitch />
        <AccountSection />
      </Stack>
    </Stack>
  );
}
