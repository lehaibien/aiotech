import { PAGE_SIZE_OPTIONS } from "@/constant/common";
import { MantineSize } from "@mantine/core";
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus,
  useDataTableColumns,
} from "mantine-datatable";
import { useState } from "react";

type MantineDataTableProps<T> = {
  key?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  totalRows: number;
  loading?: boolean;
  withRowNumber?: boolean;
  checkboxSelection?: boolean;
  withTableBorder?: boolean;
  withColumnBorders?: boolean;
  highlightOnHover?: boolean;
  borderRadius?: MantineSize | (string & NonNullable<unknown>) | number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSelectedRecordsChange?: (selectedRecords: T[]) => void;
  onSortStatusChange?: (sortStatus: DataTableSortStatus<T>) => void;
  height?: number | string;
  minHeight?: number;
  idAccessor?: (keyof T | (string & NonNullable<unknown>)) | ((record: T) => React.Key);
};

export const MantineDataTable = <T,>({
  key,
  columns,
  data,
  totalRows,
  loading = false,
  withRowNumber = false,
  checkboxSelection = false,
  withTableBorder = true,
  withColumnBorders = true,
  highlightOnHover = true,
  borderRadius = "sm",
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSelectedRecordsChange,
  onSortStatusChange,
  height = "100%",
  minHeight = 0,
  idAccessor = "id",
}: MantineDataTableProps<T>) => {
  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: "",
    direction: "asc",
  });
  if (withRowNumber) {
    columns = [
      {
        accessor: "rowNumber",
        title: "STT",
        width: 50,
        textAlign: "center",
        render: (_, index) => {
          return pageSize * (page - 1) + index + 1;
        },
      },
      ...columns,
    ];
  }
  const { effectiveColumns } = useDataTableColumns<T>({
    key,
    columns,
  });
  const handleSelectedRecordsChange = (selectedRecords: T[]) => {
    setSelectedRecords(selectedRecords);
    if (checkboxSelection && onSelectedRecordsChange) {
      onSelectedRecordsChange(selectedRecords);
    }
  };
  const handleSortStatusChange = (sortStatus: DataTableSortStatus<T>) => {
    setSortStatus(sortStatus);
    if (onSortStatusChange) {
      onSortStatusChange(sortStatus);
    }
  };
  return (
    <DataTable
      idAccessor={idAccessor}
      height={height}
      minHeight={minHeight}
      withTableBorder={withTableBorder}
      withColumnBorders={withColumnBorders}
      borderRadius={borderRadius}
      highlightOnHover={highlightOnHover}
      columns={effectiveColumns}
      records={data}
      totalRecords={totalRows}
      fetching={loading}
      storeColumnsKey={key}
      page={page}
      onPageChange={onPageChange}
      recordsPerPage={pageSize}
      recordsPerPageOptions={PAGE_SIZE_OPTIONS}
      onRecordsPerPageChange={onPageSizeChange}
      selectedRecords={checkboxSelection ? selectedRecords : undefined}
      onSelectedRecordsChange={
        checkboxSelection ? handleSelectedRecordsChange : undefined
      }
      sortStatus={sortStatus}
      onSortStatusChange={handleSortStatusChange}
      recordsPerPageLabel="Số dòng mỗi trang"
      noRecordsText="Không có dữ liệu"
      paginationText={({
        from,
        to,
        totalRecords,
      }: {
        from: number;
        to: number;
        totalRecords: number;
      }) => `${from} - ${to} trong tổng số ${totalRecords} dòng`}
    />
  );
};
