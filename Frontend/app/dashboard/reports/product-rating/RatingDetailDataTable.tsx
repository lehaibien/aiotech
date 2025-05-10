"use client";

import { MantineDataTable } from "@/components/data-table/MantineDataTable";
import { productRatingReportColumns } from "@/features/dashboard/reports/product-rating/productRatingReportColumns";
import { ProductRatingReportResponse } from "@/types";
import { useState } from "react";

type RatingDetailDataTableProps = {
  data: ProductRatingReportResponse[];
};

export const RatingDetailDataTable = ({ data }: RatingDetailDataTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  return (
    <MantineDataTable
      columns={productRatingReportColumns}
      data={data}
      totalRows={data.length}
      loading={false}
      withRowNumber={false}
      checkboxSelection={false}
      withTableBorder={true}
      withColumnBorders={true}
      page={page}
      pageSize={pageSize}
      onPageChange={(page) => setPage(page)}
      onPageSizeChange={(pageSize) => setPageSize(pageSize)}
    />
  );
}
