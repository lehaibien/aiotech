import { API_URL } from '@/constant/apiUrl';
import TopCustomerChart from '@/features/dashboard/reports/top-customer/TopCustomerChart';
import TopCustomerFilter from '@/features/dashboard/reports/top-customer/TopCustomerFilter';
import TopCustomerGrid from '@/features/dashboard/reports/top-customer/TopCustomerGrid';
import { getApiQuery } from '@/lib/apiClient';
import dayjs from '@/lib/extended-dayjs';
import { TopCustomerReportRequest, TopCustomerReportResponse } from '@/types';
import { Stack, Typography } from '@mui/material';

async function getTopCustomerData(request: TopCustomerReportRequest) {
  const response = await getApiQuery(API_URL.topCustomerReport, request);
  if (!response.success) {
    return [];
  }
  return response.data as TopCustomerReportResponse[];
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const startDate = searchParams?.start_date
    ? dayjs.utc(searchParams?.start_date)
    : dayjs.utc().startOf('year').add(1, 'day');
  const endDate = searchParams?.end_date
    ? dayjs.utc(searchParams?.end_date)
    : dayjs.utc().endOf('year').subtract(1, 'day');
  const count = searchParams?.count ? Number(searchParams?.count) : 10;
  const request: TopCustomerReportRequest = {
    startDate: startDate.startOf('month').toJSON(),
    endDate: endDate.endOf('month').toJSON(),
    count: count,
  };
  const data = await getTopCustomerData(request);

  return (
    <Stack spacing={3}>
      <Typography
        variant='h4'
        component='h1'>
        Báo cáo khách hàng mua hàng nhiều nhất
      </Typography>

      <TopCustomerFilter
        defaultStartDate={startDate.toDate()}
        defaultEndDate={endDate.toDate()}
      />
      <TopCustomerChart data={data} />
      <TopCustomerGrid data={data} />
    </Stack>
  );
}
