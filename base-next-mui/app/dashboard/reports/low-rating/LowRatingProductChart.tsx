"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { LowRatingProductReportResponse } from "@/types";
import { BarChart } from "@mui/x-charts";
// Then create a React component to display the chart

interface LowRatingProductChartProps {
  data: LowRatingProductReportResponse[];
}

export default function LowRatingProductChart({
  data,
}: LowRatingProductChartProps) {
  const chartData = data
    .map((item) => ({
      ...item,
      date: new Date(item.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const minChart = Math.min(...chartData.map((item) => item.productCount));
  const minValue = minChart < 1 ? 1 : minChart;
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
          tickMinStep: minValue,
          valueFormatter: (value) => formatNumberWithSeperator(value ?? 0),
        },
      ]}
      series={[
        {
          dataKey: "productCount",
          label: "Số lượng đơn hàng",
          yAxisKey: "y-axis-revenue", // Use the id of the yAxis
          color: "#009688",
          valueFormatter: (value) => formatNumberWithSeperator(value ?? 0),
        },
      ]}
      dataset={chartData}
      barLabel={(item) => {
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
