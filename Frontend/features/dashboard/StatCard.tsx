"use client";

import { Card, Group, Text } from "@mantine/core";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  diff: number;
  icon: LucideIcon;
};

export const StatCard = ({ title, value, diff, icon: Icon }: StatCardProps) => {
  const DiffIcon = diff > 0 ? TrendingUp : TrendingDown;
  return (
    <Card withBorder p="md" radius="md" key={title}>
      <Group justify="space-between" c="dimmed">
        <Text size="sm" tt="uppercase" fw={600}>
          {title}
        </Text>
        <Icon size={22} />
      </Group>

      <Group align="center" gap="xs" mt='lg'>
        <Text lh={1} size="md">
          {value}
        </Text>
        <Text
          c={diff === 0 ? "gray" : diff > 0 ? "green" : "red"}
          fz="sm"
          fw={500}
        >
          {diff === 0 ? (
            "-"
          ) : (
            <Group gap={2}>
              <span>{Math.abs(diff)}%</span>
              <DiffIcon size={16} />
            </Group>
          )}
        </Text>
      </Group>

      <Text fz="xs" c="dimmed" mt={7}>
        So với tháng trước
      </Text>
    </Card>
  );
};
