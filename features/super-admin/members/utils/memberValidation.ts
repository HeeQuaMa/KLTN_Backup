import { z } from "zod";

export const createMemberSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phone: z
    .string()
    .regex(/^(0)[0-9]{9}$/, "Số điện thoại không hợp lệ (Bắt đầu bằng 0, gồm 10 chữ số)"),
  email: z.string().email("Định dạng email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  initialTier: z.string(),
  sendEmail: z.boolean(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
