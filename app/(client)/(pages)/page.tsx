import ProductGrid from "@/components/product-grid";

const HomePage = () => {
  return (
    <div className="container flex flex-col items-center m-auto p-3 md:p-5 gap-5">
      <ProductGrid />
    </div>
  );
};

export default HomePage;
