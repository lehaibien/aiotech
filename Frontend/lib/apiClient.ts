"use server";

import { ApiResponse, GetByIdRequest } from "@/types/base";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { auth } from "./auth";

const API_CONFIG = {
  rejectUnauthorized: "0",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

// Base fetch wrapper
async function fetchApi(
  url: string,
  method: string,
  data?: unknown,
  headers?: Record<string, string>
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = API_CONFIG.rejectUnauthorized;
    const authHeader = await getAuthorizationHeader();

    const response = await fetch(url, {
      method,
      headers: {
        ...authHeader,
        ...headers,
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
}

// Helper functions
function buildUrl(action: string, queryParams?: object): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const query = queryParams ? `?${toQueryString(queryParams)}` : "";
  return `${baseUrl}${action}${query}`;
}

function toQueryString(params: object): string {
  return Object.entries(params)
    .filter(([, value]) => value != null && value !== "")
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(
            (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
          )
        : [`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`]
    )
    .join("&");
}

async function getAuthorizationHeader() {
  const session = await auth();
  return {
    Authorization: `Bearer ${session?.user.accessToken}`,
  };
}

// CRUD Operations
export async function getListApi(action: string, request: object) {
  return fetchApi(buildUrl(action, request), "GET");
}

export async function getApiQuery(action: string, request: object) {
  return fetchApi(buildUrl(action, request), "GET");
}

export async function getApi(action: string) {
  return fetchApi(buildUrl(action), "GET");
}

export async function getByIdApi(action: string, request: GetByIdRequest) {
  return fetchApi(buildUrl(`${action}/${request.id}`), "GET");
}

export async function postApi(action: string, request: unknown) {
  const isFormData = request instanceof FormData;
  return fetchApi(
    buildUrl(action),
    "POST",
    request,
    isFormData ? undefined : API_CONFIG.defaultHeaders
  );
}

export async function putApi(action: string, request: unknown) {
  const isFormData = request instanceof FormData;
  return fetchApi(
    buildUrl(action),
    "PUT",
    request,
    isFormData ? undefined : API_CONFIG.defaultHeaders
  );
}

export async function deleteApi(action: string) {
  return fetchApi(buildUrl(action), "DELETE");
}

export async function deleteApiWithBody(action: string, request: object) {
  return fetchApi(
    buildUrl(action),
    "DELETE",
    request,
    API_CONFIG.defaultHeaders
  );
}

export async function deleteApiQuery(action: string, request: object) {
  return fetchApi(buildUrl(action, request), "DELETE");
}

export async function deleteListApi(action: string, list: string[]) {
  return fetchApi(buildUrl(action), "DELETE", list, API_CONFIG.defaultHeaders);
}

// Response handlers
async function handleResponse(response: Response): Promise<ApiResponse> {
  if (response.status === 401) {
    return { success: false, message: "Unauthorized access" };
  }

  if (response.status === 500) {
    return { success: false, message: "Server error" };
  }

  const json = await response.json();

  if (response.status === 400 && json.title?.includes("validation errors")) {
    const firstError = json.errors[Object.keys(json.errors)[0]];
    return { success: false, message: firstError || "Validation failed" };
  }

  return json;
}

function handleError(error: unknown): ApiResponse {
  if (isDynamicServerError(error)) throw error;
  return { success: false, message: (error as Error).message };
}
