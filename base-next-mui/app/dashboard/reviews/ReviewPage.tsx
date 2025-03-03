'use client';

import CustomDataGrid, {
  CustomDataGridRef,
} from '@/components/core/CustomDataGrid';
import { API_URL } from '@/constant/apiUrl';
import { getListApi } from '@/lib/apiClient';
import { BaseGetListRequest, PaginatedList, ReviewResponse } from '@/types';
import { useCallback, useRef } from 'react';
import ReviewGridToolbar from './ReviewGridToolbar';
import { columns } from './columns';

export default function ReviewPage() {
  const searchTerm = useRef('');
  const dataGridRef = useRef<CustomDataGridRef>(null);
  const loadData = useCallback(
    async (
      page: number,
      pageSize: number
    ): Promise<PaginatedList<ReviewResponse>> => {
      const getListRequest: BaseGetListRequest = {
        pageIndex: page,
        pageSize,
        textSearch: searchTerm.current,
      };
      const response = await getListApi(API_URL.review, getListRequest);
      if (response.success) {
        const paginatedList = response.data as PaginatedList<ReviewResponse>;
        return paginatedList;
      }
      throw new Error(response.message);
    },
    []
  );
  return (
    <>
      <ReviewGridToolbar dataGridRef={dataGridRef} searchTermRef={searchTerm} />
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
