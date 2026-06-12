import { useMemo } from "react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Collections() {
  const { data: allProducts = [], isLoading: productsLoading, error: productsError } = trpc.products.getAll.useQuery();
  const { data: categories = [], isLoading: categoriesLoading } = trpc.products.getCategories.useQuery();

  const collectionsByCategory = useMemo(() => {
    const collections: Record<string, typeof allProducts> = {};

    categories.forEach((cat) => {
      collections[cat] = allProducts.filter((p) => p.category === cat);
    });

    return collections;
  }, [allProducts, categories]);

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-16">
          <h1 className="serif text-4xl md:text-5xl font-bold mb-4">
            Collections
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore our curated collections, each with its own unique style and character
          </p>
        </div>

        {/* Collections Grid */}
        {productsLoading || categoriesLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p className="text-muted-foreground mt-4">Loading collections...</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">Failed to load collections</p>
            <p className="text-sm text-muted-foreground">{productsError.message}</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-20">
            {categories.map((category) => {
              const products = collectionsByCategory[category] || [];
              if (products.length === 0) return null;

              return (
                <div key={category}>
                  {/* Collection Header */}
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="serif text-3xl md:text-4xl font-bold mb-2">
                        {category}
                      </h2>
                      <p className="text-muted-foreground">
                        {products.length} items in this collection
                      </p>
                    </div>
                    <Link href={`/shop?category=${encodeURIComponent(category)}`}>
                      <Button variant="outline" className="gap-2">
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {products.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Divider */}
                  {categories.indexOf(category) < categories.length - 1 && (
                    <div className="border-t border-border my-12" />
                  )}
                </div>
              );
            })}
          </div>
        ) : !productsLoading && !categoriesLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4 text-lg">
              No collections available yet
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon for our curated collections
            </p>
          </div>
        ) : null}

        {/* CTA Section */}
        <div className="mt-20 py-16 bg-muted rounded-lg text-center">
          <h3 className="serif text-2xl md:text-3xl font-bold mb-4">
            Discover More
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our complete collection and find the perfect piece for your style
          </p>
          <Link href="/shop">
            <Button size="lg">
              Shop All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
