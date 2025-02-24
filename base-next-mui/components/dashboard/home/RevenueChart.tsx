'use client';

import { LineChart } from '@mui/x-charts/LineChart';
import { Box, useTheme } from '@mui/material';

const mockRevenueData = [
  { date: '2023-06-01', revenue: 65000 },
  { date: '2023-07-01', revenue: 72000 },
  { date: '2023-08-01', revenue: 68000 },
  { date: '2023-09-01', revenue: 80000 },
  { date: '2023-10-01', revenue: 85000 },
  { date: '2023-11-01', revenue: 92000 },
];

export default function RevenueChart() {
  const theme = useTheme();
  const xLabels = mockRevenueData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
  });
  const yValues = mockRevenueData.map(item => item.revenue);

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        xAxis={[{ 
          data: xLabels,
          scaleType: 'point',
          tickLabelStyle: {
            angle: 0,
            textAnchor: 'middle',
            fontSize: 12,
          },
        }]}
        yAxis={[{
          tickNumber: 5,
          tickLabelStyle: {
            fontSize: 12,
          },
        }]}
        series={[
          {
            data: yValues,
            area: true,
            color: theme.palette.primary.main,
            showMark: true,
          },
        ]}
        height={300}
        margin={{ top: 20, right: 35, bottom: 30, left: 65 }}
        sx={{
          '.MuiLineElement-root': {
            strokeWidth: 2,
          },
          '.MuiAreaElement-root': {
            fillOpacity: 0.2,
          },
        }}
      />
    </Box>
  );
}

