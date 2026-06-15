import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Product } from "@/types";
import { ArrowRight, Sparkles, Award, Droplet, Shield, Zap } from "lucide-react";

export default function Home() {
  const { data: allProducts = [], isLoading, error, refetch } = trpc.products.getAll.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !error) {
      setFeaturedProducts(allProducts.slice(0, 4));
    }
  }, [allProducts, isLoading, error]);

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-primary/20 via-white to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1595777707802-a9f1f1f1f1f1?w=1200&h=600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }} />
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl w-full animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Premium Collection</span>
            </div>

            <h1 className="serif text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight animate-slide-up" style={{animationDelay: '0.2s'}}>
              Your Everyday Fashion Essentials
            </h1>

            <p className="text-lg text-foreground/80 mb-8 leading-relaxed max-w-xl animate-slide-up" style={{animationDelay: '0.3s'}}>
              Discover our carefully curated collection of premium clothing. Each piece is selected to bring elegance and style to your wardrobe. From casual wear to special occasions, find everything you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => setLocation("/shop")}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocation("/about")}
                className="px-8 py-3 border-2 border-foreground/20 text-foreground hover:bg-secondary rounded-lg font-medium transition-all duration-300 hover:border-foreground/40"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Premium Quality", desc: "Carefully selected premium fabrics and craftsmanship", delay: "0.1s" },
              { icon: Droplet, title: "Sustainable", desc: "Eco-friendly materials and ethical production", delay: "0.2s" },
              { icon: Shield, title: "Guaranteed", desc: "100% satisfaction guarantee on all purchases", delay: "0.3s" },
              { icon: Zap, title: "Fast Shipping", desc: "Quick and reliable delivery worldwide", delay: "0.4s" },
            ].map(({ icon: Icon, title, desc, delay }) => (
              <div
                key={title}
                className="text-center group hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{animationDelay: delay}}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mb-12 animate-fade-in">
            <h2 className="serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Collection
            </h2>
            <p className="text-foreground/70 text-lg">
              Explore our handpicked selection of the finest pieces
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">Unable to load products</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {featuredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{animationDelay: `${0.1 * (idx + 1)}s`}}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setLocation("/shop")}
                  className="px-8 py-3 border-2 border-foreground/20 text-foreground hover:bg-white rounded-lg font-medium transition-all duration-300 hover:border-foreground/40 inline-flex items-center gap-2"
                >
                  View All Products
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60 mb-4">No products available yet</p>
              <button
                onClick={() => setLocation("/admin/login")}
                className="px-6 py-2 border border-foreground/20 text-foreground rounded hover:bg-secondary transition-colors"
              >
                Add Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="serif text-4xl md:text-5xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and style tips
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-primary-foreground text-foreground placeholder-foreground/50 flex-1"
            />
            <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-medium transition-all duration-300 hover:shadow-lg whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
