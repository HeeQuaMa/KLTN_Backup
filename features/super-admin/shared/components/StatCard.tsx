import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: "up" | "down" | "none";
  trendText: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendText,
  icon,
  iconBgColor,
  iconColor,
  valueColor = "text-foreground",
}: StatCardProps) {
  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            iconBgColor,
            iconColor
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", valueColor)}>{value}</div>
        {trendText && (
          <p className="mt-2 flex items-center text-xs">
          {trend === "up" && (
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUp className="mr-1 h-3 w-3" />
              {trendText}
            </span>
          )}
          {trend === "down" && (
            <span className="flex items-center text-red-600 font-medium">
              <ArrowDown className="mr-1 h-3 w-3" />
              {trendText}
            </span>
          )}
          {trend === "none" && (
            <span className="text-muted-foreground">{trendText}</span>
          )}
        </p>
        )}
      </CardContent>
    </Card>
  );
}
