"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueChartWeek } from "@/lib/api/dashboardApi";

type Row = RevenueChartWeek & { name: string };

export function DashboardChart({
  weeks,
}: {
  weeks: RevenueChartWeek[];
}) {
  const data: Row[] = (weeks.length ? weeks : []).map((w) => ({
    ...w,
    name: w.label,
  }));

  const fallback: Row[] = [
    { name: "Tuần 1", label: "Tuần 1", online: 0, offline: 0 },
    { name: "Tuần 2", label: "Tuần 2", online: 0, offline: 0 },
    { name: "Tuần 3", label: "Tuần 3", online: 0, offline: 0 },
    { name: "Tuần 4", label: "Tuần 4", online: 0, offline: 0 },
  ];

  const chartData = data.length ? data : fallback;

  return (
    <Card className="col-span-1 border-none shadow-sm md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <CardTitle className="text-base font-bold">
          Biểu đồ doanh thu (O2O)
        </CardTitle>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <span className="mr-1 h-3 w-3 bg-[#60a5fa]" />
            <span className="text-slate-500">Online (Web)</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1 h-3 w-3 bg-[#334155]" />
            <span className="text-slate-500">Offline (POS)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                hide
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                formatter={(value: number) => [
                  `${Number(value).toLocaleString("vi-VN")} đ`,
                  "",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="online"
                name="Online"
                fill="#60a5fa"
                radius={[2, 2, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="offline"
                name="Offline"
                fill="#334155"
                radius={[2, 2, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
