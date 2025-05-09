"use client";

import { PieChart } from "@mantine/charts";
import { Group, Stack, Text } from "@mantine/core";

const COLORS = ["#FF6B6B", "#FFA94D", "#FFD43B", "#69DB7C", "#4DABF7"];

export const RatingDistributionChart = ({
  data,
}: {
  data: { [key: string]: number };
}) => {
  const chartData = Object.entries(data).map(([rating, count]) => ({
    name: `${rating} sao`,
    value: count,
    color: COLORS[parseInt(rating) - 1] || "#FFD43B",
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <PieChart
        data={chartData}
        withLabels
        withTooltip
        labelsType="percent"
        size={200}
        tooltipDataSource="segment"
        strokeWidth={2}
        w={400}
        h={400}
        mx="auto"
      />
      <Stack gap='sm'>
        {chartData.map((item) => (
          <Group key={item.name} gap='sm'>
            <div style={{ width: '16px', height: '16px', backgroundColor: item.color, borderRadius: 'var(--mantine-radius-sm)' }} />
            <Text>{item.name}</Text>
          </Group>
        ))}
      </Stack>
    </div>
  );
};
