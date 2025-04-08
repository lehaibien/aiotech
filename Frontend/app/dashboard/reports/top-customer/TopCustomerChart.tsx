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
    id: customer.customerId,
    label: customer.customerName,
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
              tickMinStep: 1,
            },
          ]}
          yAxis={[
            {
              label: "Tổng chi",
              labelStyle: {
                transform: "translate(20px, -160px)",
                textAnchor: "end",
              },
            },
          ]}
          series={[
            {
              data: scatterData,
              label: "Khách hàng",
              valueFormatter: (value) => value.x.toString(),
            },
          ]}
          width={800}
          height={400}
          margin={{ left: 100 }}
        />
      </Box>
    </Card>
  );
}
