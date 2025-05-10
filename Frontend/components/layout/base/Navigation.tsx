"use client";

import { baseNavItems } from "@/constant/routes";
import { Group, NavLink } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathName = usePathname();

  return (
    <Group wrap="nowrap">
      {baseNavItems.map((nav) => {
        const isActive = pathName === nav.href;
        return (
          <NavLink
            key={nav.title}
            label={nav.title}
            component={Link}
            href={nav.href ?? "/"}
            className={isActive ? "active" : ""}
            ta='center'
          />
        );
      })}
    </Group>
  );
};
