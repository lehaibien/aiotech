"use client";

import { Card, Group, Stack, Text } from "@mantine/core";

type SaleCardProps = {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export const SaleCard = ({ title, icon, children }: SaleCardProps) => {
  return (
    <Card h="100%" p="md">
      <Group gap="md">
        {icon}
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            {title}
          </Text>
          <Text size="xl" fw={500}>
            {children}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};
