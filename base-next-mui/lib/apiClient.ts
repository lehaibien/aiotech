"use server";

import { ApiResponse, GetByIdRequest } from "@/types/base";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Sends a GET request to the specified action endpoint with the given request data and returns the response.
 * @param action The endpoint to send the request to.
 * @param request The data to include in the request body.
 * @returns A promise that resolves with the response from the server, or an error message if the request fails.
 */
export async function getListApi(
  action: string,
  request: object
): Promise<ApiResponse> {
  const baseHeader = await getAuthorizationHeader();
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const response = await fetch(
      getBaseUrl() + action + "?" + toQueryString(request),
      {
        headers: baseHeader,
      }
    );
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Sends a GET request to the specified action endpoint with the given request data and returns the response.
 * @param action The endpoint to send the request to.
 * @param request The data to include in the request body.
 * @returns A promise that resolves with the response from the server, or an error message if the request fails.
 */
export async function getApiQuery(
  action: string,
  request: object
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const baseHeader = await getAuthorizationHeader();
    const response = await fetch(
      getBaseUrl() + action + "?" + toQueryString(request),
      {
        headers: baseHeader,
      }
    );
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

export async function getApi(action: string): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const baseHeader = await getAuthorizationHeader();
    const response = await fetch(getBaseUrl() + action, {
      headers: baseHeader,
    });
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function getByIdApi(
  action: string,
  request: GetByIdRequest
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const baseHeader = await getAuthorizationHeader();
    const response = await fetch(getBaseUrl() + action + "/" + request.id, {
      headers: baseHeader,
    });
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

export async function postApi(
  action: string,
  request: object
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const isFormData = request instanceof FormData;
    const baseHeader = await getAuthorizationHeader();
    const response = await fetch(getBaseUrl() + action, {
      method: "POST",
      headers: isFormData
        ? baseHeader
        : {
            ...baseHeader,
            "Content-Type": "application/json",
          },
      body: isFormData ? request : JSON.stringify(request),
    });
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

export async function putApi(
  action: string,
  request: unknown
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const isFormData = request instanceof FormData;
    const baseHeader = await getAuthorizationHeader();
    const response = await fetch(getBaseUrl() + action, {
      method: "PUT",
      headers: isFormData
        ? baseHeader
        : {
            ...baseHeader,
            "Content-Type": "application/json",
          },
      body: isFormData ? request : JSON.stringify(request),
    });
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteApi(
  action: string,
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const url = getBaseUrl() + action;
    const baseHeader = await getAuthorizationHeader();
    const response = await fetch(url, {
      method: "DELETE",
      headers: baseHeader,
    });
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteApiQuery(
  action: string,
  request: object
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const url = getBaseUrl() + action + toQueryString(request);
    const baseHeader = await getAuthorizationHeader();
    const response = await fetch(url, {
      method: "DELETE",
      headers: baseHeader,
    });
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteListApi(
  action: string,
  list: string[]
): Promise<ApiResponse> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const response = await fetch(getBaseUrl() + action, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    });
    const json = await handleResponse(response);
    return json;
  } catch (error) {
    return handleError(error);
  }
}

function toQueryString(params: object): string {
  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key as keyof object];
      if (value === null || value === undefined || value === "") {
        return "";
      }
      if (Array.isArray(value)) {
        return [...value]
          .map((item) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(item);
          })
          .join("&");
      }
      return (
        encodeURIComponent(key) + "=" + encodeURIComponent(value as string)
      );
    })
    .filter((s) => s !== "")
    .join("&");
  return queryString;
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "";
}

async function getAuthorizationHeader() {
  const session = await auth();
  return {
    Authorization: `Bearer ${session?.user ? session.user.accessToken : ""}`,
  };
}

/**
 * Handles the response from a fetch request.
 *
 * @param response The fetch response object.
 * @returns A Promise that resolves to an ApiResponse object.
 */
async function handleResponse(response: Response): Promise<ApiResponse> {
  if (response.status === 500) {
    throw new Error("Lỗi server: " + response.text());
  }
  if (response.status === 401) {
    redirect("/login");
  }
  const json = await response.json();
  if (
    response.status === 400 &&
    json.title === "One or more validation errors occurred."
  ) {
    const firstError = json.errors[Object.keys(json.errors)[0]];
    return {
      success: false,
      message: firstError[0],
    };
  }
  return json;
}

function handleError(error: unknown) {
  if (isDynamicServerError(error)) {
    throw error;
  }
  return {
    success: false,
    message: (error as Error).message,
  };
}
