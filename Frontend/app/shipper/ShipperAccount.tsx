"use client";

import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

interface ShipperAccountProps {
  showText?: boolean;
}

export default function ShipperAccount({
  showText = true,
}: ShipperAccountProps) {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (open) {
      setOpen(false);
      setAnchorEl(null);
    } else {
      setOpen(true);
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  const handleLogout = () => {
    signOut({
      redirectTo: "/login",
    });
  };
  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        alignItems: "center",
      }}
    >
      <IconButton
        onClick={handleButtonClick}
        sx={{
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {showText && (
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {session?.user.name ?? "unknown"}
          </Typography>
        )}
        <Avatar
          sizes="small"
          alt={session?.user.name ?? "user-avatar"}
          src={session?.user.image ?? "/user-avatar.png"}
          sx={{ width: 36, height: 36 }}
        />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <Link href="/profile">Thông tin cá nhân</Link>
        </MenuItem>
        <MenuItem>
          <Link href="/">Trang chủ</Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </Stack>
  );
}
