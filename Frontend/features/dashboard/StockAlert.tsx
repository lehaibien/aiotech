import { StockAlert } from "@/types";
import { Group, Stack, Text } from "@mantine/core";
import Image from "next/image";

type StockAlertSectionProps = {
  data: StockAlert[];
};

export function StockAlertSection({ data }: StockAlertSectionProps) {
  return (
    <Stack h="100%">
      {data.map((alert) => (
        <Group key={alert.productId} wrap="nowrap">
          <Image
            src={alert.productImage}
            alt={alert.productName}
            width={100}
            height={100}
            objectFit="fill"
          />
          <div>
            <Text size="sm">{alert.productName}</Text>
            <Text size="sm" c="red">
              Số lượng còn lại: {alert.stock}
            </Text>
          </div>
        </Group>
      ))}
    </Stack>
  );
}
