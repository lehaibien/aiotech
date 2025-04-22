import { DEFAULT_TIMEZONE, EMPTY_UUID } from '@/constant/common';
import dayjs from '@/lib/extended-dayjs';
import { UUID } from "@/types";
import { Dayjs } from 'dayjs';

/**
 * Generates a version 4 UUID (Universally Unique Identifier)
 * @returns A string representing a UUID in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID(): UUID {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as UUID;
}

/**
 * Parses a string to a UUID.
 *
 * @param {string} uuid - The string to parse.
 * @returns {UUID} - The parsed UUID, or an empty UUID if the input is an empty string.
 */
export function parseUUID(uuid: string | undefined): UUID {
  if (uuid === undefined || uuid === '') {
    return EMPTY_UUID;
  }
  return uuid as UUID;
}

/**
 * Formats a number with custom thousand separators and decimal places
 *
 * @param {number} number - The number to format
 * @param {number} decimalPlaces - Number of decimal places to show (default: 3)
 * @param {string} seperator - Character to use as thousand separator (default: ".")
 * @returns {string} Formatted number string with specified separator and decimal places
 *
 * @example
 * // Returns "1.234,567"
 * formatNumberWithSeperator(1234.5674, 3, ".")
 *
 * @example
 * // Returns "1,234.567"
 * formatNumberWithSeperator(1234.5674, 3, ",")
 */
export function formatNumberWithSeperator(
  number: number,
  decimalPlaces: number = 0,
  seperator: string = '.'
): string {
  const [integerPart, decimalPart] = number.toFixed(decimalPlaces).split('.');

  // Format integer part with thousand separators
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    seperator
  );

  const decimalZeros = '0'.repeat(decimalPlaces);

  if (decimalPart !== undefined && decimalPart !== decimalZeros) {
    return seperator === ','
      ? `${formattedInteger}.${decimalPart}`
      : `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
}

export function formatDateFromString(
  dateString: string | null,
  format?: string | undefined
): string {
  if (!dateString) {
    return '';
  }
  return dayjs(dateString)
    .utc(true)
    .tz(DEFAULT_TIMEZONE)
    .format(format ?? 'DD/MM/YYYY HH:mm');
}

export function formatDate(
  date: Date | Dayjs,
  format?: string | undefined
): string {
  return dayjs(date)
    .utc(true)
    .tz(DEFAULT_TIMEZONE)
    .format(format ?? 'DD/MM/YYYY HH:mm');
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
    .normalize('NFD') // Normalize to decompose special characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

export function convertObjectToFormData(obj: unknown): FormData {
  const formData = new FormData();

  // Ensure the provided value is an object (and not null)
  if (obj && typeof obj === 'object') {
    // Use Object.keys to iterate own enumerable properties
    Object.keys(obj as Record<string, unknown>).forEach((key) => {
      const value = (obj as Record<string, unknown>)[key];

      // If the value is an array, append each item separately.
      if (Array.isArray(value)) {
        value.forEach((item) => {
          // If the item is a File/Blob, append it directly.
          if (item instanceof File || item instanceof Blob) {
            formData.append(key, item);
          } else if (typeof item === 'object' && item !== null) {
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
        } else if (typeof value === 'object' && value !== null) {
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
      if (value === null || value === undefined || value === '') {
        return '';
      }
      return (
        encodeURIComponent(key) + '=' + encodeURIComponent(value as string)
      );
    })
    .filter((s) => s !== '')
    .join('&');
  return queryString;
}

export function mapOrderStatus(status: string) {
  switch (status) {
    case 'Pending':
      return 'Đang chờ';
    case 'Paid':
      return 'Đã thanh toán';
    case 'Processing':
      return 'Đang xử lý';
    case 'Delivering':
      return 'Đang giao';
    case 'Delivered':
      return 'Đã giao';
    case 'Completed':
      return 'Đã hoàn thành';
    case 'Cancelled':
      return 'Đã huỷ';
    default:
      return status;
  }
}

export const HTMLPartToTextPart = (HTMLPart: string) =>
  HTMLPart.replace(/\n/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, '')
    .replace(/<\/\s*(?:p|div)>/gi, '\n')
    .replace(/<br[^>]*\/?>/gi, '\n')
    .replace(/<[^>]*>/gi, '')
    .replace('&nbsp;', ' ')
    .replace(/[^\S\r\n][^\S\r\n]+/gi, ' ');
