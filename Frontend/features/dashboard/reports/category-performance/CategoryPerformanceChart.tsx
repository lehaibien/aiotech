"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { CategoryPerformanceReportResponse } from "@/types";
import { BarChart } from "@mantine/charts";

type CategoryPerformanceChartProps = {
  data: CategoryPerformanceReportResponse[];
};

export const CategoryPerformanceChart = ({ data }: CategoryPerformanceChartProps) => {
  return (
    <BarChart
      data={data}
      dataKey="categoryName"
      h={350}
      series={[
        {
          name: "totalRevenue",
          label: "Doanh thu",
          color: "#4caf50",
        },
        {
          name: "totalUnitsSold",
          label: "Số lượng bán ra",
          color: "#2196f3",
        },
      ]}
      yAxisProps={{
        label: "Doanh thu (đ)",
      }}
      xAxisProps={{
        label: "Thương hiệu",
      }}
      valueFormatter={(value) =>
        value < 10000
          ? value.toString()
          : formatNumberWithSeperator(value) + "đ"
      }
      withLegend
    />
  );
};
