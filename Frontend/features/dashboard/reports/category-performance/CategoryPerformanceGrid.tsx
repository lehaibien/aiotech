"use client";

import { formatNumberWithSeperator } from "@/lib/utils";
import { CategoryPerformanceReportResponse } from "@/types";
import { DataTableColumn } from "mantine-datatable";
import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { useState } from "react";

const columns: DataTableColumn<CategoryPerformanceReportResponse>[] = [
  {
    accessor: "categoryName",
    title: "Danh mục",
    width: 300,
  },
  {
    accessor: "productCount",
    title: "Số lượng sản phẩm",
    width: 250,
    render: (record) => formatNumberWithSeperator(record.productCount),
  },
  {
    accessor: "totalRevenue",
    title: "Doanh thu",
    width: 250,
    render: (record) => formatNumberWithSeperator(record.totalRevenue),
  },
  {
    accessor: "totalUnitsSold",
    title: "Số lượng bán ra",
    width: 200,
    render: (record) => formatNumberWithSeperator(record.totalUnitsSold),
  },
  {
    accessor: "averageRating",
    title: "Đánh giá trung bình",
    width: 200,
    render: (record) => record.averageRating.toFixed(1),
  },
];

type CategoryPerformanceGridProps = {
  data: CategoryPerformanceReportResponse[];
};

export const CategoryPerformanceGrid = ({ data }: CategoryPerformanceGridProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <MantineDataTable
      idAccessor='categoryId'
      columns={columns}
      data={data}
      totalRows={data.length}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      withColumnBorders
      withTableBorder
      highlightOnHover
      borderRadius="sm"
      height="100%"
    />
  );
};
