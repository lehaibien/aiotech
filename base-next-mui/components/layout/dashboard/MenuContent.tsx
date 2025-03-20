"use client";

import { DashboardMenu, dashboardMenus } from "@/constant/dashboardMenu";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Collapse, useTheme } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

export default function MenuContent() {
  const pathname = usePathname();
  const realPath = pathname ?? "/dashboard";
  const theme = useTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const handleClick = (item: string) => {
    setOpen((prevOpen: Record<string, boolean>) => ({
      ...prevOpen,
      [item]: !prevOpen[item],
    }));
  };

  const getParentBackgroundColor = (item: DashboardMenu) => {
    if (item.children === undefined && realPath === item.path) {
      return theme.palette.action.selected;
    }
    if (
      item.children?.map((x) => x.path).includes(realPath) &&
      !open[item.name]
    ) {
      return theme.palette.action.selected;
    }
    return "transparent";
  };
  const renderNavItems = (items: DashboardMenu[]) => (
    <List>
      {items.map((item) => (
        <Fragment key={item.name}>
          <ListItem
            disablePadding
            sx={{
              backgroundColor: getParentBackgroundColor(item),
            }}
          >
            {item.children ? (
              <ListItemButton onClick={() => handleClick(item.name)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
                {open[item.name] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            ) : (
              <ListItemButton
                component={Link}
                href={item.path ?? "/dashboard"}
                selected={realPath === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            )}
          </ListItem>
          {item.children && (
            <Collapse
              in={open[item.name]}
              timeout="auto"
              unmountOnExit
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <List component="div" disablePadding>
                {item.children.map((child) => (
                  <ListItem
                    disablePadding
                    key={child.name}
                    sx={{
                      backgroundColor:
                        realPath === child.path
                          ? theme.palette.action.selected
                          : "transparent",
                      paddingLeft: 2,
                    }}
                  >
                    <ListItemButton
                      component={Link}
                      href={child.path ?? "/dashboard"}
                    >
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
        </Fragment>
      ))}
    </List>
  );
  return (
    <Box
      sx={{
        overflowY: "auto",
      }}
    >
      {renderNavItems(dashboardMenus)}
    </Box>
  );
}
