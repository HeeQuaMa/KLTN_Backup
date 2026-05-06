"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getMemberById } from "@/lib/api/memberApi";
import { 
  Loader2, ArrowLeft, User, Phone, Mail, 
  MapPin, Calendar, ShoppingBag, CreditCard, 
  Award, Clock, Lock, Unlock, Edit // Thêm icon Unlock
} from "lucide-react";

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocking, setIsLocking] = useState(false); // Thêm state quản lý lúc bấm nút

  const formatCurrency = (value: unknown): string => {
    const numericValue = Number(value);
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
    return `${new Intl.NumberFormat("vi-VN").format(safeValue)}đ`;
  };

  const getMemberTotalSpent = (data: any): number =>
    Number(data?.totalSpent ?? data?.totalSpending ?? data?.spentAmount ?? 0);

  const fetchMemberDetail = async () => {
    try {
      const data = await getMemberById(id);
      setMember(data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết khách hàng:", error);
      alert("Không tìm thấy thông tin khách hàng!");
      router.push("/super-admin/members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMemberDetail();
    }
  }, [id, router]);

  // Hàm xử lý gọi API Khóa / Mở khóa
  const handleToggleLock = async () => {
    const actionName = member.isDeleted ? 'mở khóa' : 'khóa';
    if (!confirm(`Bạn có chắc chắn muốn ${actionName} tài khoản này không?`)) return;

    setIsLocking(true);
    try {
      await axios.patch(`http://localhost:3001/users/${id}/toggle-lock`);
      // Đảo ngược trạng thái isDeleted trên giao diện ngay lập tức mà không cần load lại trang
      setMember((prev: any) => ({ ...prev, isDeleted: !prev.isDeleted }));
    } catch (error) {
      console.error("Lỗi khi đổi trạng thái:", error);
      alert("Có lỗi xảy ra khi thay đổi trạng thái tài khoản!");
    } finally {
      setIsLocking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!member) return null;

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1200px] mx-auto w-full">
      {/* Header & Nút Back */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Link href="/super-admin/members" className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit font-medium">
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">
            Hồ sơ Khách hàng
          </h1>
        </div>
        {/* === CỤM NÚT ĐẶT Ở ĐÂY NÈ === */}
        <div className="flex items-center gap-3">
          
          {/* NÚT CHỈNH SỬA MỚI THÊM */}
          <Link href={`/super-admin/members/${id}/edit`}>
            <Button 
              variant="outline" 
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm"
            >
              <Edit className="h-4 w-4" /> Chỉnh sửa
            </Button>
          </Link>

          {/* NÚT KHÓA TÀI KHOẢN (Cũ) */}
          <Button 
            onClick={handleToggleLock}
            disabled={isLocking}
            className={
              member.isDeleted 
                ? "bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 shadow-sm" 
                : "bg-white border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2"
            }
          >
            {isLocking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : member.isDeleted ? (
              <Unlock className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {member.isDeleted ? "Mở khóa tài khoản" : "Khóa tài khoản"}
          </Button>

        </div>
      </div>

      {/* 1. TOP BANNER & MAIN PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner Gradient */}
        <div className="h-32 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb]"></div>
        
        {/* Profile Content */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12">
            {/* Left: Avatar & Name */}
            <div className="flex items-end gap-5">
              <div className="h-28 w-28 rounded-2xl bg-white p-1.5 shadow-md">
                <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="h-12 w-12" />
                </div>
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-slate-800">{member.fullName}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                    ID: {member._id?.substring(0, 8).toUpperCase()}
                  </span>
                  
                  {/* HUY HIỆU ĐỘNG: TRẠNG THÁI */}
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                    member.isDeleted 
                      ? "bg-red-100 border-red-200 text-red-700" 
                      : "bg-green-100 border-green-200 text-green-700"
                  }`}>
                    {member.isDeleted ? "● Đã khóa" : "● Hoạt động"}
                  </span>

                </div>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="flex gap-6 pb-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-slate-500">Hạng thẻ</span>
                <span className="text-lg font-bold flex items-center gap-1 text-slate-800">
                  <Award className="h-5 w-5 text-amber-500" /> {member.tier || "Member"}
                </span>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-slate-500">Điểm tích lũy</span>
                <span className="text-lg font-bold text-slate-800">0 pt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRID THÔNG TIN CHI TIẾT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái: Thông tin liên hệ (1/3) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3">Thông tin liên hệ</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-blue-50 p-2 text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-slate-800">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-emerald-50 p-2 text-emerald-600">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Số điện thoại</p>
                  <p className="text-sm font-semibold text-slate-800">{member.phone || "Chưa cập nhật"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-purple-50 p-2 text-purple-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Địa chỉ</p>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {member.address || "Chưa cập nhật thông tin địa chỉ"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-50 p-2 text-amber-600">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Ngày tham gia</p>
                  <p className="text-sm font-semibold text-slate-800">{formatDate(member.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Thống kê & Lịch sử (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Hàng ngang Thống kê mini */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
              <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng đơn hàng</p>
                <h4 className="text-2xl font-bold text-slate-800">0</h4>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
              <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng chi tiêu</p>
                <h4 className="text-2xl font-bold text-slate-800">
                  {formatCurrency(getMemberTotalSpent(member))}
                </h4>
              </div>
            </div>
          </div>

          {/* Bảng Lịch sử đơn hàng (Mock UI) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800">Lịch sử đơn hàng</h3>
              <Button variant="ghost" className="text-blue-600 text-sm hover:bg-blue-50">Xem tất cả</Button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <Clock className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Khách hàng này chưa có đơn hàng nào.</p>
              <p className="text-slate-400 text-sm mt-1">Các giao dịch sẽ hiển thị tại đây khi khách hàng bắt đầu mua sắm.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}