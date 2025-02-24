"use client";

import { BaseNavigation } from "@/constant/baseMenu";
import { Box, Button, styled, Theme, useMediaQuery } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavButton = styled(Button)(({}) => ({
  color: "inherit",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export default function Navigation() {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const pathName = usePathname();
  const realPath = pathName ?? "/";
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {BaseNavigation.map((nav) => (
        <NavButton
          key={nav.name}
          startIcon={nav.icon}
          LinkComponent={Link}
          href={nav.path}
          sx={(theme) => ({
            backgroundColor:
              realPath === nav.path
                ? theme.palette.action.selected
                : "transparent",
            padding: theme.spacing(1, 2),
            fontSize: isMobile
              ? theme.typography.body1.fontSize
              : theme.typography.body2.fontSize,
            width: isMobile ? "100%" : "auto",
            justifyContent: "flex-start",
            "& > .MuiButton-startIcon": {
              marginRight: theme.spacing(2),
            },
            "& > .MuiButton-startIcon > svg": {
              fontSize: isMobile ? "1.5rem" : "1.25rem",
            },
          })}
        >
          {nav.name}
        </NavButton>
      ))}
    </Box>
  );
}
