"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Tuần 1",
    online: 3000,
    offline: 4000,
  },
  {
    name: "Tuần 2",
    online: 3500,
    offline: 3000,
  },
  {
    name: "Tuần 3",
    online: 4500,
    offline: 6000,
  },
  {
    name: "Tuần 4",
    online: 6500,
    offline: 5000,
  },
];

export function DashboardChart() {
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
            <BarChart data={data} barGap={8}>
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
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="online"
                fill="#60a5fa"
                radius={[2, 2, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="offline"
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
