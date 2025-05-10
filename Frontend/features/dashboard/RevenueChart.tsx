"use client";

import { formatDate, formatNumberWithSeperator } from "@/lib/utils";
import { DashboardSale } from "@/types";
import { LineChart } from "@mantine/charts";

type RevenueChartProps = {
  data: DashboardSale[];
};

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartData = data.map((item) => ({
    date: formatDate(item.date, "MM/YYYY"),
    revenue: item.revenue,
  }));
  const validData = chartData.filter((item) => item.revenue > 0);
  const averageRevenue =
    validData.length > 0
      ? validData.reduce((acc, item) => acc + item.revenue, 0) /
        validData.length
      : 0;
  return (
    <LineChart
      h={400}
      data={chartData}
      dataKey="date"
      series={[
        {
          name: "revenue",
          label: "Doanh thu",
          color: "#4caf50",
        },
      ]}
      curveType="monotone"
      withDots
      withLegend
      withTooltip
      unit=" đ"
      valueFormatter={(value) => formatNumberWithSeperator(value)}
      yAxisProps={{
        label: "Doanh thu (đ)",
      }}
      xAxisProps={{
        label: "Tháng",
      }}
      connectNulls
      referenceLines={
        averageRevenue > 0
          ? [
              {
                y: averageRevenue,
                color: "red.5",
                label: "Doanh thu trung bình",
                labelPosition: "insideTopRight",
              },
            ]
          : []
      }
    />
  );
};
