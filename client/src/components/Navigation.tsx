import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Lock } from "lucide-react";

interface NavigationProps {
  onAdminClick?: () => void;
}

export function Navigation({ onAdminClick }: NavigationProps) {
  return (
    <nav className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:text-accent transition-colors">
          <ShoppingBag className="w-6 h-6" />
          <span className="hidden sm:inline">Bhat Importer Clothes</span>
          <span className="sm:hidden">Bhat</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:text-accent transition-colors">
            Shop
          </Link>
          <Link href="/collections" className="text-sm font-medium hover:text-accent transition-colors">
            Collections
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
            About
          </Link>
        </div>

        {/* Admin Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAdminClick}
          className="gap-2"
        >
          <Lock className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-border px-4 py-3 space-y-2">
        <Link href="/" className="block text-sm font-medium py-2 hover:text-accent transition-colors">
          Home
        </Link>
        <Link href="/shop" className="block text-sm font-medium py-2 hover:text-accent transition-colors">
          Shop
        </Link>
        <Link href="/collections" className="block text-sm font-medium py-2 hover:text-accent transition-colors">
          Collections
        </Link>
        <Link href="/about" className="block text-sm font-medium py-2 hover:text-accent transition-colors">
          About
        </Link>
      </div>
    </nav>
  );
}
