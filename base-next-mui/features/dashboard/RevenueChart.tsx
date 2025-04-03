"use client";

import { formatDate } from "@/lib/utils";
import { DashboardSale } from "@/types";
import { Box, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

type RevenueChartProps = {
  data: DashboardSale[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  const theme = useTheme();
  const xLabels = data.map((item) => formatDate(item.date, "MM/YYYY"));
  const yValues = data.map((item) => item.revenue);
  const minPrice = Math.min(...data.map((item) => item.revenue));
  const hasNonZeroValues = data.some((item) => item.revenue > 0);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <LineChart
        xAxis={[
          {
            data: xLabels,
            scaleType: "point",
            tickLabelStyle: {
              angle: 0,
              textAnchor: "middle",
              fontSize: 12,
            },
          },
        ]}
        yAxis={[
          {
            id: "y-axis-revenue",
            label: "Doanh thu (đ)",
            position: "left",
            min: 0,
            tickMinStep: hasNonZeroValues ? Math.max(1, minPrice / 10) : 1,
            tickLabelStyle: {
              fontSize: 12,
            },
            labelStyle: {
              transform: "translate(30px, -180px)",
              textAnchor: "end",
            },
          },
        ]}
        series={[
          {
            data: yValues,
            area: true,
            color: theme.palette.primary.main,
            showMark: true,
          },
        ]}
        height={400}
        margin={{ left: 100 }}
        sx={{
          ".MuiLineElement-root": {
            strokeWidth: 2,
          },
          ".MuiAreaElement-root": {
            fillOpacity: 0.2,
          },
        }}
      />
    </Box>
  );
}
