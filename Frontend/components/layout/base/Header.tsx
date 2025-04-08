import BrandLogo from "@/components/core/BrandLogo";
import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { ComboBoxItem } from "@/types";
import { AppBar, Box, Toolbar } from "@mui/material";
import Link from "next/link";
import { AuthMenu } from "./AuthMenu";
import { CartDrawer } from "./CartDrawer";
import { CategoryMenu } from "./CategoriesMenu";
import { MobileDrawer } from "./MobileDrawer";
import Navigation from "./Navigation";
import { SearchBar } from "./SearchBar";

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
      {/* Main Toolbar */}
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingX: {
            xs: 0,
            md: 4,
          },
        }}
      >
        {/* Left section - Logo on desktop */}
        <Link href="/" className="flex-1 order-2 md:order-1 w-1/3 md:w-auto">
          <BrandLogo />
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
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            order: 3,
          }}
        >
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
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
        <Navigation />
      </Toolbar>
    </AppBar>
  );
}
