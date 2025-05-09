"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { TopCustomerReportResponse } from "@/types/report";
import { ScatterChart } from "@mantine/charts";
import { Paper, Stack, Text, Title } from "@mantine/core";

const COLORS = ["#FF6B6B", "#FFA94D", "#FFD43B", "#69DB7C", "#4DABF7"];

type TopCustomerChartProps = {
  data: TopCustomerReportResponse[];
};

export function TopCustomerChart({ data }: TopCustomerChartProps) {
  const scatterData = data.map((customer, index) => ({
    color: COLORS[index % COLORS.length],
    name: customer.customerName,
    data: [
      {
        daysSinceLastPurchase: customer.daysSinceLastPurchase,
        totalSpent: customer.totalSpent,
      },
    ],
  }));
  return (
    <Stack gap="md">
      <Title order={3}>Hoạt động khách hàng và tổng chi</Title>
      <ScatterChart
        h={400}
        dataKey={{
          x: "daysSinceLastPurchase",
          y: "totalSpent",
        }}
        data={scatterData}
        xAxisLabel="Ngày kể từ lần mua cuối"
        yAxisLabel="Tổng chi"
        withLegend
        withTooltip
        tooltipProps={{
          content: ({ payload }) => <ChartTooltip payload={payload} />,
        }}
      />
    </Stack>
  );
}

interface ChartTooltipProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>[] | undefined;
}

function ChartTooltip({ payload }: ChartTooltipProps) {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((item: any) => (
        <Text key={item.name}>
          {/* {item.name}: {item.value} */}
          {item.name === "daysSinceLastPurchase" &&
            `Lần mua cuối: ${item.value} ngày trước`}
          {item.name === "totalSpent" &&
            `Tổng chi: ${formatNumberWithSeperator(item.value)}đ`}
        </Text>
      ))}
    </Paper>
  );
}
