"use client";

import { BaseNavigation } from "@/constant/baseMenu";
import { ComboBoxItem } from "@/types";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type MobileDrawerProps = {
  categories: ComboBoxItem[];
};

// Update the MobileDrawer component
export function MobileDrawer({ categories }: MobileDrawerProps) {
  const pathName = usePathname();
  const [expanded, setExpanded] = useState(false);
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
    <Box
      sx={{
        flex: 1,
        display: {
          xs: "flex",
          md: "none",
        },
      }}
    >
      <IconButton
        sx={{
          display: "flex",
          order: 1,
          width: "auto",
          p: 1,
          color: "text.primary",
        }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={drawerOpen} onClose={onClose}>
        <Box sx={{ width: 280, p: 2 }}>
          {/* Main Navigation */}
          <List sx={{ mb: 2 }}>
            {BaseNavigation.map((nav, index) => (
              <React.Fragment key={nav.name}>
                <ListItem disablePadding>
                  <ListItemButton
                    component="a"
                    LinkComponent={Link}
                    href={nav.path}
                    selected={pathName === nav.path}
                    onClick={onClose}
                    sx={{
                      borderRadius: 1,
                      "&.Mui-selected": {
                        backgroundColor: "action.selected",
                        fontWeight: 600,
                      },
                    }}
                  >
                    {nav.icon && <ListItemIcon>{nav.icon}</ListItemIcon>}
                    <ListItemText primary={nav.name} />
                  </ListItemButton>
                </ListItem>

                {/* Insert categories after first navigation item */}
                {index === 0 && (
                  <ListItem
                    disablePadding
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <ListItemButton onClick={() => setExpanded(!expanded)}>
                      <ListItemIcon>
                        <CategoryOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Danh mục sản phẩm" />
                      {expanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={expanded}>
                      <List sx={{ pl: 4 }}>
                        <ListItem disablePadding>
                          <ListItemButton
                            component={Link}
                            href="/products"
                            onClick={onClose}
                            sx={{ pl: 4 }}
                          >
                            <ListItemText primary="Tất cả sản phẩm" />
                          </ListItemButton>
                        </ListItem>
                        {categories.map((category: ComboBoxItem) => (
                          <ListItem key={category.value} disablePadding>
                            <ListItemButton
                              component={Link}
                              href={`/products?category=${category.text}`}
                              onClick={onClose}
                              sx={{ pl: 4 }}
                            >
                              <ListItemText primary={category.text} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </ListItem>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
