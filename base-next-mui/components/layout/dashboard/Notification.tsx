"use client";

import { useSignalR } from "@/providers/SignalRProvider";
import { generateUUID } from "@/lib/utils";
import { NotificationItem } from "@/types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BellIcon from "@mui/icons-material/Notifications";
import {
  alpha,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Popover,
  Typography,
} from "@mui/material";
import { UUID } from "crypto";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface NotificationProps {
  showBadge: boolean;
}

export default function Notification({ showBadge }: NotificationProps) {
  const connection = useSignalR();
  const { enqueueSnackbar } = useSnackbar();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleNotificationClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (open) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
    setOpen(!open);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleViewNotification = (notificationId: UUID) => {
    // Mark notification as read
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === notificationId) {
        return { ...notification, isRead: !notification.isRead };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    const fakeNotifications: NotificationItem[] = [
      {
        id: generateUUID() as UUID,
        message:
          "Welcome to the dashboard!sdfdsfdsfdsfsdfhjklsdfhsdkhsdkjfhdsfkjsdf",
        isRead: false,
        // it should be a date in the past
        createdDate: new Date("2024-09-15"),
      },
      {
        id: generateUUID() as UUID,
        message: "You have 5 new messages",
        isRead: false,
        createdDate: new Date("2024-09-01"),
      },
      {
        id: generateUUID() as UUID,
        message: "You have 3 new tasks",
        isRead: false,
        createdDate: new Date("2024-08-27"),
      },
    ];
    setNotifications(fakeNotifications);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveNotification", (message) => {
        enqueueSnackbar(message, { variant: "info", preventDuplicate: false });
      });

      // Cleanup on unmount
      return () => {
        connection.off("ReceiveNotification");
      };
    }
  }, [connection, enqueueSnackbar]);

  return (
    <>
      <IconButton onClick={handleNotificationClick}>
        <Badge
          color="primary"
          badgeContent={notifications.filter((n) => !n.isRead).length}
          invisible={!showBadge}
          aria-label="Open notifications"
        >
          <BellIcon />
        </Badge>
      </IconButton>

      <Popover
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
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          height={48}
        >
          <Typography sx={{ pl: 2, fontWeight: "bold" }}>Thông báo</Typography>
          <Button
            variant="text"
            onClick={markAllAsRead}
            sx={{
              textTransform: "none",
              backgroundColor: "transparent",
            }}
          >
            <Typography sx={{ p: 2 }}>Đánh dấu tất cả là đã đọc</Typography>
          </Button>
        </Box>
        <List
          sx={{
            maxWidth: 450,
            padding: 0,
          }}
        >
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={(theme) => ({
                display: "flex",
                width: "100%",
                gap: theme.spacing(1),
                padding: theme.spacing(2),
                borderBottom: `2px solid ${theme.palette.divider}`,
                backgroundColor: notification.isRead
                  ? "transparent"
                  : alpha(theme.palette.primary.main, 0.1),
                transition: theme.transitions.create(["background"], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard,
                }),
              })}
            >
              <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                flexShrink={1}
                minWidth={0}
              >
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, // Ensures the text wraps to a maximum of 2 lines
                    overflow: "hidden", // Hides the overflow
                    textOverflow: "ellipsis",
                    lineHeight: 1.5, // Adjust line height to match your design
                    maxHeight: "3em", // Set maxHeight to 2 * lineHeight (1.5em * 2 = 3em)
                  }}
                >
                  {notification.message}
                </Typography>
                <Typography variant="caption">
                  {notification.createdDate.toLocaleDateString()} lúc{" "}
                  {notification.createdDate.toLocaleTimeString()}
                </Typography>
              </Box>
              <IconButton
                edge="end"
                onClick={() => handleViewNotification(notification.id)}
              >
                {notification.isRead ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
}
