import { getListApi } from "@/lib/apiClient";
import { GetListRequest, PaginatedList } from "@/types";
import useSWR from "swr";

export const paginatedListFetcher = async <T>([
  apiUrl,
  page,
  pageSize,
  sortColumn,
  sortOrder,
  textSearch,
]: [
  string,
  number,
  number,
  string | undefined,
  "asc" | "desc" | undefined,
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
};

export const useSWRPaginatedList = <T>(
  url: string,
  page: number,
  pageSize: number,
  sortColumn: string | undefined,
  sortOrder: "asc" | "desc" | undefined,
  textSearch: string
) => {
  return useSWR<PaginatedList<T>>(
    [url, page - 1, pageSize, sortColumn, sortOrder, textSearch],
    {
      fetcher: paginatedListFetcher,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      errorRetryCount: 2,
      errorRetryInterval: 3000,
    }
  );
};
