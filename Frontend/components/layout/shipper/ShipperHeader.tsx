"use client";

import BrandLogo from "@/components/core/BrandLogo";
import ColorSchemeSwitch from "@/components/core/ColorSchemeSwitch";
import { Menu } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import * as React from "react";
import AccountSection from "../dashboard/Account";
import Searchbar from "../dashboard/SearchBar";
import { DashboardMenuContext } from "@/providers/DashboardMenuProvider";

export default function ShipperHeader() {
  const [open, setOpen] = React.useContext(DashboardMenuContext);
  function toggleMenu() {
    const isOpen = !open;
    setOpen(isOpen);
  }
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
            AioTech giao hàng
          </Typography>
        </Box>
        <IconButton onClick={toggleMenu} aria-label="Open menu">
          <Menu />
        </IconButton>
      </Box>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Searchbar />
        <ColorSchemeSwitch />
        <AccountSection />
      </Stack>
    </Stack>
  );
}