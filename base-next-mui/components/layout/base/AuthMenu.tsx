"use client";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export function AuthMenu() {
  const pathName = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    signOut();
    router.push(pathName ?? "/");
  };
  return (
    <>
      {session?.user ? (
        <>
          <IconButton
            color="inherit"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              {session.user.name ?? "Nguoi Dung"}
            </Typography>
            <Avatar
              sizes="small"
              alt={session.user.name ?? "user-avatar"}
              src={session.user.image ?? "/user-avatar.png"}
              sx={{
                width: {
                  xs: 24,
                  md: 28,
                },
                height: {
                  xs: 24,
                  md: 28,
                },
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>
              <Link href="/profile">Thông tin cá nhân</Link>
            </MenuItem>
            {session.user.role.toLowerCase() === "admin" && (
              <MenuItem>
                <Link href="/dashboard">Dashboard</Link>
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </>
      ) : (
        <IconButton
          color="inherit"
          LinkComponent={Link}
          href={`/login?redirect=${pathName ?? "/"}`}
          aria-label="Đăng nhập"
        >
          <PersonOutlineOutlinedIcon />
        </IconButton>
      )}
    </>
  );
}
