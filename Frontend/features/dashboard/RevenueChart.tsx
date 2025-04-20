'use client';

import { formatDate } from '@/lib/utils';
import { DashboardSale } from '@/types';
import { Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

type RevenueChartProps = {
  data: DashboardSale[];
};

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const xLabels = data.map((item) => formatDate(item.date, 'MM/YYYY'));
  const yValues = data.map((item) => item.revenue);
  const minPrice = Math.min(...data.map((item) => item.revenue));
  const hasNonZeroValues = data.some((item) => item.revenue > 0);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <LineChart
        xAxis={[
          {
            data: xLabels,
            scaleType: 'point',
          },
        ]}
        yAxis={[
          {
            id: 'y-axis-revenue',
            label: 'Doanh thu (đ)',
            position: 'left',
            min: 0,
            tickMinStep: hasNonZeroValues ? Math.max(1, minPrice / 10) : 1,
            labelStyle: {
              transform: 'translate(30px, -190px)',
            },
          },
        ]}
        series={[
          {
            data: yValues,
            area: true,
            color: '#4caf50',
            showMark: true,
          },
        ]}
        height={400}
        sx={{
          '.MuiAreaElement-root': {
            fillOpacity: 0.2,
          },
        }}
      />
    </Box>
  );
};
