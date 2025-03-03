import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { ComboBoxItem } from "@/types";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { AuthMenu } from "./AuthMenu";
import { CartDrawer } from "./CartDrawer";
import { CategoryMenu } from "./CategoriesMenu";
import { SearchBar } from "./SearchBar";
import { SiteInfo } from "./SiteInfo";
import { MobileDrawer } from "./MobileDrawer";

export default async function Header() {
  let categories: ComboBoxItem[] = [];
  const response = await getApi(API_URL.categoryComboBox);
  if (response.success) {
    categories = response.data as ComboBoxItem[];
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "divider",
      }}
    >
      {/* Client components are handled by HeaderClient */}

      {/* Main Toolbar */}
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left section - Logo on desktop */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 order-2 md:order-1 w-1/3 md:w-auto"
        >
          <Image
            src="/favicon.svg"
            alt="Logo"
            width={32}
            height={32}
            style={{
              aspectRatio: 1 / 1,
              minWidth: 32,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "semibold",
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            AioTech
          </Typography>
        </Link>

        {/* Center section - Logo on mobile */}
        {/* Client components for search and interactive elements */}
        {/* Mobile Drawer */}
        <MobileDrawer categories={categories} />

        {/* Search components */}
        {/* <Box sx={{ width: "100%", display: { xs: "none", md: "block" } }}>
        <SearchBar categories={categories} />
      </Box> */}
        <Box
          sx={{ display: { xs: "none", md: "block" }, order: 2, width: "50%" }}
        >
          <SearchBar categories={categories} />
        </Box>

        {/* User controls */}
        <Box
          sx={{
            display: "flex",
            order: 3,
            width: {
              xs: "33%",
              md: "auto",
            },
          }}
        >
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <SearchBar categories={categories} />
          </Box>
          <AuthMenu />
          <CartDrawer />
        </Box>
      </Toolbar>

      {/* Desktop Categories Menu */}
      <Toolbar
        sx={{
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
      </Toolbar>
    </AppBar>
  );
}
