import { ProductRatingReportResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";

export const productRatingReportColumns: DataTableColumn<ProductRatingReportResponse>[] =
  [
    {
      accessor: "productName",
      title: "Tên sản phẩm",
      sortable: true,
      width: 200,
    },
    {
      accessor: "averageRating",
      title: "Đánh giá trung bình",
      sortable: true,
      width: 200,
      render: (record) => record.averageRating.toFixed(2),
    },
    {
      accessor: "reviewCount",
      title: "Số lượng đánh giá",
      sortable: true,
      width: 200,
    },
    {
      accessor: "positiveSentimentPercentage",
      title: "Đánh giá tích cực (%)",
      sortable: true,
      width: 200,
      render: (record) => record.positiveSentimentPercentage.toFixed(2),
    },
    {
      accessor: "negativeSentimentPercentage",
      title: "Đánh giá tiêu cực (%)",
      sortable: true,
      width: 200,
      render: (record) => record.negativeSentimentPercentage.toFixed(2),
    },
  ];
