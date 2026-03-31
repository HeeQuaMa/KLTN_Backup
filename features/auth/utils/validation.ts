import { z } from "zod";

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  phone: z.string().min(10, "SĐT không hợp lệ").regex(/^[0-9]+$/, "SĐT chỉ được chứa chữ số"),
  password: z.string().min(8, "Mật khẩu phải từ 8-25 ký tự").max(25, "Mật khẩu tối đa 25 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  agreeTerms: z.boolean().default(false).refine((val) => val === true, {
    message: "Bạn phải đồng ý với Điều khoản",
  }),
  subscribe: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
