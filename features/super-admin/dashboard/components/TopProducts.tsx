import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopProductRow } from "@/lib/api/dashboardApi";

export function TopProducts({ products }: { products: TopProductRow[] }) {
  return (
    <Card className="col-span-1 border-none shadow-sm md:col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-bold">Top Sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {products.length === 0 ? (
            <li className="text-sm text-slate-500">Chưa có dữ liệu bán trong tháng.</li>
          ) : (
            products.map((product, index) => (
              <li
                key={product.productId ?? `tp-${product.rank}`}
                className={`flex flex-col gap-1 pb-4 ${
                  index !== products.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <span className="font-semibold text-slate-800">
                  {product.rank}. {product.name}
                </span>
                <span className="text-xs text-slate-500">
                  Đã bán: {product.soldQuantity}
                </span>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
