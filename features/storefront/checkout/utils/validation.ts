import { z } from "zod";
import { PAYMENT_METHODS } from "@/constants/checkout";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên đầy đủ"),
  phone: z.string().min(10, "SĐT không hợp lệ").regex(/^[0-9]+$/, "SĐT chỉ bao gồm chữ số"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal('')),
  city: z.string().min(2, "Vui lòng chọn Tỉnh/Thành phố"),
  district: z.string().min(2, "Vui lòng chọn Quận/Huyện"),
  ward: z.string().min(2, "Vui lòng chọn Phường/Xã"),
  addressDetail: z.string().min(5, "Vui lòng nhập địa chỉ cụ thể"),
  saveAddress: z.boolean().default(false),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    message: "Vui lòng chọn phương thức thanh toán",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
