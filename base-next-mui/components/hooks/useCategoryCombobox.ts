import { API_URL } from '@/constant/apiUrl';
import { getApi } from '@/lib/apiClient';
import { ComboBoxItem } from '@/types';
import React from 'react';
import useSWR from 'swr';

export function useCategoryCombobox() {
  const fetcher = React.useCallback(
    async (url: string): Promise<ComboBoxItem[]> => {
      const response = await getApi(url);
      if (response.success) {
        return response.data as ComboBoxItem[];
      }
      return [];
    },
    []
  );

  return useSWR<ComboBoxItem[]>(API_URL.categoryComboBox, {
    fetcher: fetcher,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    errorRetryCount: 1,
    errorRetryInterval: 5000,
  });
}
