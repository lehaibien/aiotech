"use client";

import { BaseNavigation } from "@/constant/baseMenu";
import { Box, Button, styled } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: theme.transitions.create(["color", "transform"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: "transparent",
    transform: "translateY(-1px)",
  },
  "&.active": {
    color: theme.palette.primary.main,
    fontWeight: 600,
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 4,
      left: "50%",
      transform: "translateX(-50%)",
      width: "80%",
      height: 2,
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default function Navigation() {
  const pathName = usePathname();

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 0.5, sm: 1.5 },
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
            sx={{
              px: { xs: 1, sm: 1.5 },
              py: 0.5,
              minHeight: 40,
              "& .MuiButton-startIcon": {
                mr: 0.75,
                "& > svg": {
                  fontSize: "1.2rem",
                  transition: "fill 0.2s ease",
                },
              },
              fontSize: (theme) => theme.typography.body2.fontSize,
            }}
          >
            {nav.name}
          </NavButton>
        );
      })}
    </Box>
  );
}
