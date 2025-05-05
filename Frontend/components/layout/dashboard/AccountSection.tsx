"use client";

import { Avatar, Button, Popover, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const AccountSection = () => {
  const { data: session } = useSession();
  const [opened, { toggle, close }] = useDisclosure();
  const handleLogout = () => {
    signOut({
      redirectTo: "/login",
    });
  };
  return (
    <Popover opened={opened} onClose={close} onDismiss={close}>
      <Popover.Target>
        <Button
          variant="transparent"
          c='var(--mantine-color-text)'
          px={4}
          rightSection={
            <Avatar size="sm">
              <Image
                src={session?.user.image ?? "/user-avatar.png"}
                width={28}
                height={28}
                alt={session?.user.name ?? "user-avatar"}
              />
            </Avatar>
          }
          onClick={toggle}
        >
          <Text
            display={{
              base: "none",
              md: "inline-block",
            }}
          >
            {session?.user.name ?? "unknown"}
          </Text>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Link href="/profile">Thông tin cá nhân</Link>
          <Link href="/">Trang chủ</Link>
          <Link href="#" onClick={handleLogout}>
            Đăng xuất
          </Link>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
