"use client";

import { DashboardTopProduct } from "@/types";
import { Center, Group, Stack, Text } from "@mantine/core";
import Image from "next/image";

type TopSellingProps = {
  data: DashboardTopProduct[];
};

export function TopSelling({ data }: TopSellingProps) {
  if (data.length == 0) {
    return (
      <Center pos="absolute">
        <Text>Không có dữ liệu</Text>
      </Center>
    );
  }
  return (
    <Stack>
      {data.map((prd) => (
        <Group key={prd.id} wrap="nowrap">
          <Image
            src={prd.imageUrls[0]}
            alt={prd.name}
            width={100}
            height={100}
            objectFit="fill"
          />
          <div>
            <Text size="sm">{prd.name}</Text>
            <Text size="sm" c="red">
              Số lượng: {prd.sales}
            </Text>
          </div>
        </Group>
      ))}
    </Stack>
  );
}
