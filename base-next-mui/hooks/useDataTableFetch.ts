import { getListApi } from '@/lib/apiClient';
import { GetListRequest, PaginatedList } from '@/types';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import React from 'react';
import useSWR from 'swr';

type useDataTableFetchProps = {
  apiUrl: string;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
};

export function useDataTableFetch<T>({apiUrl, paginationModel, sortModel}: useDataTableFetchProps) {
  const fetcher = React.useCallback(
    async ([apiUrl, page, pageSize, sortBy, sortOrder]: [string, number, number, string, 'asc' | 'desc']): Promise<PaginatedList<T>> => {
      const request: GetListRequest = {
        pageIndex: page - 1,
        pageSize: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder,
        textSearch: '',
      }
      const response = await getListApi(apiUrl, request);
      if(response.success) {
        return response.data as PaginatedList<T>;
      }
      throw new Error(response.message);
    },
    [],
  );

  const swrKey = React.useMemo(() => [
    apiUrl,
    paginationModel.page,
    paginationModel.pageSize,
    sortModel[0]?.field,
    sortModel[0]?.sort,
  ], [apiUrl, paginationModel, sortModel]);

  return useSWR<PaginatedList<T>>(swrKey, {
    fetcher: fetcher,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 1,
    errorRetryInterval: 5000,
  });
}