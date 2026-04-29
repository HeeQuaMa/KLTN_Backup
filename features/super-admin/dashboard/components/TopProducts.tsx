import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const topProducts = [
  { id: 1, name: "1. Asus ROG Strix", sold: 120 },
  { id: 2, name: "2. Logitech G Pro", sold: 98 },
  { id: 3, name: "3. Dell XPS 15", sold: 85 },
];

export function TopProducts() {
  return (
    <Card className="col-span-1 border-none shadow-sm md:col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-bold">Top Sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {topProducts.map((product, index) => (
            <li
              key={product.id}
              className={`flex flex-col gap-1 pb-4 ${
                index !== topProducts.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <span className="font-semibold text-slate-800">{product.name}</span>
              <span className="text-xs text-slate-500">
                Đã bán: {product.sold}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
