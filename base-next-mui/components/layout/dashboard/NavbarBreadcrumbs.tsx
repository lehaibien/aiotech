"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { capitalize } from "@mui/material";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const path = usePathname();
  const realPath = path ?? "/";
  const paths = realPath
    .split("/")
    .filter((p) => p !== "")
    .map((p) => capitalize(p));
  let actualPath = "";
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {paths.map((p, index) => {
        actualPath += `/${p.toLowerCase()}`; // Accumulate the path

        return index === paths.length - 1 ? (
          <Typography key={index} color="text.primary">
            {p}
          </Typography>
        ) : (
          <Link key={index} href={actualPath} className="font-semibold">
            {p}
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
