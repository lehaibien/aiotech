import { EMPTY_UUID } from "@/constant/common";
import { UUID } from "crypto";
import dayjs from "dayjs";

/**
 * Generates a version 4 UUID (Universally Unique Identifier)
 * @returns A string representing a UUID in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID(): UUID {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as UUID;
}

/**
 * Parses a string to a UUID.
 *
 * @param {string} uuid - The string to parse.
 * @returns {UUID} - The parsed UUID, or an empty UUID if the input is an empty string.
 */
export function parseUUID(uuid: string): UUID {
  if (uuid === "") {
    return EMPTY_UUID;
  }
  return uuid as UUID;
}

/**
 * Formats a number with a given separator.
 *
 * @param {number} number - The number to format.
 * @param {string} [seperator='.'] - The separator to use for formatting. Defaults to '.'.
 * @returns {string} The formatted number as a string.
 */
export function formatNumberWithSeperator(
  number: number,
  seperator: string = "."
): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}

/**
 * Formats a date string into a locale-specific string.
 *
 * @param {string | null} dateString - The date string to format. If `null`, returns an empty string.
 * @returns {string} The formatted date as a string in the user's locale, or an empty string if the input is invalid.
 */
export function formatDateFromString(dateString: string | null): string {
  if (dateString === null) {
    return "";
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString();
}

export function formatDate(date: Date): string {
  const newDate = dayjs(date);
  return newDate.locale("vi").format("DD/MM/YYYY HH:mm");
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function setLocalStorageItem(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorageItem(key: string): unknown {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function convertToSlug(name: string): string {
  return name
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Normalize to decompose special characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

export function convertObjectToFormData(obj: unknown): FormData {
  const formData = new FormData();

  // Ensure the provided value is an object (and not null)
  if (obj && typeof obj === "object") {
    // Use Object.keys to iterate own enumerable properties
    Object.keys(obj as Record<string, unknown>).forEach((key) => {
      const value = (obj as Record<string, unknown>)[key];

      // If the value is an array, append each item separately.
      if (Array.isArray(value)) {
        value.forEach((item) => {
          // If the item is a File/Blob, append it directly.
          if (item instanceof File || item instanceof Blob) {
            formData.append(key, item);
          } else if (typeof item === "object" && item !== null) {
            // For objects, JSON stringify (you might change this if needed)
            formData.append(key, JSON.stringify(item));
          } else {
            // For primitives, append directly.
            formData.append(key, item);
          }
        });
      } else {
        // For non-array values:
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          // Skip undefined values; otherwise, append primitives.
          formData.append(key, value as string);
        }
      }
    });
  }

  return formData;
}

export function toQueryString(params: object): string {
  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key as keyof object];
      if (value === null || value === undefined || value === "") {
        return "";
      }
      return (
        encodeURIComponent(key) + "=" + encodeURIComponent(value as string)
      );
    })
    .filter((s) => s !== "")
    .join("&");
  return queryString;
}

export function mapOrderStatus(status: string) {
  switch (status) {
    case "Pending":
      return "Đang chờ";
    case "Paid":
      return "Đã thanh toán";
    case "Processing":
      return "Đang xử lý";
    case "Delivering":
      return "Đang giao";
    case "Delivered":
      return "Đã giao";
    case "Completed":
      return "Đã hoàn thành";
    case "Cancelled":
      return "Đã huỷ";
    default:
      return status;
  }
}

export const HTMLPartToTextPart = (HTMLPart: string) =>
  HTMLPart.replace(/\n/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, "")
    .replace(/<\/\s*(?:p|div)>/gi, "\n")
    .replace(/<br[^>]*\/?>/gi, "\n")
    .replace(/<[^>]*>/gi, "")
    .replace("&nbsp;", " ")
    .replace(/[^\S\r\n][^\S\r\n]+/gi, " ");
