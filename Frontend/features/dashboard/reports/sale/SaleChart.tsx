"use client";

import dayjs from "@/lib/extended-dayjs";
import { formatNumberWithSeperator } from "@/lib/utils";
import { SaleReportResponse } from "@/types";
import { LineChart } from "@mantine/charts";

type SaleChartProps = {
  data: SaleReportResponse[];
};

export const SaleChart = ({ data }: SaleChartProps) => {
  const chartData = data.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  const validData = chartData.filter((item) => item.revenue > 0);
  const averageRevenue =
    validData.length > 0
      ? validData.reduce((acc, item) => acc + item.revenue, 0) /
        validData.length
      : 0;
  return (
    <LineChart
      h={600}
      data={chartData.map((item) => ({
        date: dayjs(item.date).format("MM/YYYY"),
        revenue: item.revenue,
      }))}
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
      unit=" đ"
      valueFormatter={(value) => formatNumberWithSeperator(value)}
      yAxisProps={{
        label: "Doanh thu (đ)",
      }}
      xAxisProps={{
        label: "Tháng",
      }}
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
      connectNulls
    />
  );
};
