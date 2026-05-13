"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { io } from "socket.io-client";

const SOUND_SRC = "/sounds/notification.mp3";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export type NotificationPayload = {
  orderCode: string;
  totalPrice: number;
  customerName: string;
};

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const openNotification = (data: any) => {
    setShowModal(true);
    setNotification({
      orderCode: data.orderCode || data.code || "—",
      totalPrice: Number(data.totalPrice || data.totalAmount || 0),
      customerName: data.customerName || data.customer?.name || "Khách hàng",
    });

    if (audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 0; // Luôn bắt đầu từ giây thứ 0
      audio.play().catch((e) => console.warn("Sound blocked", e));

      // TỰ ĐỘNG DỪNG SAU 3 GIÂY
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0; // Reset lại để lần sau kêu tiếp
      }, 3000); 
    }
  };


  useEffect(() => {
    setMounted(true);

    const adminInfoRaw = localStorage.getItem('admin_info');
    let userRole = '';

    if (adminInfoRaw) {
      try {
        const parsed = JSON.parse(adminInfoRaw) as {
          role?: string;
          user?: { role?: string };
        };
        userRole = parsed.role || parsed.user?.role || '';
      } catch (e) {
        console.error('Failed to parse admin_info', e);
      }
    }

    console.log('DEBUG: Detected Role is:', userRole);

    const normalizedRole = userRole.toLowerCase().replace(/\s+/g, '-');
    if (normalizedRole !== 'super-admin' && normalizedRole !== 'store-manager') {
      console.log('Role not authorized');
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      auth: { role: normalizedRole, token: localStorage.getItem("admin_token") },
      withCredentials: true,
    });

    (window as any).socket = socket;
    console.log('!!! WINDOW.SOCKET HAS BEEN ASSIGNED:', (window as any).socket);
    console.log("--- SOCKET FORCED TO WINDOW ---", socket);

    socket.on("connect", () => {
      (window as any).socket = socket;
      console.log('!!! WINDOW.SOCKET HAS BEEN ASSIGNED:', (window as any).socket);
      console.log("SOCKET CONNECTED SUCCESSFULLY! ID:", socket.id);
    });
    socket.on("connect_error", (err) =>
      console.error("SOCKET CONNECTION ERROR:", err),
    );
    socket.on("NEW_ORDER_RECEIVED", (data) => {
      openNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={SOUND_SRC} preload="auto" />
      {children}
      {mounted && showModal && notification && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-md">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl shadow-black/40">
                <div className="mb-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-blue-300">
                    BẠN CÓ ĐƠN HÀNG MỚI!
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">Thông báo đơn hàng</h2>
                </div>

                <div className="space-y-3 rounded-xl bg-slate-800/70 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Order Code</span>
                    <span className="font-semibold text-white">{notification.orderCode}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Amount</span>
                    <span className="font-semibold text-emerald-400">
                      {notification.totalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Customer</span>
                    <span className="font-semibold text-white">{notification.customerName}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <a
                    href="/super-admin/orders"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-500"
                    onClick={() => setShowModal(false)}
                  >
                    Go to Orders
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
