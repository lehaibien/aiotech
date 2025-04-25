import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { ProductRatingReportResponse } from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import { ProductRatingGrid } from "./ProductRatingGrid";
import { RatingDistributionChart } from "./RatingDistributionChart";

/**
 * Retrieves product rating report data from the API.
 *
 * @returns An array of product rating report responses, or an empty array if the fetch fails.
 */
async function fetchProductRatingData() {
  const response = await getApi(API_URL.productRatingReport);
  if (response.success) {
    return response.data as ProductRatingReportResponse[];
  } else {
    console.error("Error fetching product rating data:", response.message);
    return [];
  }
}

/**
 * Server component that displays product rating statistics and details.
 *
 * Fetches product rating data, aggregates rating distributions, and renders a chart and grid summarizing product ratings.
 */
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
    <Stack spacing={2}>
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
