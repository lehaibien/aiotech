import { ComboBoxItem } from "@/types";
import { Button, Popover, Stack } from "@mantine/core";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";
import { useState } from "react";

type CategoryMenuProps = {
  categories: ComboBoxItem[];
};

export const CategoryMenu = ({ categories }: CategoryMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Popover
      width="target"
      offset={0}
      opened={menuOpen}
      onOpen={() => setMenuOpen(true)}
      onClose={() => setMenuOpen(false)}
      onDismiss={() => setMenuOpen(false)}
    >
      <Popover.Target>
        <Button
          variant="transparent"
          color='var(--mantine-color-text)'
          px={0}
          leftSection={<GridViewOutlinedIcon />}
          rightSection={
            <KeyboardArrowRightIcon
              sx={{
                transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          }
          onClick={() => setMenuOpen(!menuOpen)}
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
        <Stack>
          {categories.map((category) => (
            <Button
              component={Link}
              href={`/products?category=${category.text}`}
              onClick={() => setMenuOpen(false)}
              variant="subtle"
              color="dark"
              key={category.value}
              mih={40}
            >
              {category.text}
            </Button>
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
