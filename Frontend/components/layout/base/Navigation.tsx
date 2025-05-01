"use client";

import { baseNavItems } from "@/constant/routes";
import { Button, Flex } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathName = usePathname();

  return (
    <Flex gap={8} direction={{
      xs: "column",
      md: "row",
    }} align="center">
      {baseNavItems.map((nav) => {
        const isActive = pathName === nav.href;
        return (
          <Button
            key={nav.title}
            variant="subtle"
            color="dark"
            component={Link}
            href={nav.href ?? "/"}
            className={isActive? "active" : ""}
          >
            {nav.title}
          </Button>
        );
      })}
    </Flex>
  );
};
