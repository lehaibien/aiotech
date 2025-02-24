"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { SaleReportResponse } from "@/types";
import { BarChart } from "@mui/x-charts";
// Then create a React component to display the chart

interface SalesChartProps {
  data: SaleReportResponse[];
}

export default function SalesChart({ data }: SalesChartProps) {
  // Convert date strings to JavaScript Date objects
  const chartData = data
    .map((item) => ({
      ...item,
      date: new Date(item.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const minPrice = Math.min(...chartData.map((item) => item.revenue));
  return (
    <BarChart
      xAxis={[
        {
          id: "x-axis-date",
          dataKey: "date",
          scaleType: "band",
          data: chartData.map((item) => item.date),
          valueFormatter: (value: Date) =>
            value.toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "numeric",
            }),
          position: "bottom",
        },
      ]}
      yAxis={[
        {
          id: "y-axis-revenue", // Add an id
          // label: 'Doanh thu (đ)',
          position: "left",
          scaleType: "linear",
          tickMinStep: minPrice / 10,
          valueFormatter: (value) =>
            formatNumberWithSeperator(value ?? 0) + " đ",
        },
      ]}
      series={[
        {
          dataKey: "revenue",
          label: "Doanh thu",
          yAxisKey: "y-axis-revenue", // Use the id of the yAxis
          color: "#4caf50",
          valueFormatter: (value) =>
            formatNumberWithSeperator(value ?? 0) + " đ",
        },
      ]}
      dataset={chartData}
      barLabel={(item) => {
        if (item.value && item.value < 1000) {
          return item.value.toString();
        }
        if (item.value == 0) {
          return "";
        }
        return formatNumberWithSeperator(item.value ?? 0);
      }}
      // sx={{
      //   width: '100%',
      // }}
      title="Báo cáo doanh số"
      height={600}
      tooltip={{ trigger: "item" }}
      margin={{ right: 120, left: 120 }}
    />
  );
}
