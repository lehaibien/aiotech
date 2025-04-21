import { UUID } from 'crypto';
import { z } from 'zod';
import { BaseGetListRequest, BaseResponse } from './base';
import {
  checkoutFormSchema,
  checkoutRequestSchema,
} from '@/schemas/orderSchema';

export enum OrderStatus {
  Pending,
  Paid,
  Processing,
  Delivering,
  Delivered,
  Completed,
  Cancelled,
}

export enum PaymentMethods {
  COD = 0,
  VNPAY = 1,
  MOMO = 2,
}

export type OrderResponse = {
  id: UUID;
  trackingNumber: string;
  name: string;
  phoneNumber: string;
  address: string;
  tax: number;
  totalPrice: number;
  status: string;
  deliveryDate?: Date;
  paymentProvider: string;
  note: string;
  orderItems: OrderItem[];
} & BaseResponse;

export type OrderItem = {
  id: UUID;
  productId: UUID;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

export type OrderGetListRequest = {
  customerId?: UUID;
  fromDate?: Date;
  toDate?: Date;
  statuses?: OrderStatus[];
} & BaseGetListRequest;

export type OrderCancelRequest = {
  id: UUID;
  reason: string;
};
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
