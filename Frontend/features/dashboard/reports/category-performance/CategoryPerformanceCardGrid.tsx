"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { CategoryPerformanceReportResponse } from "@/types";
import { Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { BadgeCheck } from "lucide-react";

type CategoryPerformanceCardGridProps = {
  highestCategory: CategoryPerformanceReportResponse;
};

export const CategoryPerformanceCardGrid = ({
  highestCategory,
}: CategoryPerformanceCardGridProps) => {
  return (
    <SimpleGrid
      cols={{
        base: 1,
        md: 2,
        lg: 4,
      }}
    >
      <Card withBorder p="md" radius="md" key="highest-category">
        <Group justify="space-between" c="dimmed">
          <Text size="sm" tt="uppercase" fw={600}>
            Thương hiệu bán chạy nhất
          </Text>
          <BadgeCheck size={22} />
        </Group>

        <Stack mt="sm" gap="xs">
          <Text lh={1} size="lg">
            {highestCategory.categoryName}
          </Text>
          <Group>
            <Text fz="sm" fw={500}>
              Doanh thu:{" "}
              {formatNumberWithSeperator(highestCategory.totalRevenue) + "đ"}
            </Text>
            <Text fz="sm" fw={500}>
              Số lượng bán ra: {highestCategory.totalUnitsSold}
            </Text>
          </Group>
        </Stack>
      </Card>
    </SimpleGrid>
  );
};
