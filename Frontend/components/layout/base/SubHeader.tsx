"use client";

import { ComboBoxItem } from "@/types";
import { Group } from "@mantine/core";
import { Navigation } from "./Navigation";
import { CategoryMenu } from "./CategoryMenu";

type SubHeaderProps = {
  categories: ComboBoxItem[];
};

export const SubHeader = ({ categories }: SubHeaderProps) => {
  return (
    <Group
      display={{
        base: "none",
        md: "flex",
      }}
      justify="space-between"
      align="center"
    >
      <CategoryMenu categories={categories || []} />
      <Navigation />
    </Group>
  );
};
