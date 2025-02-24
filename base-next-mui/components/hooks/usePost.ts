import { API_URL } from '@/constant/apiUrl';
import { getListApi } from '@/lib/apiClient';
import { GetListRequest, PaginatedList, PostResponse } from '@/types';
import React from 'react';
import useSWR from 'swr';

export function usePost(
  pageIndex: number,
  pageSize: number,
  textSearch: string
) {
  const fetcher = React.useCallback(
    async (url: string): Promise<PaginatedList<PostResponse>> => {
      const request: GetListRequest = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        textSearch: textSearch,
      };
      const response = await getListApi(url, request);
      if (response.success) {
        return response.data as PaginatedList<PostResponse>;
      }
      return {
        pageIndex: 0,
        pageSize: 0,
        items: [],
        totalCount: 0,
      };
    },
    [pageIndex, pageSize, textSearch]
  );

  return useSWR<PaginatedList<PostResponse>>(API_URL.post, {
    fetcher: fetcher,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 1,
    errorRetryInterval: 5000,
  });
}
