import { UUID } from "crypto";
import { z } from "zod";
import { BaseResponse, BaseGetListRequest } from "./base";

/*
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
*/

export enum OrderStatus {
  Pending,
  Paid,
  Processing,
  Delivering,
  Delivered,
  Completed,
  Cancelled,
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

export enum PaymentMethods {
  COD = 0,
  VNPAY = 1,
  MOMO = 2,
}

export const checkoutRequestSchema = z.object({
  customerId: z.string().uuid(),
  tax: z.number(),
  totalPrice: z
    .number()
    .min(1, { message: "Thành tiền phải lớn hơn hoặc bằng 0" }),
  name: z.string(),
  phoneNumber: z.string().regex(/^(0|\+84)(\d{9,10})$/, {
    message:
      "Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx)",
  }),
  address: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  note: z.string().optional(),
  provider: z.nativeEnum(PaymentMethods),
  orderItems: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z
        .number()
        .min(1, { message: "Số lượng sản phẩm phải lớn hơn 0" }),
      price: z
        .number()
        .min(1, { message: "Giá sản phẩm phải lớn hơn hoặc bằng 0" }),
    })
  ),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const checkoutFormSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().regex(/^(0|\+84)(\d{9,10})$/, {
    message:
      "Số điện thoại không hợp lệ (định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx)",
  }),
  address: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  note: z.string().optional(),
  provider: z.nativeEnum(PaymentMethods),
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
