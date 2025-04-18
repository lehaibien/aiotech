import { API_URL } from '@/constant/apiUrl';
import { getApi } from '@/lib/apiClient';
import { UserProfileResponse } from '@/types';
import { useCallback } from 'react';
import useSWR from 'swr';

export function useProfileData(userId: string) {
  const userFetcher = useCallback(async () => {
    const response = await getApi(API_URL.user + `/${userId}/profile`);
    if (response.success) {
      return response.data as UserProfileResponse;
    } else {
      throw new Error(response.message);
    }
  }, [userId]);

  return useSWR<UserProfileResponse>(userId, {
    fetcher: userFetcher,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
}
