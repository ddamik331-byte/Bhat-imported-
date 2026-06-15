import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Product } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { data: allProducts = [], isLoading, error, refetch } = trpc.products.getAll.useQuery(undefined, {
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isLoading && !error) {
      setFeaturedProducts(allProducts.slice(0, 4));
    }
  }, [allProducts, isLoading, error]);

  // Refetch when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetch]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-background to-muted">
        <div className="container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Premium Collection</span>
            </div>

            <h1 className="serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Timeless Fashion for Every Occasion
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover our curated collection of premium clothing. Each piece is carefully selected to bring elegance and style to your wardrobe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="gap-2">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mb-12">
            <h2 className="serif text-4xl md:text-5xl font-bold mb-4">
              Featured Collection
            </h2>
            <p className="text-muted-foreground text-lg">
              Handpicked items that define our brand
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-4">Failed to load products</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                No products available yet
              </p>
              <p className="text-sm text-muted-foreground">
                Check back soon for our latest collection
              </p>
            </div>
          )}

          {!isLoading && !error && allProducts.length > 4 && (
            <div className="mt-12 text-center">
              <Link href="/shop">
                <Button size="lg" variant="outline">
                  View All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-accent text-accent-foreground">
        <div className="container text-center">
          <h2 className="serif text-4xl md:text-5xl font-bold mb-6">
            Elevate Your Style
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of fashion enthusiasts and stay updated with the latest trends
          </p>
          <Button size="lg" variant="secondary">
            Subscribe to Our Newsletter
          </Button>
        </div>
      </section>
    </div>
  );
}
