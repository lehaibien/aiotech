import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApiQuery } from "@/lib/apiClient";
import { formatNumberWithSeperator, parseUUID } from "@/lib/utils";
import {
  LowRatingProductReportRequest,
  LowRatingProductReportResponse,
} from "@/types";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "server-only";
import LowRatingProductReportFilter from "./LowRatingProductReportFilter";
import LowRatingProductChart from "./LowRatingProductChart";

dayjs.extend(utc);

export default async function LowRatingProductReportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const startDate = searchParams?.start_date
    ? dayjs.utc(searchParams?.start_date)
    : dayjs.utc().startOf("year");
  const endDate = searchParams?.end_date
    ? dayjs(searchParams?.end_date)
    : dayjs.utc().endOf("year");
  const brandId = searchParams?.brand_id
    ? parseUUID(searchParams?.brand_id)
    : undefined;
  const categoryId = searchParams?.category_id
    ? parseUUID(searchParams?.category_id)
    : undefined;
  const breadcrums = [
    {
      label: "",
      href: "dashboard",
    },
    {
      label: "Báo cáo sản phẩm",
      href: "sale",
    },
  ];
  const request: LowRatingProductReportRequest = {
    startDate: startDate.startOf("month").toJSON(),
    endDate: endDate.endOf("month").toJSON(),
    brandId,
    categoryId,
  };
  let chartData: LowRatingProductReportResponse[] = [];
  const response = await getApiQuery(API_URL.orderReport, request);
  if (response.success) {
    chartData = response.data as LowRatingProductReportResponse[];
  } else {
    console.error(response.message);
  }
  const total = chartData
    .map((x) => x.productCount)
    .reduce((prev, curr) => prev + curr, 0);
  return (
    <>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4">Báo cáo đơn hàng</Typography>
      <Typography gutterBottom>
        {dayjs(startDate).format("MM/YYYY")} {" - "}
        {dayjs(endDate).format("MM/YYYY")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <LowRatingProductReportFilter
          defaultStartDate={startDate.toDate()}
          defaultEndDate={endDate.toDate()}
        />
      </Box>
      <LowRatingProductChart data={chartData} />
      <Typography>
        Tổng số lượng đơn hàng: {formatNumberWithSeperator(total)} đ
      </Typography>
    </>
  );
}
