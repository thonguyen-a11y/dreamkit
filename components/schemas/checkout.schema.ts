import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z.string().max(100, "Họ và tên tối đa 100 ký tự"),
  phone: z.string().max(30, "Số điện thoại tối đa 30 ký tự"),
  email: z.union([z.literal(""), z.string().email("Email không hợp lệ")]),
  note: z.string().max(2000, "Ghi chú tối đa 2000 ký tự"),
  paymentMethod: z.enum(["cash", "bank"], {
    message: "Vui lòng chọn phương thức thanh toán",
  }),
});

export type CheckoutFormType = z.infer<typeof checkoutFormSchema>;
