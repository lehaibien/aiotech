"use client";

import ColorSchemeSwitch from "@/components/core/ColorSchemeSwitch";
import { useCategoryCombobox } from "@/components/hooks/useCategoryCombobox";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import AuthMenu from "./AuthMenu";
import CartDrawer from "./CartDrawer";
import CategoryMenu from "./CategoriesMenu";
import Navigation from "./Navigation";
import NavigationDrawer from "./NavigationDrawer";
import SearchBar from "./SearchBar";
import SiteInfo from "./SiteInfo";

export default function Header() {
  const { data: categories } = useCategoryCombobox();
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.getContrastText(theme.palette.background.default),
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            order: 0,
            minWidth: 100,
          }}
        >
          <Link href="/" className="flex items-center gap-1">
            <Image src="/favicon.svg" alt="Logo" width={32} height={32} />
            <Typography
              sx={{
                fontWeight: "semibold",
                display: {
                  xs: "none",
                  md: "inline",
                },
              }}
            >
              AioTech
            </Typography>
          </Link>
          <NavigationDrawer />
        </Box>

        <SearchBar categories={categories || []} />

        <Box sx={{ display: "flex", alignItems: "center", order: 3 }}>
          <ColorSchemeSwitch />
          <AuthMenu />
          <CartDrawer />
        </Box>
      </Toolbar>

      <Toolbar
        sx={{
          // display: 'flex',
          // [theme.breakpoints.down('sm')]: {
          //   display: 'none',
          // },
          display: {
            xs: "none",
            md: "flex",
          },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CategoryMenu data={categories || []} />
        <SiteInfo />
        <Navigation />
      </Toolbar>
    </AppBar>
  );
}
