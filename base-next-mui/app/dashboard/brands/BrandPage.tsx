'use client';

import CustomDataGrid, {
  CustomDataGridRef,
} from '@/components/core/CustomDataGrid';
import { API_URL } from '@/constant/apiUrl';
import { getListApi } from '@/lib/apiClient';
import { BrandResponse, BaseGetListRequest, PaginatedList } from '@/types';
import { useCallback, useRef } from 'react';
import BrandGridToolbar from './BrandGridToolbar';
import { columns } from './columns';

export default function BrandPage() {
  const searchTerm = useRef('');
  const dataGridRef = useRef<CustomDataGridRef>(null);
  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<BrandResponse>> => {
      const getListRequest: BaseGetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: searchTerm.current,
      };
      const response = await getListApi(API_URL.brand, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<BrandResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    []
  );
  return (
    <>
      <BrandGridToolbar dataGridRef={dataGridRef} searchTermRef={searchTerm} />
      <CustomDataGrid
        ref={dataGridRef}
        columns={columns}
        withRowNumber
        checkboxSelection
        loadData={loadData}
      />
    </>
  );
}
