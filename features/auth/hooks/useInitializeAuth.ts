// features/auth/hooks/useInitializeAuth.ts
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getProfileApi } from "@/features/auth/api/auth.api";

const PUBLIC_PATH_PREFIXES = [
  "/",
  "/login",
  "/admin/login",
  "/register",
  "/forgot-password",
  "/products",
  "/category",
  "/build-pc",
  "/cart",
  "/checkout",
  "/khuyen-mai",
];

const isPublicPath = (path: string): boolean => {
  if (path === "/") return true;
  return PUBLIC_PATH_PREFIXES.some((prefix) =>
    prefix === "/" ? false : path.startsWith(prefix),
  );
};

export const useInitializeAuth = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const cookieToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('admin-token='))
        ?.split('=')[1];
      const token = localStorage.getItem("admin_token") ?? cookieToken ?? localStorage.getItem("access_token");
      if (!token) return;

      try {
        const data = await getProfileApi();
        const user = data.user;
        login({ ...user, access_token: token });

        if (pathname === "/admin/login" && String(user?.role ?? "").toLowerCase() !== "customer") {
          window.location.replace("/super-admin");
        }
      } catch (error) {
        if (!isPublicPath(pathname)) {
          console.warn("Token không hợp lệ hoặc đã hết hạn");
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("admin_token");
        document.cookie = "admin-token=; Max-Age=0; path=/";
        logout();
      }
    };

    checkAuth();
  }, [login, logout, pathname]);
};

