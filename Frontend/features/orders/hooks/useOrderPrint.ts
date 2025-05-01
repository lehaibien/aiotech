import { API_URL } from "@/constant/apiUrl";
import { getApi } from "@/lib/apiClient";
import { useCallback } from "react";

export const useOrderPrint = (id: string, trackingNumber: string) => {
  return useCallback(
    async (id: string) => {
      const response = await getApi(API_URL.order + `/${id}/print`);
      if (response.success) {
        const data = response.data as string;
        const binary = atob(data);
        const buffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          buffer[i] = binary.charCodeAt(i);
        }
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${trackingNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        // clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    },
    [trackingNumber]
  );
};
