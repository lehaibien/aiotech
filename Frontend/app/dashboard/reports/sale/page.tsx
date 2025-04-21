import { API_URL } from '@/constant/apiUrl';
import { SaleReportFilter } from '@/features/dashboard/reports/sale/SaleReportFilter';
import { SaleStat } from '@/features/dashboard/reports/sale/SaleStat';
import { getApiQuery } from '@/lib/apiClient';
import dayjs from '@/lib/extended-dayjs';
import { SaleReportRequest, SaleReportResponse, SearchParams } from '@/types';
import { Box, Stack, Typography } from '@mui/material';
import 'server-only';

async function getSaleData(request: SaleReportRequest) {
  const response = await getApiQuery(API_URL.saleReport, request);
  if (response.success) {
    return response.data as SaleReportResponse[];
  } else {
    console.error(response.message);
    return [];
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { start_date, end_date } = await searchParams;
  const startDate = start_date
    ? dayjs.utc(start_date)
    : dayjs.utc().startOf('year').add(1, 'day');
  const endDate = end_date
    ? dayjs.utc(end_date)
    : dayjs.utc().endOf('year').subtract(1, 'day');
  const request: SaleReportRequest = {
    startDate: startDate.startOf('month').toISOString(),
    endDate: endDate.endOf('month').toISOString(),
  };
  const chartData: SaleReportResponse[] = await getSaleData(request);

  const total = chartData
    .map((x) => x.revenue)
    .reduce((prev, curr) => prev + curr, 0);

  const totalOrders = chartData
    .map((x) => x.totalOrder)
    .reduce((prev, curr) => prev + curr, 0);

  const totalCompletedOrders = chartData
    .map((x) => x.completedOrder)
    .reduce((prev, curr) => prev + curr, 0);

  const totalCancelledOrders = chartData
    .map((x) => x.cancelledOrder)
    .reduce((prev, curr) => prev + curr, 0);

  const averageOrderValue = totalOrders > 0 ? total / totalOrders : 0;

  return (
    <Stack spacing={2}>
      <Typography variant='h4'>Báo cáo doanh thu</Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <SaleReportFilter
          defaultStartDate={startDate.toDate()}
          defaultEndDate={endDate.toDate()}
        />
      </Box>

      <SaleStat
        total={total}
        totalOrders={totalOrders}
        averageOrderValue={averageOrderValue}
        totalCompletedOrders={totalCompletedOrders}
        totalCancelledOrders={totalCancelledOrders}
        chartData={chartData}
      />
    </Stack>
  );
}
