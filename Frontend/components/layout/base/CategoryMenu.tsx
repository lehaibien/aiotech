import { ComboBoxItem } from "@/types";
import { Button, NavLink, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChevronRight, List } from "lucide-react";
import Link from "next/link";

type CategoryMenuProps = {
  categories: ComboBoxItem[];
};

export const CategoryMenu = ({ categories }: CategoryMenuProps) => {
  const [opened, { open, close, toggle }] = useDisclosure();
  return (
    <Popover
      width="target"
      offset={0}
      opened={opened}
      onOpen={open}
      onClose={close}
      onDismiss={close}
    >
      <Popover.Target>
        <Button
          size="xs"
          variant="transparent"
          color="var(--mantine-color-text)"
          leftSection={<List />}
          rightSection={
            <ChevronRight
              style={{
                transition: "transform 0.2s ease-in-out",
                transform: opened ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          }
          onClick={toggle}
          tt="uppercase"
        >
          Danh mục sản phẩm
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        style={{
          maxHeight: 500,
          overflowY: "auto",
        }}
      >
        {categories.map((category) => (
          <NavLink
            component={Link}
            href={`/products?category=${category.text}`}
            onClick={close}
            label={category.text}
            key={category.value}
          />
        ))}
      </Popover.Dropdown>
    </Popover>
  );
};
