"use client";

import { ComboBoxItem } from "@/types";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  alpha,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useCallback, useState } from "react";

type CategoryMenuProps = {
  data: ComboBoxItem[];
  position?: "absolute" | "unset";
};

export function CategoryMenu({ position, data }: CategoryMenuProps) {
  const theme = useTheme();
  const [categoryAnchorEl, setCategoriesAnchorEl] =
    useState<null | HTMLElement>(null);
  const categoryMenuOpen = Boolean(categoryAnchorEl);
  const handleCategoriesClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setCategoriesAnchorEl(event.currentTarget);
    },
    []
  );
  const handleCategoriesClose = useCallback(() => {
    setCategoriesAnchorEl(null);
  }, []);
  return (
    <>
      <Button
        startIcon={<GridViewOutlinedIcon />}
        endIcon={
          <KeyboardArrowRightIcon
            sx={{
              transform: categoryMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        }
        onClick={handleCategoriesClick}
        sx={{
          fontSize: "1.1rem",
          width: "12rem",
          display: "flex",
          justifyContent: "flex-start",
          padding: "0.5rem 1rem",
          borderRadius: 1.5,
          transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          "& > .MuiButton-endIcon": {
            marginLeft: "auto",
          },
          "& > .MuiButton-startIcon": {
            marginRight: 1.5,
          },
          color: theme.palette.text.primary,
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
      >
        Danh mục
      </Button>
      <Popover
        open={categoryMenuOpen}
        anchorEl={categoryAnchorEl}
        onClose={handleCategoriesClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          maxHeight: "32rem",
          "& .MuiPaper-root": {
            borderRadius: 2,
            overflow: "auto",
          },
        }}
      >
        <Box
          position={position}
          sx={(theme) => ({
            left: 0,
            zIndex: 98,
            right: "auto",
            padding: 0,
            transformOrigin: "top",
            boxShadow: theme.shadows[3],
            position: position || "unset",
            transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
            transform: categoryMenuOpen ? "scaleY(1)" : "scaleY(0)",
            backgroundColor: theme.palette.background.paper,
            top: position === "absolute" ? "calc(100% + 0.7rem)" : "0.5rem",
          })}
        >
          <List
            sx={{
              padding: "0.5rem 0",
              width: "16rem",
            }}
          >
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/products"
                onClick={handleCategoriesClose}
                sx={{
                  py: 1.2,
                  px: 2,
                  transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemText
                  primary="Tất cả sản phẩm"
                  primaryTypographyProps={{
                    sx: {
                      textAlign: "center",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
            {data.map((category, index) => (
              <ListItem key={category.value || index} disablePadding>
                <ListItemButton
                  component={Link}
                  href={`/products?category=${category.text}`}
                  onClick={handleCategoriesClose}
                  sx={{
                    py: 1.2,
                    px: 2,
                    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemText
                    primary={category.text}
                    primaryTypographyProps={{
                      sx: {
                        textAlign: "center",
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}
