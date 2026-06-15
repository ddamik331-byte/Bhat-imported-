import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const priceInDollars = (product.price / 100).toFixed(2);

  return (
    <div className="group cursor-pointer animate-fade-in hover:shadow-xl transition-all duration-300 rounded-lg">
      <div className="relative overflow-hidden rounded-lg bg-secondary/50 aspect-square mb-4 transition-all duration-300">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="text-center">
              <div className="text-foreground/40 text-sm">No image</div>
            </div>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {product.category}
        </div>

        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-foreground/60 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">
            ${priceInDollars}
          </span>
          {onAddToCart ? (
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-lg transform group-hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          ) : (
            <button className="px-3 py-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm rounded transition-all duration-300 hover:shadow-lg transform group-hover:scale-105">
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
