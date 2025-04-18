import { UUID } from "crypto";

export type BaseGetListRequest = {
  textSearch: string;
  pageIndex: number;
  pageSize: number;
};

export type GetListRequest = {
  pageIndex: number;
  pageSize: number;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  textSearch: string;
}

export type GetByIdRequest = {
  id: UUID;
};

export type ApiResponse = {
  success: boolean;
  data?: unknown;
  message?: string;
};

export type BaseResponse = {
  createdDate: Date;
  createdBy: string;
  updatedDate?: Date;
  updatedBy?: string;
};

export type PaginatedList<T> = {
  pageIndex: number;
  pageSize: number;
  items: T[];
  totalCount: number;
};

export type ComboBoxItem = {
  value: string;
  text: string;
};

export type AuthState = {
  userId: UUID;
  username: string;
};

export type NotificationItem = {
  id: UUID;
  message: string;
  isRead: boolean;
  createdDate: Date;
};

export type ComboBoxProps = {
  name: string;
  defaultValue: string | null;
  onValueChange?: (value: string) => void;
};

export type SlugPageParams = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type IdPageParams = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};
