import { getListApi } from '@/lib/apiClient';
import { GetListRequest, PaginatedList } from '@/types';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

type useDataTableFetchProps = {
  apiUrl: string;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  textSearch: string;
};

export function useDataTableFetch<T>({
  apiUrl,
  paginationModel,
  sortModel,
  textSearch,
}: useDataTableFetchProps) {
  const fetcher = useCallback(
    async ([apiUrl, page, pageSize, sortColumn, sortOrder, textSearch]: [
      string,
      number,
      number,
      string | undefined,
      'asc' | 'desc' | undefined,
      string
    ]): Promise<PaginatedList<T>> => {
      const request: GetListRequest = {
        pageIndex: page,
        pageSize: pageSize,
        sortColumn: sortColumn,
        sortOrder: sortOrder,
        textSearch: textSearch,
      };
      const response = await getListApi(apiUrl, request);
      if (response.success) {
        return response.data as PaginatedList<T>;
      }
      throw new Error(response.message);
    },
    []
  );

  const swrKey = useMemo(
    () => [
      apiUrl,
      paginationModel.page,
      paginationModel.pageSize,
      sortModel[0]?.field,
      sortModel[0]?.sort,
      textSearch,
    ],
    [apiUrl, paginationModel, sortModel, textSearch]
  );

  return useSWR<PaginatedList<T>>(swrKey, {
    fetcher: fetcher,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 2,
    errorRetryInterval: 3000,
  });
}
