"use client";

import { TopCustomerReportResponse } from "@/types/report";
import { Box, Card, Typography } from "@mui/material";
import { ScatterChart } from "@mui/x-charts/ScatterChart";

type TopCustomerChartProps = {
  data: TopCustomerReportResponse[];
};

export default function TopCustomerChart({ data }: TopCustomerChartProps) {
  const scatterData = data.map((customer) => ({
    x: customer.daysSinceLastPurchase,
    y: customer.totalSpent,
    z: customer.customerName,
    id: customer.customerId,
  }));

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Hoạt động khách hàng và tổng chi
      </Typography>
      <Box sx={{ width: "100%", height: 400 }}>
        <ScatterChart
          xAxis={[
            {
              label: "Ngày kể từ lần mua cuối",
              min: 0,
              max: Math.max(...scatterData.map((item) => item.x)) + 1,
              tickMinStep: 1,
              tickMaxStep: 7,
            },
          ]}
          yAxis={[
            {
              label: "Tổng chi",
              labelStyle: {
                transform: "translate(30px, -165px)",
              },
            },
          ]}
          series={[
            {
              data: scatterData,
              label: "Khách hàng",
              valueFormatter: (value) => `(${value?.z}, ${value?.y} VNĐ)`,
            },
          ]}
          grid={{ vertical: true, horizontal: true }}
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Card>
  );
}
