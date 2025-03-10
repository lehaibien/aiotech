"use client";

import { DashboardMenu, dashboardMenus } from "@/constant/dashboardMenu";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Collapse, useTheme } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";

export default function MenuContent() {
  const pathname = usePathname();
  const realPath = pathname ?? "/dashboard";
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const handleClick = (item: string) => {
    setOpen((prevOpen: Record<string, boolean>) => ({
      ...prevOpen,
      [item]: !prevOpen[item],
    }));
  };

  const handleNavigation = (name: string, path?: string) => {
    setOpen((prevOpen: Record<string, boolean>) => ({
      ...prevOpen,
      [name]: false,
    }));
    router.push(path ?? "/dashboard");
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
            <ListItemButton
              onClick={() =>
                item.children
                  ? handleClick(item.name)
                  : handleNavigation(item.name, item.path)
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
              {item.children &&
                (open[item.name] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
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
                      onClick={() => handleNavigation(child.name, child.path)}
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
  return <Box sx={{
    overflowY: "auto",
  }}>{renderNavItems(dashboardMenus)}</Box>;
}
