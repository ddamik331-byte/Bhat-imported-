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
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-4">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">No image</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground line-clamp-2 hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-foreground">
            ${priceInDollars}
          </span>
          {onAddToCart && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddToCart(product)}
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
