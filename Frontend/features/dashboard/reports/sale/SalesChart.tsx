'use client';

import dayjs from '@/lib/extended-dayjs';
import { formatNumberWithSeperator } from '@/lib/utils';
import { SaleReportResponse } from '@/types';
import { LineChart } from '@mui/x-charts';

interface SalesChartProps {
  data: SaleReportResponse[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const chartData = data.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  const minPrice = Math.min(...chartData.map((item) => item.revenue));
  const hasNonZeroValues = chartData.some((item) => item.revenue > 0);

  return (
    <LineChart
      xAxis={[
        {
          id: 'x-axis-date',
          dataKey: 'date',
          scaleType: 'band',
          data: chartData.map((item) => item.date),
          valueFormatter: (value: Date) => dayjs(value).format('MM/YYYY'),
          label: 'Tháng',
        },
      ]}
      yAxis={[
        {
          id: 'y-axis-revenue',
          label: 'Doanh thu (đ)',
          min: 0,
          tickMinStep: hasNonZeroValues ? Math.max(1, minPrice / 10) : 1,
          valueFormatter: (value: number) =>
            formatNumberWithSeperator(value ?? 0) + ' đ',
          labelStyle: {
            transform: 'translate(30px, -280px)',
          },
        },
      ]}
      series={[
        {
          dataKey: 'revenue',
          label: 'Doanh thu',
          color: '#4caf50',
          valueFormatter: (value) =>
            formatNumberWithSeperator(value ?? 0) + ' đ',
          showMark: true,
          area: true,
        },
      ]}
      dataset={chartData}
      sx={{
        '.MuiAreaElement-root': {
          fillOpacity: 0.2,
        },
      }}
      height={600}
    />
  );
}
