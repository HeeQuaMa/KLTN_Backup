"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Khởi tạo Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Gọi API lấy data cũ điền vào form
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/users/${id}`);
        // Reset form với dữ liệu lấy được
        reset({
          fullName: res.data.fullName,
          email: res.data.email,
          phone: res.data.phone || "",
          address: res.data.address || "",
          tier: res.data.tier || "Member"
        });
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Không tải được thông tin!");
        router.push(`/super-admin/members/${id}`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMember();
  }, [id, reset, router]);

  // Hàm xử lý Lưu thay đổi
  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await axios.patch(`http://localhost:3001/users/${id}`, data);
      alert("Cập nhật thành công!");
      router.push(`/super-admin/members/${id}`); // Cập nhật xong đẩy về trang chi tiết
    } catch (error) {
      console.error("Lỗi update:", error);
      alert("Cập nhật thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-slate-500 mb-1">
              <Link href="/super-admin/members" className="hover:underline">Khách hàng</Link> &gt; 
              <Link href={`/super-admin/members/${id}`} className="hover:underline ml-1">Chi tiết</Link> &gt; Chỉnh sửa
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Cập nhật Hồ sơ</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/super-admin/members/${id}`} className="rounded-md border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              HỦY
            </Link>
            <Button type="submit" disabled={isSaving} className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "LƯU THAY ĐỔI"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Họ và tên *</label>
              <Input {...register("fullName", { required: "Vui lòng nhập họ tên" })} className="border-slate-200" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
              <Input {...register("phone")} className="border-slate-200" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Email (Không cho sửa)</label>
              <Input {...register("email")} disabled className="bg-slate-50 cursor-not-allowed text-slate-500" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Hạng thẻ</label>
              <select {...register("tier")} className="rounded-md border border-slate-200 p-2 text-sm focus:border-blue-500 focus:outline-none">
                <option value="Member">Member</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Địa chỉ giao hàng</label>
              <Input {...register("address")} className="border-slate-200" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}