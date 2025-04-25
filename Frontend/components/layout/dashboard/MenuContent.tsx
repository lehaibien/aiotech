'use client';

import { dashboardNavItems } from '@/constant/routes';
import { DashboardNavItem } from '@/types/ui';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse, useTheme } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';

export default function MenuContent() {
  const pathname = usePathname();
  const realPath = pathname ?? '/dashboard';
  const theme = useTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const handleClick = (item: string) => {
    setOpen((prevOpen: Record<string, boolean>) => ({
      ...prevOpen,
      [item]: !prevOpen[item],
    }));
  };

  const getParentBackgroundColor = (item: DashboardNavItem) => {
    if (item.items === undefined && realPath === item.href) {
      return theme.palette.action.selected;
    }
    if (
      item.items?.map((x) => x.href).includes(realPath) &&
      !open[item.title]
    ) {
      return theme.palette.action.selected;
    }
    return 'transparent';
  };
  const renderNavItems = (navItems: DashboardNavItem[]) => (
    <List>
      {navItems.map((navItem) => (
        <Fragment key={navItem.title}>
          <ListItem
            disablePadding
            sx={{
              backgroundColor: getParentBackgroundColor(navItem),
            }}>
            {navItem.items ? (
              <ListItemButton onClick={() => handleClick(navItem.title)}>
                <ListItemIcon>
                  <navItem.icon></navItem.icon>
                </ListItemIcon>
                <ListItemText primary={navItem.title} />
                {open[navItem.title] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            ) : (
              <ListItemButton
                component={Link}
                href={navItem.href ?? '/dashboard'}
                selected={realPath === navItem.href}>
                <ListItemIcon>
                  <navItem.icon></navItem.icon>
                </ListItemIcon>
                <ListItemText primary={navItem.title} />
              </ListItemButton>
            )}
          </ListItem>
          {navItem.items && (
            <Collapse
              in={open[navItem.title]}
              timeout='auto'
              unmountOnExit
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}>
              <List
                component='div'
                disablePadding>
                {navItem.items.map((item) => (
                  <ListItem
                    disablePadding
                    key={item.title}
                    sx={{
                      backgroundColor:
                        realPath === item.href
                          ? theme.palette.action.selected
                          : 'transparent',
                      paddingLeft: 2,
                    }}>
                    <ListItemButton
                      component={Link}
                      href={item.href ?? '/dashboard'}>
                      <ListItemIcon>
                        <item.icon></item.icon>
                      </ListItemIcon>
                      <ListItemText primary={item.title} />
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
        overflowY: 'auto',
      }}>
      {renderNavItems(dashboardNavItems)}
    </Box>
  );
}
