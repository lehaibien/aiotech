"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { BrandPerformanceReportResponse } from "@/types";
import { Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { BadgeCheck } from "lucide-react";

type BrandPerformanceCardGridProps = {
  highestBrand: BrandPerformanceReportResponse;
};

export const BrandPerformanceCardGrid = ({
  highestBrand,
}: BrandPerformanceCardGridProps) => {
  return (
    <SimpleGrid
      cols={{
        base: 1,
        md: 2,
        lg: 4,
      }}
    >
      <Card withBorder p="md" radius="md" key="highest-brand">
        <Group justify="space-between" c="dimmed">
          <Text size="sm" tt="uppercase" fw={600}>
            Thương hiệu bán chạy nhất
          </Text>
          <BadgeCheck size={22} />
        </Group>

        <Stack mt="sm" gap="xs">
          <Text lh={1} size="lg">
            {highestBrand.brandName}
          </Text>
          <Group>
            <Text fz="sm" fw={500}>
              Doanh thu:{" "}
              {formatNumberWithSeperator(highestBrand.totalRevenue) + "đ"}
            </Text>
            <Text fz="sm" fw={500}>
              Số lượng bán ra: {highestBrand.totalUnitsSold}
            </Text>
          </Group>
        </Stack>
      </Card>
    </SimpleGrid>
  );
};
