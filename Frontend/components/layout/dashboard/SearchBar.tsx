"use client";

import { DashboardMenu, dashboardMenus } from "@/constant/dashboardMenu";
import { Close, Search } from "@mui/icons-material";
import {
  alpha,
  Box,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from "@mui/material";
import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SearchBar() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  const fuse = useMemo(() => {
    const flattenMenu = (
      menu: DashboardMenu,
      parent?: string
    ): Array<DashboardMenu & { parent?: string }> => {
      if (menu.path) return [{ ...menu, parent }];
      if (menu.children) {
        return menu.children.flatMap((child) => flattenMenu(child, menu.name));
      }
      return [];
    };

    const flatMenus = dashboardMenus
      .flatMap((menu) => flattenMenu(menu))
      .filter((item): item is DashboardMenu & { path: string } => !!item.path);

    return new Fuse(flatMenus, {
      keys: ["name", "parent"],
      includeMatches: true,
      threshold: 0.3,
      shouldSort: true,
      includeScore: true,
      useExtendedSearch: true,
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    return fuse.search(searchQuery).map((result) => ({
      ...result.item,
      parent: (result.item as { parent?: string }).parent,
      matches: result.matches,
    }));
  }, [searchQuery, fuse]);

  return (
    <>
      <IconButton
        onClick={() => setShowDrawer(true)}
        size="large"
        sx={{
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
        aria-label="Tìm kiếm chức năng"
      >
        <Search fontSize="small" />
      </IconButton>

      <Drawer
        anchor="top"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{
          sx: {
            backdropFilter: "blur(12px)",
            bgcolor: alpha(theme.palette.background.default, 0.9),
            borderRadius: 2,
            mx: "auto",
            mt: 2,
            p: 2,
            width: {
              xs: "95%",
              sm: "60%",
            },
            boxShadow: theme.shadows[6],
            overflow: "hidden",
          },
        }}
      >
        <Box position="relative">
          <Input
            fullWidth
            autoFocus
            placeholder="Tìm kiếm chức năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              "&:before, &:after": { display: "none" },
              "& .MuiInput-input": {
                py: 1.5,
                fontSize: "1.1rem",
              },
            }}
          />

          <IconButton
            onClick={() => setShowDrawer(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {searchQuery && (
          <List sx={{ mt: 2, maxHeight: 400, overflow: "auto" }}>
            {searchResults.map((item, index) => (
              <ListItem
                key={index}
                component={Link}
                href={item.path ?? "#"}
                onClick={() => setShowDrawer(false)}
                sx={{
                  borderRadius: 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "text.secondary" }}>
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box>
                      {item.parent && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", lineHeight: 1.2 }}
                        >
                          {item.parent}
                        </Typography>
                      )}
                      <Typography component="span">{item.name}</Typography>
                    </Box>
                  }
                  primaryTypographyProps={{
                    sx: { fontWeight: 500, color: "text.primary" },
                  }}
                />
              </ListItem>
            ))}

            {searchQuery && searchResults.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                Không tìm thấy kết quả phù hợp
              </Typography>
            )}
          </List>
        )}
      </Drawer>
    </>
  );
}
