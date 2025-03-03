"use client";

import { ComboBoxItem } from "@/types";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useState } from "react";

interface MobileDrawerProps {
  categories: ComboBoxItem[];
}

export function MobileDrawer({ categories }: MobileDrawerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const onClose = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(false);
  };
  return (
    <>
      <IconButton
        sx={{ display: { xs: "flex", md: "none" }, order: 1, width: "33%", justifyContent: "flex-start" }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={onClose}>
        <Box
          sx={{ width: 280, pt: 2, px: 2 }}
          role="presentation"
          onClick={(event) => {
            // Don't close if clicking on interactive elements
            if (
              event.target instanceof Element &&
              (event.target.closest("a") ||
                event.target.closest("button") ||
                event.target.closest(".MuiListItemButton-root"))
            ) {
              event.stopPropagation();
              return;
            }
            onClose(event);
          }}
          onKeyDown={onClose}
        >
          <Typography>Danh mục sản phẩm</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/products">
                <ListItemText primary="Tất cả sản phẩm" />
              </ListItemButton>
            </ListItem>
            {categories.map((category) => (
              <ListItem key={category.value} disablePadding>
                <ListItemButton
                  component={Link}
                  href={`/products?category=${category.text}`}
                >
                  <ListItemText primary={category.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
