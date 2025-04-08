import useSWR from 'swr';
import { PaginatedList } from '@/types';
import React from 'react';

type UseDataGridDataProps<T> = {
  pathName: string;
  paginationModel: { page: number; pageSize: number };
  loadData: (page: number, pageSize: number) => Promise<PaginatedList<T>>;
};

function useDataGridData<T>({ pathName, paginationModel, loadData }: UseDataGridDataProps<T>) {
  const fetcher = React.useCallback(
    async ([, page, pageSize]: [string, number, number]): Promise<PaginatedList<T>> => {
      const data = await loadData(page, pageSize);
      return data;
    },
    [loadData]
  );

  const swrKey = React.useMemo(() => [pathName, paginationModel.page, paginationModel.pageSize], [pathName, paginationModel.page, paginationModel.pageSize]);

  return useSWR<PaginatedList<T>>(swrKey, {
    fetcher: fetcher,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 1,
    errorRetryInterval: 5000,
  });
}

export default useDataGridData;