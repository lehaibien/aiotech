"use client";

import dayjs from "@/lib/extended-dayjs";
import { formatNumberWithSeperator } from "@/lib/utils";
import { SaleReportResponse } from "@/types";
import { alpha, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
// Then create a React component to display the chart

interface SalesChartProps {
  data: SaleReportResponse[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const theme = useTheme();
  const chartData = data.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  const minPrice = Math.min(...chartData.map((item) => item.revenue));
  const hasNonZeroValues = chartData.some((item) => item.revenue > 0);

  return (
    <LineChart
      xAxis={[
        {
          id: "x-axis-date",
          dataKey: "date",
          scaleType: "band",
          data: chartData.map((item) => item.date),
          valueFormatter: (value: Date) => dayjs(value).format("MM/YYYY"),
          label: "Tháng",
        },
      ]}
      yAxis={[
        {
          id: "y-axis-revenue",
          label: "Doanh thu (đ)",
          min: 0,
          tickMinStep: hasNonZeroValues ? Math.max(1, minPrice / 10) : 1,
          valueFormatter: (value) =>
            formatNumberWithSeperator(value ?? 0) + " đ",
        },
      ]}
      series={[
        {
          dataKey: "revenue",
          label: "Doanh thu",
          color: alpha(theme.palette.tertiary?.main ?? "#000", 0.7),
          valueFormatter: (value) =>
            formatNumberWithSeperator(value ?? 0) + " đ",
          showMark: true,
          area: true,
        },
      ]}
      dataset={chartData}
      margin={{ left: 100 }}
      sx={{
        width: "100%",
        height: "100%",
        "& .MuiChartsAxis-label": {
          fontWeight: "bold",
        },
        ".MuiLineElement-root": {
          strokeWidth: 2,
        },
        ".MuiAreaElement-root": {
          fillOpacity: 0.2,
        },
      }}
      height={600}
      slotProps={{
        legend: {
          position: { vertical: "top", horizontal: "right" },
        },
      }}
      tooltip={{
        trigger: "item",
        slotProps: {
          popper: {
            sx: {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: 1,
              padding: 1,
            },
          },
        },
      }}
    />
  );
}
