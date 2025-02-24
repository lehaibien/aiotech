"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton } from "@mui/material";
import Navigation from "./Navigation";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function NavigationDrawer() {
  const [open, setOpen] = useState(false);
  const handleNavigationDrawerClick = () => {
    setOpen(true);
  };

  const handleNavigationDrawerClose = () => {
    setOpen(false);
  };
  return (
    <Box
      sx={{
        display: {
          xs: "block",
          md: "none",
        },
      }}
    >
      <IconButton
        onClick={handleNavigationDrawerClick}
        sx={{
          order: 1,
        }}
        aria-label="Mở menu"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleNavigationDrawerClose}
        PaperProps={{
          sx: {
            width: 256,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 2,
            p: 2,
          }}
        >
          <IconButton
            onClick={handleNavigationDrawerClose}
            sx={{
              alignSelf: "flex-end",
              mb: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Navigation />
        </Box>
      </Drawer>
    </Box>
  );
}
