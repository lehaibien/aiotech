"use client";

import { PieChart } from "@mui/x-charts";

export function RatingDistributionChart({
  data,
}: {
  data: { [key: string]: number };
}) {
  const chartData = Object.entries(data).map(([rating, count]) => ({
    id: rating,
    value: count,
    label: `${rating} Sao`,
  }));

  return (
    <PieChart
      series={[
        {
          data: chartData,
          innerRadius: 30,
          paddingAngle: 2,
          cornerRadius: 4,
          highlightScope: { faded: "global", highlighted: "item" },
        },
      ]}
      height={400}
    />
  );
}
