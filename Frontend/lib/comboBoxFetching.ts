import { API_URL } from "@/constant/apiUrl";
import { ComboBoxItem } from "@/types";
import { getApi } from "./apiClient";

export async function fetchCategoryCombobox(): Promise<ComboBoxItem[]> {
  const response = await getApi(API_URL.categoryComboBox);
  if (response.success) {
    return response.data as ComboBoxItem[];
  } else {
    return [];
  }
}

export async function fetchBrandCombobox(): Promise<ComboBoxItem[]> {
  const response = await getApi(API_URL.brandComboBox);
  if (response.success) {
    return response.data as ComboBoxItem[];
  } else {
    return [];
  }
}

export async function fetchRoleCombobox(): Promise<ComboBoxItem[]> {
  const response = await getApi(API_URL.roleComboBox);
  if (response.success) {
    return response.data as ComboBoxItem[];
  } else {
    return [];
  }
}
