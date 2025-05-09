"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import dayjs from "@/lib/extended-dayjs";
import { formatNumberWithSeperator } from "@/lib/utils";
import { TopCustomerReportResponse } from "@/types/report";
import { DataTableColumn } from "mantine-datatable";
import { useState } from "react";

const columns: DataTableColumn<TopCustomerReportResponse>[] = [
  {
    accessor: "customerName",
    title: "Khách hàng",
    width: 200,
  },
  {
    accessor: "orderCount",
    title: "Tổng số đơn",
    width: 150,
    render: (record) => formatNumberWithSeperator(record.orderCount),
  },
  {
    accessor: "totalSpent",
    title: "Tổng chi",
    width: 250,
    render: (record) => formatNumberWithSeperator(record.totalSpent),
  },
  {
    accessor: "averageOrderValue",
    title: "Trung bình mỗi đơn hàng",
    width: 250,
    render: (record) => formatNumberWithSeperator(record.averageOrderValue),
  },
  {
    accessor: "daysSinceLastPurchase",
    title: "Lần mua cuối",
    width: 220,
    render: (record) =>
      dayjs.utc().add(record.daysSinceLastPurchase, "day").format("DD/MM/YYYY"),
  },
  {
    accessor: "frequentlyPurchasedCategories",
    title: "Danh mục thường mua",
    width: 300,
    render: (record) => record.frequentlyPurchasedCategories.join(", "),
  },
];

type TopCustomerGridProps = {
  data: TopCustomerReportResponse[];
};

export const TopCustomerGrid = ({ data }: TopCustomerGridProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <MantineDataTable
      idAccessor="customerId"
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
