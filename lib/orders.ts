import type { OrderStatus, PaymentMethod } from "./types";

export const ORDER_STATUS_LABELS: Readonly<Record<OrderStatus, string>> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipped: "Đã giao hàng",
  delivered: "Hoàn thành",
  cancelled: "Đã huỷ",
};

export const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export const PAYMENT_METHOD_LABELS: Readonly<Record<PaymentMethod, string>> = {
  bank: "Chuyển khoản",
  cash: "Tiền mặt",
};
