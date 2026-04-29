"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createMemberSchema, CreateMemberInput } from "@/features/super-admin/members/utils/memberValidation";
import { toast } from "react-toastify";

export default function CreateMemberPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateMemberInput>({
    resolver: zodResolver(createMemberSchema as any),
    defaultValues: {
      password: "Nettech@123",
      status: "active",
      initialTier: "Member (Mặc định)",
      sendEmail: true,
    },
  });

  const onSubmit = (data: CreateMemberInput) => {
    console.log("Form Submitted", data);
    toast.success("Tạo thành viên mới thành công!");
    router.push("/super-admin/members");
  };

  const handleRandomPassword = () => {
    const randomStr = Math.random().toString(36).slice(-8) + "@" + Math.floor(Math.random() * 100);
    setValue("password", randomStr);
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-slate-500 mb-1">
              <Link href="/super-admin/members" className="hover:underline">Khách hàng</Link> &gt; Thêm mới
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Tạo Hồ sơ Thành viên Mới
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/super-admin/members"
              className="rounded-md border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              HỦY
            </Link>
            <Button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              LƯU KHÁCH HÀNG
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          {/* Thông tin cá nhân */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Thông tin cá nhân
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ và tên */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Họ và tên *
                </label>
                <Input
                  {...register("fullName")}
                  placeholder="Nhập họ tên đầy đủ..."
                  className={`rounded-md border p-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.fullName ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Số điện thoại *
                </label>
                <Input
                  {...register("phone")}
                  placeholder="Nhập số điện thoại..."
                  className={`rounded-md border p-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email (Tên đăng nhập)
                </label>
                <Input
                  {...register("email")}
                  placeholder="example@email.com"
                  className={`rounded-md border p-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Mật khẩu mặc định
                </label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    className={`w-full rounded-md border p-2 pr-20 text-sm focus:outline-none focus:ring-1 ${
                      errors.password ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  <Button
                    type="button"
                    onClick={handleRandomPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Random
                  </Button>
                </div>
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>

              {/* Địa chỉ */}
              <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Địa chỉ giao hàng
                </label>
                <Input
                  {...register("address")}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện..."
                  className="rounded-md border border-slate-200 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Cài đặt tài khoản */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Cài đặt tài khoản
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Trạng thái */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Trạng thái
                </label>
                <select
                  {...register("status")}
                  className="rounded-md border border-slate-200 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="active">● Hoạt động</option>
                  <option value="inactive">○ Khóa</option>
                </select>
              </div>

              {/* Hạng thẻ */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Hạng thẻ ban đầu
                </label>
                <Input
                  {...register("initialTier")}
                  disabled
                  className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Gửi email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Gửi email thông báo?
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    {...register("sendEmail")}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-sm text-slate-700">
                    Gửi thông tin tài khoản qua email cho khách
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
