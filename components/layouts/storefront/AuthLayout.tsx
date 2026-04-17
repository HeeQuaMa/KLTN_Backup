import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f4f4f4] p-4">
      <div className="flex w-full max-w-110 flex-col items-center rounded-xl bg-white p-8 shadow-sm">
        {/* Logo */}
        <Link href="/" className="mb-2">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            NET<span className="text-[#0066FF]">TECH</span>
          </h1>
        </Link>
        {/* Title */}
        <h2 className="mb-6 text-xl font-bold text-gray-700">{title}</h2>

        {/* Form Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
