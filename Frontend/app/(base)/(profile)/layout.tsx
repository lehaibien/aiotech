"use client";

import { Box, Tabs } from "@mantine/core";
import { Info, Lock, ReceiptText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Tabs
        value={pathname.replace("/", "")}
        onChange={(value) => router.push(`/${value}`)}
      >
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<Info size={12} />}>
            Thông tin
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<Lock size={12} />}>
            Bảo mật
          </Tabs.Tab>
          <Tabs.Tab value="orders" leftSection={<ReceiptText size={12} />}>
            Lịch sử mua hàng
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Box p={8}>{children}</Box>
    </>
  );
}
