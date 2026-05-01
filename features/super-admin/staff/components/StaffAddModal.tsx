// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X } from "lucide-react";

// interface StaffAddModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   editData?: any;
// }

// export function StaffAddModal({ isOpen, onClose }: StaffAddModalProps) {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "Sales & Support", // Mặc định
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       // Đổi port 3001 thành port Backend NestJS của bạn nếu khác
//       const res = await axios.post(`http://localhost:3001/users`, formData);
      
//       if (res.data) {
//         alert("Thêm nhân viên thành công!");
//         onClose(); // Đóng modal
//         window.location.reload(); // Tải lại trang để bảng cập nhật dữ liệu mới
//       }
//     } catch (error: any) {
//       console.error("Lỗi khi thêm nhân viên:", error);
//       alert(error.response?.data?.message || "Có lỗi xảy ra khi thêm nhân viên!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-xl font-bold text-slate-800">Thêm Nhân Viên Mới</h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">Họ và tên *</label>
//             <Input 
//               name="fullName" 
//               required 
//               placeholder="VD: Nguyễn Văn A" 
//               value={formData.fullName} 
//               onChange={handleChange} 
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
//             <Input 
//               type="email" 
//               name="email" 
//               required 
//               placeholder="VD: nva@nettech.com" 
//               value={formData.email} 
//               onChange={handleChange} 
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu *</label>
//             <Input 
//               type="password" 
//               name="password" 
//               required 
//               placeholder="Nhập mật khẩu" 
//               value={formData.password} 
//               onChange={handleChange} 
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">Số điện thoại</label>
//             <Input 
//               name="phone" 
//               placeholder="VD: 0987654321" 
//               value={formData.phone} 
//               onChange={handleChange} 
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">Vai trò *</label>
//             <select 
//               name="role" 
//               className="w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
//               value={formData.role} 
//               onChange={handleChange}
//             >
//               <option value="Super Admin">Super Admin</option>
//               <option value="Store Manager">Store Manager</option>
//               <option value="Sales & Support">Sales & Support</option>
//               <option value="Warehouse Staff">Warehouse Staff</option>
//             </select>
//           </div>

//           <div className="mt-4 flex justify-end gap-3">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Hủy
//             </Button>
//             <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
//               {loading ? "Đang xử lý..." : "Xác nhận tạo"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface StaffAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any; // Nhận dữ liệu nhân viên khi ở chế độ Sửa
}

export function StaffAddModal({ isOpen, onClose, editData }: StaffAddModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Sales & Support",
  });

  // Theo dõi editData: Nếu có data thì điền vào form, không thì reset trắng
  useEffect(() => {
    if (editData) {
      setFormData({
        fullName: editData.fullName || "",
        email: editData.email || "",
        password: "", // Để trống mật khẩu khi sửa (nếu không nhập sẽ giữ nguyên pass cũ)
        phone: editData.phone || "",
        role: editData.role || "Sales & Support",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "Sales & Support",
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editData) {
        // CHẾ ĐỘ SỬA: Dùng PATCH và truyền ID vào URL
        await axios.patch(`http://localhost:3001/users/${editData._id}`, formData);
        alert("Cập nhật nhân viên thành công!");
      } else {
        // CHẾ ĐỘ THÊM: Dùng POST
        await axios.post(`http://localhost:3001/users`, formData);
        alert("Thêm nhân viên thành công!");
      }
      
      onClose();
      window.location.reload(); 
    } catch (error: any) {
      console.error("Lỗi:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {editData ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên Mới"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Họ và tên *</label>
            <Input 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
            <Input 
              type="email" 
              name="email" 
              required 
              disabled={!!editData} // Không cho phép sửa email (thường là unique key)
              className={editData ? "bg-slate-50 opacity-70" : ""}
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Mật khẩu {editData ? "(Để trống nếu không đổi)" : "*"}
            </label>
            <Input 
              type="password" 
              name="password" 
              required={!editData} 
              placeholder={editData ? "********" : "Nhập mật khẩu"}
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Số điện thoại</label>
            <Input 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Vai trò *</label>
            <select 
              name="role" 
              className="w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Sales & Support">Sales & Support</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
              {loading ? "Đang xử lý..." : editData ? "Lưu thay đổi" : "Xác nhận tạo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}