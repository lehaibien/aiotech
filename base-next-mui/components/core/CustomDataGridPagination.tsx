import { PAGE_SIZE_OPTIONS } from '@/constant/common';
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  FirstPageRounded,
  LastPageRounded,
  RefreshRounded,
} from '@mui/icons-material';
import { Button, IconButton, MenuItem, Select } from '@mui/material';
import {
  gridPaginationModelSelector,
  gridRowCountSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import React from 'react';

type DataGridPaginationProps = {
  isLoading: boolean;
  refreshGrid: () => void;
};

function DataGridPagination({
  isLoading,
  refreshGrid,
}: DataGridPaginationProps) {
  const apiRef = useGridApiContext();
  const { page, pageSize } = gridPaginationModelSelector(apiRef);
  const rowCount = gridRowCountSelector(apiRef);
  const totalPage = Math.ceil(rowCount / pageSize);
  const onPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        apiRef.current.setPage(e.target.value ? Number(e.target.value) - 1 : 0);
      }
    },
    [apiRef]
  );
  return (
    <div className='w-full flex items-center justify-center md:justify-between p-2 bg-secondary'>
      <div className='flex items-center space-x-2 lg:space-x-4'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outlined'
            onClick={() => apiRef.current.setPage(0)}
            disabled={isLoading || page === 0}
            sx={{
              height: { sm: 8, md: 32 },
              padding: 0,
              minWidth: { xs: 0, sm: 0, md: 64 },
            }}
          >
            <span className='sr-only'>Đến trang đầu</span>
            <FirstPageRounded className='h-4 w-4' />
          </Button>
          <Button
            variant='outlined'
            onClick={() => apiRef.current.setPage(page - 1)}
            disabled={isLoading || page === 0}
            sx={{
              height: { sm: 8, md: 32 },
              padding: 0,
              minWidth: { xs: 0, sm: 0, md: 64 },
            }}
          >
            <span className='sr-only'>Đến trang trước</span>
            <ChevronLeftRounded className='h-4 w-4' />
          </Button>
        </div>
        <div className='flex items-center justify-center text-sm font-medium'>
          Trang{' '}
          <input
            className='w-10 mx-2 px-2 py-1 border rounded-sm text-center'
            value={page + 1}
            onChange={onPageChange}
          />{' '}
          trong tổng số {pageSize > 0 ? Math.ceil(rowCount / pageSize) : 0}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outlined'
            onClick={() => apiRef.current.setPage(page + 1)}
            disabled={isLoading || page >= totalPage - 1}
            sx={{
              height: { sm: 8, md: 32 },
              padding: 0,
              minWidth: { xs: 0, sm: 0, md: 64 },
            }}
          >
            <span className='sr-only'>Đến trang kế</span>
            <ChevronRightRounded className='h-4 w-4' />
          </Button>
          <Button
            variant='outlined'
            onClick={() => apiRef.current.setPage(totalPage - 1)}
            disabled={isLoading || page >= totalPage - 1}
            sx={{
              height: { sm: 8, md: 32 },
              padding: 0,
              minWidth: { xs: 0, sm: 0, md: 64 },
            }}
          >
            <span className='sr-only'>Đến trang cuối</span>
            <LastPageRounded className='h-4 w-4' />
          </Button>
        </div>
        <div className='hidden sm:flex items-center space-x-2'>
          <Select
            size='small'
            value={pageSize}
            onChange={(e) => apiRef.current.setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
          <p className='text-sm font-medium'>dòng mỗi trang</p>
        </div>
      </div>
      <div className='flex-1 text-sm text-muted-foreground text-right hidden md:block'>
        {`${page * pageSize + 1} - ${Math.min(
          (page + 1) * pageSize,
          rowCount
        )} trong ${rowCount} dòng.`}
      </div>
      <IconButton size='small' onClick={refreshGrid}>
        <RefreshRounded />
      </IconButton>
    </div>
  );
}

export default React.memo(DataGridPagination);
