"use client";

import { Container, Stack, Text, Title } from "@mantine/core";
import { SvgIconComponent } from "@mui/icons-material";
import { LucideIcon } from "lucide-react";

type NoItemProps = {
  title?: string;
  description: string;
  icon?: SvgIconComponent | LucideIcon;
};

export const NoItem = ({
  title = "Không có dữ liệu",
  description,
  icon: Icon,
}: NoItemProps) => {
  return (
    <Container size="sm">
      <Stack
        justify="center"
        align="center"
        mih='60vh'
      >
        {Icon && <Icon />}
        <Title order={2}>
          {title}
        </Title>
        <Text c='dimmed'>
          {description}
        </Text>
      </Stack>
    </Container>
  );
};
