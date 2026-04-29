import ProductCard, { ProductType } from "./ProductCard";

interface ProductListProps {
  title?: string;
  products: ProductType[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full">
      {title && (
        <h2 className="mb-6 text-xl font-bold text-gray-900 lg:text-2xl">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id ?? product.name} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
