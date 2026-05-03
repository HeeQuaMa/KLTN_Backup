// "use client";

// import { Button } from "@/components/ui/button";
// import { Pencil, Lock } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const getInitials = (name: string) => {
//   if (!name) return "U";
//   const parts = name.trim().split(" ");
//   if (parts.length === 0) return "?";
//   return parts[parts.length - 1][0].toUpperCase();
// };


// export function StaffTable() {
//   const searchParams = useSearchParams();
//   const [staffs, setStaffs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStaffs = async () => {
//       setLoading(true);
//       try {
//         const queryString = searchParams.toString();
//         // Nhớ check lại port API NestJS của bạn nhé
//         const res = await axios.get(`http://localhost:3001/users/staff/list?${queryString}`);
        
//         if (res.data && res.data.success) {
//           setStaffs(res.data.data);
//         }
//       } catch (error) {
//         console.error("Lỗi lấy danh sách nhân viên:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStaffs();
//   }, [searchParams]);

//   return (
//     <div className="rounded-xl bg-white shadow-sm overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-sm">
//           <thead>
//             <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
//               <th className="px-6 py-4 font-semibold">NHÂN VIÊN</th>
//               <th className="px-6 py-4 font-semibold">VAI TRÒ (ROLE)</th>
//               <th className="px-6 py-4 font-semibold">CHI NHÁNH QUẢN LÝ</th>
//               <th className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
//               <th className="px-6 py-4 font-semibold text-center">HÀNH ĐỘNG</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
//                   Đang tải dữ liệu...
//                 </td>
//               </tr>
//             ) : staffs.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
//                   Không tìm thấy nhân viên nào phù hợp.
//                 </td>
//               </tr>
//             ) : (
//               staffs.map((staff) => (
//                 <tr key={staff._id} className="hover:bg-slate-50 transition-colors">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className={cn(
//                         "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold",
//                         staff.role === "Super Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
//                       )}>
//                         {getInitials(staff.fullName)}
//                       </div>
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-slate-800">{staff.fullName}</span>
//                         <span className="text-xs text-slate-400">{staff.email}</span>
//                       </div>
//                     </div>
//                   </td>
                  
//                   <td className="px-6 py-4">
//                     <span className={cn(
//                       "inline-flex rounded-full px-3 py-1 text-xs font-semibold border",
//                       staff.role === "Store Manager" ? "bg-blue-50 text-blue-700 border-blue-200" : 
//                       staff.role === "Super Admin" ? "bg-purple-50 text-purple-700 border-purple-200" :
//                       "bg-slate-50 text-slate-700 border-slate-200"
//                     )}>
//                       {staff.role}
//                     </span>
//                   </td>

//                   <td className="px-6 py-4 text-slate-600">
//                     {staff.branchId?.name || "Kho Tổng (Central Warehouse)"}
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={cn(
//                       "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
//                       !staff.isDeleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                     )}>
//                       {!staff.isDeleted ? "Hoạt động" : "Đã khóa"}
//                     </span>
//                   </td>
                  
//                   <td className="px-6 py-4">
//                     <div className="flex items-center justify-center gap-3">
//                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-yellow-600 transition-colors" title="Phân quyền / Mật khẩu">
//                         <Lock className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Lock, Unlock } from "lucide-react"; // Thêm icon Unlock cho đẹp
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { StaffAddModal } from "./StaffAddModal"; // BỔ SUNG IMPORT NÀY

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "?";
  return parts[parts.length - 1][0].toUpperCase();
};

interface StaffTableProps {
  onOpenEdit: (staff: any) => void; // Khai báo là sẽ nhận một hàm có tham số staff
}

export function StaffTable({ onOpenEdit }: StaffTableProps) {
  const searchParams = useSearchParams();
  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MỚI CHO CHỨC NĂNG EDIT ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const queryString = searchParams.toString();
        const res = await axiosInstance.get(
          `/users/staff/list${queryString ? `?${queryString}` : ""}`,
        );

        if (res.data && res.data.success) {
          setStaffs(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách nhân viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, [searchParams]);

  // --- HÀM XỬ LÝ SỬA NHÂN VIÊN ---
  const handleEditClick = (staff: any) => {
    setSelectedStaff(staff); // Lưu data của người được click
    setIsEditModalOpen(true); // Mở modal lên
  };

  // --- HÀM XỬ LÝ KHÓA/MỞ KHÓA ---
  const handleToggleLock = async (id: string, isDeleted: boolean) => {
    const confirmMsg = isDeleted 
      ? "Bạn muốn mở khóa tài khoản này?" 
      : "Bạn có chắc chắn muốn khóa nhân viên này?";
      
    if (!window.confirm(confirmMsg)) return;

    try {
      await axiosInstance.patch(`/users/${id}/toggle-lock`);
      alert(isDeleted ? "Mở khóa thành công!" : "Đã khóa tài khoản!");
      window.location.reload(); // Tải lại trang để cập nhật UI
    } catch (error) {
      console.error("Lỗi khóa tài khoản:", error);
      alert("Có lỗi xảy ra khi thay đổi trạng thái!");
    }
  };

  return (
    <>
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">NHÂN VIÊN</th>
                <th className="px-6 py-4 font-semibold">VAI TRÒ (ROLE)</th>
                <th className="px-6 py-4 font-semibold">CHI NHÁNH QUẢN LÝ</th>
                <th className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
                <th className="px-6 py-4 font-semibold text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : staffs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Không tìm thấy nhân viên nào phù hợp.
                  </td>
                </tr>
              ) : (
                staffs.map((staff) => (
                  <tr key={staff._id} className={cn("hover:bg-slate-50 transition-colors", staff.isDeleted && "opacity-60 bg-slate-50")}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold",
                          staff.isDeleted ? "bg-slate-200 text-slate-500" :
                          staff.role === "Super Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {getInitials(staff.fullName)}
                        </div>
                        <div className="flex flex-col">
                          <span className={cn("font-semibold", staff.isDeleted ? "text-slate-500 line-through" : "text-slate-800")}>
                            {staff.fullName}
                          </span>
                          <span className="text-xs text-slate-400">{staff.email}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold border",
                        staff.isDeleted ? "bg-slate-100 text-slate-500 border-slate-200" :
                        staff.role === "Store Manager" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                        staff.role === "Super Admin" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                      )}>
                        {staff.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {staff.branchId?.name || "Kho Tổng (Central Warehouse)"}
                    </td>

                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        !staff.isDeleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {!staff.isDeleted ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        
                        {/* NÚT EDIT CẬP NHẬT ONCLICK */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditClick(staff)}
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors" 
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* NÚT KHÓA CẬP NHẬT ONCLICK VÀ ĐỔI MÀU NẾU BỊ KHÓA */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleLock(staff._id, staff.isDeleted)}
                          className={cn(
                            "h-8 w-8 transition-colors",
                            staff.isDeleted 
                              ? "text-red-500 hover:text-red-700 hover:bg-red-50" 
                              : "text-slate-400 hover:text-yellow-600 hover:bg-yellow-50"
                          )} 
                          title={staff.isDeleted ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        >
                          {staff.isDeleted ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </Button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- RENDER MODAL EDIT NẰM Ở ĐÂY --- */}
      <StaffAddModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStaff(null);
        }} 
        editData={selectedStaff} // Truyền data qua cho Modal
      />
    </>
  );
}