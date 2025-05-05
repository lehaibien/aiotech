"use client";

import { dashboardNavItems } from "@/constant/routes";
import { DashboardNavItem } from "@/types/ui";
import { Box, NavLink, Collapse, ThemeIcon } from "@mantine/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

export const MenuContent = () => {
  const pathname = usePathname();
  const realPath = pathname ?? "/dashboard";
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const handleClick = (item: string) => {
    setOpen((prevOpen: Record<string, boolean>) => ({
      ...prevOpen,
      [item]: !prevOpen[item],
    }));
  };

  const renderNavItems = (navItems: DashboardNavItem[]) =>
    navItems.map((navItem) => (
      <Fragment key={navItem.title}>
        {navItem.items ? (
          <>
            <NavLink
              onClick={() => handleClick(navItem.title)}
              label={navItem.title}
              leftSection={
                <ThemeIcon variant="light" size="sm">
                  <navItem.icon size={16} />
                </ThemeIcon>
              }
              rightSection={
                open[navItem.title] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )
              }
            />
            <Collapse in={open[navItem.title]}>
              <Box pl="md">
                {navItem.items.map((item) => (
                  <NavLink
                    key={item.title}
                    component={Link}
                    href={item.href ?? "/dashboard"}
                    active={realPath === item.href}
                    label={item.title}
                    leftSection={
                      <ThemeIcon variant="light" size="sm">
                        <item.icon size={16} />
                      </ThemeIcon>
                    }
                  />
                ))}
              </Box>
            </Collapse>
          </>
        ) : (
          <NavLink
            component={Link}
            href={navItem.href ?? "/dashboard"}
            active={realPath === navItem.href}
            label={navItem.title}
            leftSection={
              <ThemeIcon variant="light" size="sm">
                <navItem.icon size={16} />
              </ThemeIcon>
            }
          />
        )}
      </Fragment>
    ));

  return (
    <Box style={{ overflowY: "auto" }}>{renderNavItems(dashboardNavItems)}</Box>
  );
};
