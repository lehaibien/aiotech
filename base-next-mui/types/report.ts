import { UUID } from "crypto";

export type BaseReportRequest = {
  startDate: string;
  endDate: string;
};

export type SaleReportRequest = {
  category?: string;
  product?: string;
} & BaseReportRequest;

export type OrderReportRequest = {
  customerUsername?: string;
} & BaseReportRequest;

export type LowRatingProductReportRequest = {
  brandId?: UUID;
  categoryId?: UUID;
} & BaseReportRequest;

// Response

export type SaleReportResponse = {
  date: string; // ISO string from DateTime
  revenue: number;
};

export type OrderReportResponse = {
  date: string; // ISO string from DateTime
  orderCount: number;
};

export type LowRatingProductReportResponse = {
  date: string; // ISO string from DateTime
  productCount: number;
};
