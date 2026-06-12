import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

export default function Shop() {
  const { data: allProducts = [], isLoading: productsLoading, error: productsError } = trpc.products.getAll.useQuery();
  const { data: categories = [], isLoading: categoriesLoading } = trpc.products.getCategories.useQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return sorted;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="serif text-4xl md:text-5xl font-bold mb-4">
            Shop Our Collection
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete selection of premium clothing
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)} disabled={categoriesLoading}>
            <SelectTrigger>
              <SelectValue placeholder={categoriesLoading ? "Loading..." : "All Categories"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {searchQuery && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-sm">Search: {searchQuery}</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-accent hover:text-accent/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-sm">Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-accent hover:text-accent/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <p className="text-muted-foreground mt-4">Loading products...</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">Failed to load products</p>
            <p className="text-sm text-muted-foreground">{productsError.message}</p>
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedProducts.length} of {allProducts.length} products
            </div>
          </>
        ) : !productsLoading && !productsError ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4 text-lg">
              No products found
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSortBy("newest");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
