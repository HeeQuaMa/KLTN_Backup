import Line from "./Line";
import ProductCard, { ProductType } from "./ProductCard";

interface ProductListProps {
  title: string;
  products: ProductType[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold lg:text-[28px]">{title}</h2>
      <Line />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
        {products.map((data) => (
          <ProductCard key={data.name} product={data} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
