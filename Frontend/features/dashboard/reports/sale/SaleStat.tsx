'use client';

import { SaleCard } from '@/features/dashboard/reports/sale/SaleCard';
import SalesChart from '@/features/dashboard/reports/sale/SalesChart';
import { formatNumberWithSeperator } from '@/lib/utils';
import { SaleReportResponse } from '@/types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Grid, Typography } from '@mui/material';

type SaleStatProps = {
  total: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCompletedOrders: number;
  totalCancelledOrders: number;
  chartData: SaleReportResponse[];
};

export const SaleStat = ({
  total,
  totalOrders,
  averageOrderValue,
  totalCompletedOrders,
  totalCancelledOrders,
  chartData,
}: SaleStatProps) => {
  return (
    <Grid
      container
      spacing={2}>
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
        <Typography
          variant='h6'
          gutterBottom>
          Biểu đồ doanh thu theo thời gian
        </Typography>
        <SalesChart data={chartData} />
      </Grid>
    </Grid>
  );
};
