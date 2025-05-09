import { formatDate } from "@/lib/utils";
import { ReviewResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { ReviewDataTableAction } from "./ReviewDataTableAction";
import { ReviewRatingRenderer } from "./ReviewRatingRenderer";

export const reviewDataTableColumns: DataTableColumn<ReviewResponse>[] = [
  {
    accessor: "userName",
    title: "Tài khoản",
    width: 200,
  }
  ,
  {
    accessor: "productName",
    title: "Sản phẩm",
    width: 250,
  },
  {
    accessor: "rating",
    title: "Đánh giá",
    width: 200,
    render: ReviewRatingRenderer,
  },
  {
    accessor: "comment",
    title: "Bình luận",
    width: 250,
  },
  {
    accessor: "createdDate",
    title: "Thời gian thực hiện",
    width: 200,
    render: (record) => formatDate(record.createdDate),
  },
  {
    accessor: "action",
    title: "Hành động",
    width: 80,
    textAlign: "center",
    render: ReviewDataTableAction,
  },
];
