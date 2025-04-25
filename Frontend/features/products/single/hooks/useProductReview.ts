import { API_URL } from '@/constant/apiUrl';
import { getListApi } from '@/lib/apiClient';
import {
  GetListReviewByProductIdRequest,
  ReviewProductResponse,
} from '@/types';
import { UUID } from "@/types";
import { useCallback } from 'react';
import useSWR from 'swr';

type HookParams = {
  productId: UUID;
  page: number;
  pageSize: number;
};

export const useProductReview = ({ productId, page, pageSize }: HookParams) => {
  const reviewFetcher = useCallback(
    async ([productId, page, pageSize]: [UUID, number, number]) => {
      const request: GetListReviewByProductIdRequest = {
        productId: productId,
        pageIndex: page - 1,
        pageSize: pageSize,
        textSearch: '',
      };
      const response = await getListApi(API_URL.reviewByProduct, request);
      if (response.success) {
        return response.data as ReviewProductResponse[];
      } else {
        throw new Error(response.message);
      }
    },
    []
  );
  const swr = useSWR<ReviewProductResponse[]>([productId, page, pageSize], {
    fetcher: reviewFetcher,
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });
  return swr;
};
