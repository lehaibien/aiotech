"use client";

import { ComboBoxItem } from "@/types";
import { Grid, GridCol } from "@mantine/core";
import { CategoryMenu } from "./CategoryMenu";
import { Navigation } from "./Navigation";

type SubHeaderProps = {
  categories: ComboBoxItem[];
};

export const SubHeader = ({ categories }: SubHeaderProps) => {
  return (
    <Grid
      display={{
        base: "none",
        md: "flex",
      }}
      justify="space-between"
      align="center"
    >
      <GridCol span={2}>
        <CategoryMenu categories={categories || []} />
      </GridCol>
      <GridCol
        span={{
          base: 10,
          md: 6,
          lg: 5,
          xl: 4,
        }}
      >
        <Navigation />
      </GridCol>
    </Grid>
  );
};
