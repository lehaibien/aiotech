"use client";

import { SaleCard } from "@/features/dashboard/reports/sale/SaleCard";
import { formatNumberWithSeperator } from "@/lib/utils";
import { SaleReportResponse } from "@/types";
import { Grid, Title } from "@mantine/core";
import { ArrowUpRight, Ban, CircleCheck, DollarSign, Clock, ShoppingCart } from "lucide-react";
import { SaleChart } from "./SaleChart";

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
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <SaleCard
          title="Tổng doanh thu"
          icon={<ArrowUpRight size={24} color="green" />}
        >
          {formatNumberWithSeperator(total)} đ
        </SaleCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <SaleCard
          title="Tổng đơn hàng"
          icon={<ShoppingCart size={24} color="blue" />}
        >
          {totalOrders} đơn
        </SaleCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <SaleCard
          title="Giá trị trung bình/đơn hàng"
          icon={<DollarSign size={24} color="green" />}
        >
          {formatNumberWithSeperator(averageOrderValue)} đ
        </SaleCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <SaleCard
          title="Tổng đơn hàng hoàn thành"
          icon={<CircleCheck size={24} color="green" />}
        >
          {totalCompletedOrders} đơn
        </SaleCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <SaleCard
          title="Tổng đơn hàng đang xử lý"
          icon={<Clock size={24} color="orange" />}
        >
          {totalOrders - totalCompletedOrders - totalCancelledOrders} đơn
        </SaleCard>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <SaleCard
          title="Tổng đơn hàng đã hủy"
          icon={<Ban size={24} color="red" />}
        >
          {totalCancelledOrders} đơn
        </SaleCard>
      </Grid.Col>

      <Grid.Col span={12}>
        <Title order={3} mb="md">
          Biểu đồ doanh thu theo thời gian
        </Title>
        <SaleChart data={chartData} />
      </Grid.Col>
    </Grid>
  );
};
