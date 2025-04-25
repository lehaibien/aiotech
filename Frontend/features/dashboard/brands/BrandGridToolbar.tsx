'use client';

import { DataTableRef } from '@/components/core/DataTable';
import { API_URL } from '@/constant/apiUrl';
import { ERROR_MESSAGE } from '@/constant/message';
import { DashboardDeleteButton } from '@/features/dashboard/DashboardDeleteButton';
import { DashboardSearchBar } from '@/features/dashboard/DashboardSearchBar';
import { AddRounded, EditRounded } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React from 'react';

type BrandGridToolbarProps = {
  dataGridRef: React.RefObject<DataTableRef | null>;
  children?: React.ReactNode;
};
function BrandGridToolbar({ dataGridRef, children }: BrandGridToolbarProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  function triggerAdd() {
    dataGridRef.current?.clearSelection();
    router.push('/dashboard/brands/upsert');
  }
  function triggerEdit() {
    const rowSelection = dataGridRef.current?.rowSelectionModel.ids;
    if (rowSelection?.size === undefined) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: 'error' });
      return;
    }
    if (rowSelection.size === 0) {
      enqueueSnackbar(ERROR_MESSAGE.noRowSelected, { variant: 'error' });
      return;
    }
    if (rowSelection.size > 1) {
      enqueueSnackbar(ERROR_MESSAGE.onlyOneRowSelected, {
        variant: 'error',
      });
      return;
    }
    const selectedData = rowSelection.values().next().value;
    if (selectedData) {
      dataGridRef.current?.clearSelection();
      router.push(`/dashboard/brands/upsert?id=${selectedData}`);
    }
  }
  return (
    <Box
      display='flex'
      alignItems='center'
      gap={1}
      paddingBottom={1}
      flexWrap='wrap'>
      <Button
        variant='contained'
        color='primary'
        onClick={triggerAdd}
        startIcon={<AddRounded />}
        sx={{
          textTransform: 'none',
          '.MuiButton-startIcon': {
            marginRight: '2px',
          },
        }}>
        Thêm mới
      </Button>
      <Button
        variant='contained'
        color='secondary'
        onClick={triggerEdit}
        startIcon={<EditRounded />}
        sx={{
          textTransform: 'none',
          '.MuiButton-startIcon': {
            marginRight: '2px',
          },
        }}>
        Cập nhật
      </Button>
      <DashboardDeleteButton
        apiUrl={API_URL.brand}
        name='thương hiệu'
        dataGridRef={dataGridRef}
      />
      {children}
      <DashboardSearchBar dataGridRef={dataGridRef} />
    </Box>
  );
}

export default BrandGridToolbar;
