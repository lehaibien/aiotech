import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { ProductRatingReportResponse } from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import { ProductRatingGrid } from "./ProductRatingGrid";
import { RatingDistributionChart } from "./RatingDistributionChart";

async function fetchProductRatingData() {
  const response = await getApi(API_URL.productRatingReport);
  if (response.success) {
    return response.data as ProductRatingReportResponse[];
  } else {
    console.error("Error fetching product rating data:", response.message);
    return [];
  }
}

export default async function ProductRatingPage() {
  const data = await fetchProductRatingData();
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
    <Stack>
      <Typography variant="h5">Thống kê đánh giá sản phẩm</Typography>

      <Box>
        <Typography variant="h6" gutterBottom>
          Biểu đồ phân phối đánh giá sản phẩm
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <RatingDistributionChart data={chartData} />
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Chi tiết đánh giá sản phẩm
        </Typography>
        <Box sx={{ height: 650, width: "100%" }}>
          <ProductRatingGrid data={data} />
        </Box>
      </Box>
    </Stack>
  );
}
