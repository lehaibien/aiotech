import { UUID } from 'crypto';

export type BaseReportRequest = {
  startDate: string;
  endDate: string;
};

export type SaleReportRequest = BaseReportRequest;

export type OrderReportRequest = {
  customerUsername?: string;
} & BaseReportRequest;

export type CategoryPerformanceReportRequest = BaseReportRequest;
export type BrandPerformanceReportRequest = BaseReportRequest;

export type InventoryStatusReportResponse = {
  id: UUID;
  sku: string;
  name: string;
  currentStock: number;
  category: string;
  brand: string;
  imageUrls: string[];
  stockStatus: string;
  reorderRecommended: boolean;
};

export type TopCustomerReportRequest = {
  count: number;
} & BaseReportRequest;

// Response

export type SaleReportResponse = {
  date: Date;
  revenue: number;
  totalOrder: number;
  completedOrder: number;
  cancelledOrder: number;
  averageOrderValue: number;
};

export type OrderReportResponse = {
  date: string; // ISO string from DateTime
  orderCount: number;
};

export type CategoryPerformanceReportResponse = {
  categoryId: string;
  categoryName: string;
  productCount: number;
  totalRevenue: number;
  totalUnitsSold: number;
  averageRating: number;
};

export type BrandPerformanceReportResponse = {
  brandId: string;
  brandName: string;
  productCount: number;
  totalRevenue: number;
  totalUnitsSold: number;
  averageRating: number;
};

export type ProductRatingReportResponse = {
  productId: string;
  productName: string;
  averageRating: number;
  reviewCount: number;
  ratingDistribution: {
    [key: string]: number;
  };
  positiveSentimentPercentage: number;
  negativeSentimentPercentage: number;
};

export type TopCustomerReportResponse = {
  customerId: string;
  customerName: string;
  orderCount: number;
  totalSpent: number;
  averageOrderValue: number;
  firstPurchaseDate: Date;
  latestPurchaseDate: Date;
  daysSinceLastPurchase: number;
  frequentlyPurchasedCategories: string[];
};
