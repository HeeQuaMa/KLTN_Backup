"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, User } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import component Avatar của Shadcn

function Header() {
  const router = useRouter();
  // Use state to avoid hydration mismatch when reading from local storage (if Zustand persists)
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  // Lấy thông tin user và hàm logout từ Auth Store
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công!", { autoClose: 2000 });
    router.push("/"); // Trở về trang chủ
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-all md:px-8 lg:px-12 lg:py-6.25 xl:px-16">
      <div className="text-xl font-bold md:text-2xl lg:text-[32px]">
        <Link href={"/"}>
          <span className="text-primary">Net</span>Tech
        </Link>
      </div>
      <div className="order-last flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto">
        <Input
          type="search"
          placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
          className={cn("h-full flex-1 lg:w-150")}
        />
        <Button
          className={cn(
            "hover:bg-primary-hover/90 h-full cursor-pointer px-4 text-white lg:w-17.5",
          )}
        >
          Search
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/cart"
          className="group hover:text-primary relative flex cursor-pointer items-center gap-2 text-sm transition-colors md:text-base"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            {mounted && totalItems > 0 && (
              <span className="bg-destructive absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white md:h-5 md:w-5 md:text-xs">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
          <p className="hidden md:block">Giỏ hàng</p>
        </Link>
        {/* LOGIC HIỂN THỊ TRẠNG THÁI LOGIN */}
        <div className="flex items-center gap-2 lg:h-10">
          {!mounted ? (
            <div className="h-10 w-32"></div>
          ) : user ? (
            // <div className="flex items-center gap-3">
            //   <span className="hidden text-sm font-medium text-gray-700 md:block">
            //     Hello,{" "}
            //     <span className="text-primary font-bold">
            //       {user.fullName || user.email}
            //     </span>
            //   </span>
            //   <Button
            //     onClick={handleLogout}
            //     variant="outline"
            //     className="border-primary text-primary hover:bg-primary/10 h-8 cursor-pointer px-3 text-sm transition-colors md:h-10"
            //   >
            //     <LogOut className="h-4 w-4 md:mr-2" />
            //     <span className="hidden md:block">Đăng xuất</span>
            //   </Button>
            // </div>
            <div className="flex items-center gap-4">
              {/* Component Avatar mặc định */}
              <Avatar className="h-10 w-10 cursor-pointer border border-gray-200">
                <AvatarImage src="" alt="default-user-avatar" />
                <AvatarFallback className="bg-primary-hover text-white">
                  {/* Dùng icon User mặc định */}
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <span className="hidden text-sm font-medium text-gray-700 md:block">
                Hello,{" "}
                <span className="text-primary font-bold">
                  {user.fullName || user.email}
                </span>
              </span>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 h-8 cursor-pointer px-3 text-sm transition-colors md:h-10"
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:block">Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  className={cn(
                    "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
                  )}
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className={cn(
                    "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
                  )}
                >
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useCartStore } from "@/store/useCartStore";
// // Import store Auth của bạn vào (hãy sửa lại đường dẫn này cho đúng với project của bạn nhé)
// import { useAuthStore } from "@/store/useAuthStore";
// import { Input } from "../ui/input";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ShoppingCart, LogOut } from "lucide-react"; // Import thêm icon LogOut cho đẹp
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// function Header() {
//   const router = useRouter();

//   // Use state to avoid hydration mismatch
//   const totalItems = useCartStore((state) => state.getTotalItems());
//   const [mounted, setMounted] = useState(false);

//   // Lấy thông tin user và hàm logout từ Auth Store
//   const { user, logout } = useAuthStore();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Hàm xử lý khi bấm nút Đăng xuất
//   const handleLogout = () => {
//     logout();
//     toast.success("Đã đăng xuất thành công!", { autoClose: 2000 });
//     router.push("/"); // Trở về trang chủ
//   };

//   return (
//     <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-all md:px-8 lg:px-12 lg:py-6.25 xl:px-16">

//       {/* Cột 1: Logo */}
//       <div className="text-xl font-bold md:text-2xl lg:text-[32px]">
//         <Link href={"/"}>
//           <span className="text-primary">Net</span>Tech
//         </Link>
//       </div>

//       {/* Cột 2: Thanh tìm kiếm */}
//       <div className="order-last flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto">
//         <Input
//           type="search"
//           placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
//           className={cn("h-full flex-1 lg:w-150")}
//         />
//         <Button
//           className={cn(
//             "hover:bg-primary-hover/90 h-full cursor-pointer px-4 text-white lg:w-17.5",
//           )}
//         >
//           Search
//         </Button>
//       </div>

//       {/* Cột 3: Giỏ hàng & User */}
//       <div className="flex items-center gap-4">

//         {/* Giỏ hàng */}
//         <Link href="/cart" className="group relative flex cursor-pointer items-center gap-2 text-sm md:text-base transition-colors hover:text-primary">
//           <div className="relative">
//             <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
//             {mounted && totalItems > 0 && (
//               <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white md:h-5 md:w-5 md:text-xs">
//                 {totalItems > 99 ? "99+" : totalItems}
//               </span>
//             )}
//           </div>
//           <p className="hidden md:block">Giỏ hàng</p>
//         </Link>

//         {/* LOGIC HIỂN THỊ TRẠNG THÁI LOGIN */}
//         <div className="flex items-center gap-2 lg:h-10">
//           {!mounted ? (
//             // Tránh giật layout khi đang Hydration
//             <div className="h-10 w-32"></div>
//           ) : user ? (
//             // NẾU ĐÃ LOGIN: Hiện chữ Hello và nút Đăng xuất
//             <div className="flex items-center gap-3">
//               <span className="hidden md:block text-sm font-medium text-gray-700">
//                 Hello, <span className="text-primary font-bold">{user.fullName || user.email}</span>
//               </span>
//               <Button
//                 onClick={handleLogout}
//                 variant="outline"
//                 className="h-8 px-3 text-sm md:h-10 border-primary text-primary hover:bg-primary/10 transition-colors"
//               >
//                 <LogOut className="w-4 h-4 md:mr-2" />
//                 <span className="hidden md:block">Đăng xuất</span>
//               </Button>
//             </div>
//           ) : (
//             // NẾU CHƯA LOGIN: Hiện nút Đăng nhập / Đăng ký cũ
//             <>
//               <Link href="/login">
//                 <Button
//                   className={cn(
//                     "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
//                   )}
//                 >
//                   Đăng nhập
//                 </Button>
//               </Link>
//               <Link href="/register">
//                 <Button
//                   className={cn(
//                     "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
//                   )}
//                 >
//                   Đăng ký
//                 </Button>
//               </Link>
//             </>
//           )}
//         </div>

//       </div>
//     </header>
//   );
// }

// export default Header;
