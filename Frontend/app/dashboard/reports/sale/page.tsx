import NavBreadcrumbs from '@/components/core/NavBreadcrumbs';
import { API_URL } from '@/constant/apiUrl';
import { getApiQuery } from '@/lib/apiClient';
import dayjs from '@/lib/extended-dayjs';
import { formatNumberWithSeperator } from '@/lib/utils';
import { SaleReportRequest, SaleReportResponse } from '@/types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  Typography,
} from '@mui/material';
import 'server-only';
import { SaleCard } from './SaleCard';
import SaleReportFilter from './SaleReportFilter';
import SalesChart from './SalesChart';

const breadcrums = [
  {
    label: '',
    href: 'dashboard',
  },
  {
    label: 'Báo cáo doanh thu',
    href: 'sale',
  },
];

export default async function SaleReportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const startDate = searchParams?.start_date
    ? dayjs.utc(searchParams?.start_date)
    : dayjs.utc().startOf('year');
  const endDate = searchParams?.end_date
    ? dayjs(searchParams?.end_date)
    : dayjs.utc().endOf('year').subtract(1, 'day');
  const request: SaleReportRequest = {
    startDate: startDate.startOf('month').toJSON(),
    endDate: endDate.endOf('month').toJSON(),
  };
  let chartData: SaleReportResponse[] = [];
  const response = await getApiQuery(API_URL.saleReport, request);
  if (response.success) {
    chartData = response.data as SaleReportResponse[];
  } else {
    console.error(response.message);
  }

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
    <Stack spacing={3}>
      <NavBreadcrumbs items={breadcrums} />
      <Typography
        variant='h4'
        gutterBottom>
        Báo cáo doanh thu
      </Typography>
      <Typography
        color='text.secondary'
        gutterBottom>
        {dayjs(startDate).format('MM/YYYY')} {' - '}
        {dayjs(endDate).format('MM/YYYY')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
        <SaleReportFilter
          defaultStartDate={startDate}
          defaultEndDate={endDate}
        />
      </Box>

      <Grid
        container
        spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SaleCard
            title='Tổng doanh thu'
            icon={
              <TrendingUpIcon
                color='success'
                fontSize='large'
              />
            }>
            {formatNumberWithSeperator(total)} đ
          </SaleCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SaleCard
            title='Tổng đơn hàng'
            icon={
              <ShoppingCartIcon
                color='primary'
                fontSize='large'
              />
            }>
            {totalOrders} đơn
          </SaleCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SaleCard
            title='Giá trị trung bình/đơn hàng'
            icon={
              <AttachMoneyIcon
                color='success'
                fontSize='large'
              />
            }>
            {formatNumberWithSeperator(averageOrderValue)} đ
          </SaleCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SaleCard
            title='Tổng đơn hàng hoàn thành'
            icon={
              <CheckCircleIcon
                color='success'
                fontSize='large'
              />
            }>
            {totalCompletedOrders} đơn
          </SaleCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SaleCard
            title='Tổng đơn hàng đang xử lý'
            icon={
              <PendingIcon
                color='warning'
                fontSize='large'
              />
            }>
            {totalOrders - totalCompletedOrders - totalCancelledOrders} đơn
          </SaleCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SaleCard
            title='Tổng đơn hàng đã hủy'
            icon={
              <CancelIcon
                color='error'
                fontSize='large'
              />
            }>
            {totalCancelledOrders} đơn
          </SaleCard>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography
                variant='h6'
                gutterBottom>
                Biểu đồ doanh thu theo thời gian
              </Typography>
              <SalesChart data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
