import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface AccountSectionProps {
  showText?: boolean;
}

export default function AccountSection({
  showText = true,
}: AccountSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();
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
  const handleNavigation = (path: string) => {
    router.push(path);
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
        <Avatar sizes="small" sx={{ width: 36, height: 36 }}>
          <Image
            alt={session?.user.name ?? "user-avatar"}
            src={"/user-avatar.png"}
            width={36}
            height={36}
          />
        </Avatar>
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
        <MenuItem onClick={() => handleNavigation("/logout")}>
          Đăng xuất
        </MenuItem>
      </Menu>
    </Stack>
  );
}
