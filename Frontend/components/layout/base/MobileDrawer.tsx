"use client";

import { baseNavItems } from "@/constant/routes";
import { ComboBoxItem } from "@/types";
import {
  Burger,
  Collapse,
  Drawer,
  Flex,
  NavLink,
  Stack
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type MobileDrawerProps = {
  categories: ComboBoxItem[];
};

export const MobileDrawer = ({ categories }: MobileDrawerProps) => {
  const [opened, { close, toggle }] = useDisclosure(false);
  return (
    <Flex
      display={{
        xs: "flex",
        md: "none",
      }}
    >
      <Burger
        size="sm"
        opened={opened}
        onClick={toggle}
        aria-label="Toggle navigation"
      />

      <Drawer opened={opened} onClose={close} size="md" withCloseButton>
        <MobileNavigation categories={categories} onClose={close} />
      </Drawer>
    </Flex>
  );
};

const MobileNavigation = ({
  categories,
  onClose,
}: {
  categories: ComboBoxItem[];
  onClose: () => void;
}) => {
  const pathName = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack>
      {baseNavItems.map((nav, index) => (
        <React.Fragment key={nav.title}>
          <NavLink
            component={Link}
            href={nav.href ?? "/"}
            label={nav.title}
            active={pathName === nav.href}
            onClick={onClose}
          />
          {index === 0 && (
            <>
              <NavLink
                label="Danh mục sản phẩm"
                rightSection={
                  expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                }
                onClick={() => setExpanded((prev) => !prev)}
              />
              <Collapse in={expanded}>
                <NavLink
                  component={Link}
                  href="/products"
                  label="Tất cả sản phẩm"
                  active={
                    pathName === "/products" && !pathName.includes("category=")
                  }
                  onClick={onClose}
                />
                {categories.map((category: ComboBoxItem) => (
                  <NavLink
                    key={category.value}
                    component={Link}
                    href={`/products?category=${category.text}`}
                    label={category.text}
                    active={pathName === `/products?category=${category.text}`}
                    onClick={onClose}
                  />
                ))}
              </Collapse>
            </>
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
};
