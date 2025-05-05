"use client";

import { BrandLogo } from "@/components/core/BrandLogo";
import { ColorSchemeSwitch } from "@/components/core/ColorSchemeSwitch";
import { AccountSection } from "@/components/layout/dashboard/AccountSection";
import { MenuContent } from "@/components/layout/dashboard/MenuContent";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          align="center"
          wrap="nowrap"
        >
          <Group wrap="nowrap">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <BrandLogo
              display={{
                base: "none",
                md: "inline-block",
              }}
            />
          </Group>
          <Group wrap="nowrap" gap='sm'>
            <ColorSchemeSwitch />
            <AccountSection />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <MenuContent />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
