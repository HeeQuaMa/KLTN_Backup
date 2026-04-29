import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function AddProductCard() {
  return (
    <Link href="/super-admin/products/create" className="h-full w-full rounded-xl transition-transform outline-none hover:scale-[1.02] focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 active:scale-[0.98]">
      <Card className="flex h-full min-h-25 cursor-pointer items-center justify-center border-none bg-blue-600 text-white shadow-sm hover:bg-blue-700">
        <CardContent className="flex items-center justify-center p-0">
          <span className="text-sm font-bold tracking-wider uppercase">
            + Thêm sản phẩm
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
