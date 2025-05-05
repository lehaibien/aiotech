"use client";

import { BrandLogo } from "@/components/core/BrandLogo";
import { ComboBoxItem } from "@/types";
import { Box, Group } from "@mantine/core";
import { AuthMenu } from "./AuthMenu";
import { CartDrawer } from "./CartDrawer";
import { MobileDrawer } from "./MobileDrawer";
import { SearchBar } from "./SearchBar";
import { WishList } from "./WishList";

type HeaderProps = {
  categories: ComboBoxItem[];
};

export const Header = ({ categories }: HeaderProps) => {
  return (
    <Group justify="space-between">
      <Box
        flex={1}
        style={{
          order: 2,
        }}
      >
        <BrandLogo
          href="/"
          display={{
            base: "none",
            md: "inline-block",
          }}
        />
      </Box>
      <MobileDrawer categories={categories} />
      <Box
        display={{
          base: "none",
          md: "flex",
        }}
        style={{
          order: 2,
        }}
        flex={2}
      >
        <SearchBar categories={categories} />
      </Box>
      <Group
        flex={1}
        gap={4}
        justify="flex-end"
        align="center"
        wrap="nowrap"
        style={{
          order: 3,
        }}
      >
        <Box
          display={{
            base: "flex",
            md: "none",
          }}
        >
          <SearchBar categories={categories} />
        </Box>
        <AuthMenu />
        <WishList />
        <CartDrawer />
      </Group>
    </Group>
  );
};
