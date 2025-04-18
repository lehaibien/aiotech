"use client";

import { BaseNavigation } from "@/constant/baseMenu";
import { Box, Button, styled } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavButton = styled(Button)(({ theme }) => ({
  transition: theme.transitions.create(["color"], {
    duration: theme.transitions.duration.short,
  }),
  "&.active": {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

export default function Navigation() {
  const pathName = usePathname();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {BaseNavigation.map((nav) => {
        const isActive = pathName === nav.path;
        return (
          <NavButton
            key={nav.name}
            LinkComponent={Link}
            href={nav.path}
            startIcon={nav.icon}
            className={isActive ? "active" : ""}
          >
            {nav.name}
          </NavButton>
        );
      })}
    </Box>
  );
}
