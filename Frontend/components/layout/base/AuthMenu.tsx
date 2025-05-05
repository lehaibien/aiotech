"use client";

import { ActionIcon, Avatar, Popover, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AuthMenu = () => {
  const pathName = usePathname();
  const { data: session } = useSession();
  const [opened, { toggle, close }] = useDisclosure(false);
  return (
    <>
      {session?.user ? (
        <Popover opened={opened} onClose={close} onDismiss={close} withArrow>
          <Popover.Target>
            <Avatar
              size="sm"
              src={session.user.image ?? "/user-avatar.png"}
              alt={session.user.name ?? "user-avatar"}
              radius="xl"
              onClick={toggle}
              style={{
                cursor: "pointer",
              }}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <Stack>
              <Link href="/profile">Thông tin cá nhân</Link>
              {session.user.role.toLowerCase() === "admin" && (
                <Link href="/dashboard">Trang quản lý</Link>
              )}
              <Link href="/orders">Đơn hàng của tôi</Link>
              <Text
                style={{
                  cursor: "pointer",
                }}
                onClick={async () => signOut()}
              >
                Đăng xuất
              </Text>
              {/* <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem> */}
            </Stack>
          </Popover.Dropdown>
        </Popover>
      ) : (
        <ActionIcon
          variant="transparent"
          component={Link}
          href={`/login?redirect=${pathName ?? "/"}`}
          aria-label="Đăng nhập"
        >
          <User size={20}/>
        </ActionIcon>
      )}
    </>
  );
};
