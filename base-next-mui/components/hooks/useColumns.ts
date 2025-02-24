import { GridColDef } from '@mui/x-data-grid';
import React from 'react';

type UseColumnsProps = {
  withRowNumber?: boolean;
  columns: GridColDef[];
};

function useColumns({ columns, withRowNumber = false }: UseColumnsProps) {
  const columnsWithRowNumber: GridColDef[] = React.useMemo(() => {
    if (withRowNumber) {
      return [
        {
          field: 'id',
          headerName: 'STT',
          width: 75,
          align: 'center',
          headerAlign: 'center',
          renderCell: (index) => {
            const pageSize =
              index.api.state.pagination.paginationModel.pageSize || 0;
            const page = index.api.state.pagination.paginationModel.page || 0;
            const rowIndex =
              index.api.getRowIndexRelativeToVisibleRows(index.row.id) || 0;
            const rowNumber = pageSize * page + (rowIndex + 1);
            return isNaN(rowNumber) ? '-' : rowNumber;
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
