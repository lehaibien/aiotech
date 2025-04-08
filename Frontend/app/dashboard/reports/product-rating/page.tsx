import NavBreadcrumbs from "@/components/core/NavBreadcrumbs";
import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { ProductRatingReportResponse } from "@/types";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { ProductRatingGrid } from "./ProductRatingGrid";
import { RatingDistributionChart } from "./RatingDistributionChart";

const breadcrums = [
  {
    label: "",
    href: "dashboard",
  },
  {
    label: "Thống kê đánh giá sản phẩm",
    href: "product-rating",
  },
];

export default async function ProductRatingPage() {
  let data: ProductRatingReportResponse[] = [];
  const response = await getApi(API_URL.productRatingReport);
  if (response.success) {
    data = response.data as ProductRatingReportResponse[];
  } else {
    console.error("Error fetching product rating data:", response.message);
  }
  const chartData = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  data
    .map((item) => item.ratingDistribution)
    .forEach((item) => {
      chartData["1"] += item["1"];
      chartData["2"] += item["2"];
      chartData["3"] += item["3"];
      chartData["4"] += item["4"];
      chartData["5"] += item["5"];
    });

  return (
    <Box>
      <NavBreadcrumbs items={breadcrums} />
      <Typography variant="h4" gutterBottom>
        Thống kê đánh giá sản phẩm
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Biểu đồ phân phối đánh giá sản phẩm
          </Typography>
          <Box sx={{ height: 500, width: "100%" }}>
            <RatingDistributionChart data={chartData} />
          </Box>
          <Typography variant="h6" gutterBottom>
            Chi tiết đánh giá sản phẩm
          </Typography>
          <Box sx={{ height: 650, width: "100%" }}>
            <ProductRatingGrid data={data} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
