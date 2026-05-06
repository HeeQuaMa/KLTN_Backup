/** Định dạng VND ngắn cho thẻ KPI dashboard (Tỷ / Triệu). */
export function formatDashboardMoney(vnd: number): string {
  if (vnd >= 1_000_000_000) {
    const b = vnd / 1_000_000_000;
    const s = b.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    return `${s} Tỷ`;
  }
  if (vnd >= 1_000_000) {
    const t = Math.round(vnd / 1_000_000);
    return `${t.toLocaleString("vi-VN")} Tr`;
  }
  return `${Math.round(vnd).toLocaleString("vi-VN")} đ`;
}

export function formatDashboardOrderTotal(vnd: number): string {
  return `${Math.round(vnd).toLocaleString("vi-VN")}`;
}

/** Các tháng gần đây (theo UTC, khớp BE /dashboard). */
export function buildMonthOptions(count = 18): {
  year: number;
  month: number;
  label: string;
}[] {
  const out: { year: number; month: number; label: string }[] = [];
  const now = new Date();
  const y = now.getUTCFullYear();
  const m0 = now.getUTCMonth();
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(y, m0 - i, 1));
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const mmyy = `${String(month).padStart(2, "0")}/${year}`;
    out.push({
      year,
      month,
      label: i === 0 ? `Tháng này: ${mmyy}` : `Tháng: ${mmyy}`,
    });
  }
  return out;
}
