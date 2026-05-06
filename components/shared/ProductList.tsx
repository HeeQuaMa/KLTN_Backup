import ProductCard, { ProductType } from "./ProductCard";

interface ProductListProps {
  title?: string;
  products: ProductType[];
  ctaLabel?: string;
}

const ProductList = ({ title, products, ctaLabel }: ProductListProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-8 w-full">
      {title && (
        <div className="mb-4">
          <h2 className="relative inline-block pb-2 text-2xl font-extrabold tracking-tight text-gray-900 uppercase">
            {title}
            <span className="absolute bottom-0 left-0 h-[3px] w-12 bg-primary" />
          </h2>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id ?? product.name}
            product={product}
            ctaLabel={ctaLabel}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
