import { useMemo, useEffect } from "react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Collections() {
  const { data: allProducts = [], isLoading: productsLoading, error: productsError, refetch } = trpc.products.getAll.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const { data: categories = [], isLoading: categoriesLoading } = trpc.products.getCategories.useQuery();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetch]);

  const collectionsByCategory = useMemo(() => {
    const collections: Record<string, typeof allProducts> = {};

    categories.forEach((cat) => {
      collections[cat] = allProducts.filter((p) => p.category === cat);
    });

    return collections;
  }, [allProducts, categories]);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="serif text-5xl md:text-6xl font-bold text-foreground mb-4">
            Collections
          </h1>
          <p className="text-lg text-foreground/70">
            Explore our curated collections organized by category
          </p>
        </div>
      </section>

      {/* Collections */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {categoriesLoading || productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : productsError ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Unable to load collections</p>
          </div>
        ) : Object.keys(collectionsByCategory).length > 0 ? (
          <div className="space-y-16">
            {Object.entries(collectionsByCategory).map(([category, products]) => (
              <section key={category}>
                {/* Collection Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="serif text-4xl md:text-5xl font-bold text-foreground mb-2">
                      {category}
                    </h2>
                    <p className="text-foreground/60">
                      {products.length} product{products.length !== 1 ? 's' : ''} in this collection
                    </p>
                  </div>
                  <Link href={`/shop?category=${category}`}>
                    <Button variant="outline" className="gap-2 hidden md:flex">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {products.length > 4 && (
                      <div className="text-center md:hidden">
                        <Link href={`/shop?category=${category}`}>
                          <Button variant="outline" className="gap-2">
                            View All {products.length} Products
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-secondary/30 rounded-lg">
                    <p className="text-foreground/60">No products in this collection yet</p>
                  </div>
                )}

                {/* Divider */}
                {category !== Object.keys(collectionsByCategory)[Object.keys(collectionsByCategory).length - 1] && (
                  <div className="my-12 border-t border-border" />
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">No collections available yet</p>
            <Link href="/admin/login">
              <Button variant="outline">Add Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
