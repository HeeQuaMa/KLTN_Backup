import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Kiểm tra ID có phải MongoDB ObjectId hợp lệ không (24 ký tự hex).
 * Mock data dùng số nguyên (1, 2...) → trả về false.
 */
export const isValidMongoId = (id: string | number | undefined | null): boolean => {
  if (id === undefined || id === null) return false;
  return /^[a-f\d]{24}$/i.test(String(id));
};

/**
 * Giải mã phần payload của JWT token (không cần thư viện bên ngoài).
 * Backend trả về { id, email, role } trong payload.
 */
export const decodeJwtPayload = <T = Record<string, unknown>>(token: string): T | null => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
};
