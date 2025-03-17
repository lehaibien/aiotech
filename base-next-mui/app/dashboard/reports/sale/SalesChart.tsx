"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { SaleReportResponse } from "@/types";
import { BarChart } from "@mui/x-charts";
import dayjs from '@/lib/extended-dayjs';
// Then create a React component to display the chart

interface SalesChartProps {
  data: SaleReportResponse[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const chartData = data
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  const minPrice = Math.min(...chartData.map((item) => item.revenue));
  const hasNonZeroValues = chartData.some(item => item.revenue > 0);
  return (
    <BarChart
      xAxis={[
        {
          id: "x-axis-date",
          dataKey: "date",
          scaleType: "band",
          data: chartData.map((item) => item.date),
          valueFormatter: (value: Date) =>
            dayjs(value).format("MM/YYYY"),
          label: "Tháng",
          position: "bottom",
        },
      ]}
      yAxis={[
        {
          id: "y-axis-revenue",
          label: 'Doanh thu (đ)',
          position: "left",
          scaleType: "linear",
          min: 0, // Always start from 0
          tickMinStep: hasNonZeroValues ? Math.max(1, minPrice / 10) : 1,
          valueFormatter: (value) =>
            formatNumberWithSeperator(value ?? 0) + " đ",
          labelStyle: {
            transform: 'translate(30px, -260px)',
            textAnchor: 'end'
          }
        },
      ]}
      series={[
        {
          dataKey: "revenue",
          label: "Doanh thu",
          yAxisKey: "y-axis-revenue",
          color: "#4caf50",
          valueFormatter: (value) =>
            formatNumberWithSeperator(value ?? 0) + " đ",
          highlightScope: { faded: 'global', highlighted: 'item' },
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
        margin={{ left: 100}}
        sx={{
          width: '100%',
          height: '100%',
          '& .MuiChartsAxis-label': {
            fontWeight: 'bold',
          },
          '& .MuiChartsLegend-root': {
            padding: 2,
          },
          '& .MuiBarElement-root:hover': {
            filter: 'brightness(0.9)',
          },
        }}
        title="Báo cáo doanh số"
        height={600}
        slotProps={{
          legend: {
            hidden: false,
            position: { vertical: 'top', horizontal: 'right' },
            padding: { top: 20, bottom: 20 },
          },
        }}
        tooltip={{
          trigger: "item",
          slotProps: {
            popper: {
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: 1,
                padding: 1,
              },
            },
          },
        }}
    />
  );
}
