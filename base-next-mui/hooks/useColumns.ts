import { GridColDef } from "@mui/x-data-grid";
import React from "react";

type UseColumnsProps = {
  withRowNumber?: boolean;
  columns: GridColDef[];
};

function useColumns({ columns, withRowNumber = false }: UseColumnsProps) {
  const columnsWithRowNumber: GridColDef[] = React.useMemo(() => {
    if (withRowNumber) {
      return [
        {
          field: "id",
          headerName: "STT",
          width: 75,
          align: "center",
          headerAlign: "center",
          valueGetter: (_, row, __, apiRef) => {
            const pageSize =
              apiRef.current.state.pagination.paginationModel.pageSize;
            const page = apiRef.current.state.pagination.paginationModel.page;
            const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(
              row.id
            );
            const rowNumber = pageSize * page + (rowIndex + 1);
            return rowNumber;
          },
        },
        ...columns,
      ];
    }
    return columns;
  }, [withRowNumber, columns]);

  return columnsWithRowNumber;
}

export default useColumns;
