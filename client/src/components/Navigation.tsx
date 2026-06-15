import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onAdminClick?: () => void;
}

export function Navigation({ onAdminClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="w-full bg-white">
      {/* Top Announcement Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        GET FREE SHIPPING ABOVE $99
      </div>

      {/* Main Navigation - Blended with Header */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              className="flex-shrink-0 font-bold text-xl serif text-foreground hover:text-primary transition-colors"
            >
              BHAT IMPORTER
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-foreground hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-foreground hover:text-primary transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 text-foreground hover:text-primary transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  0
                </span>
              </button>
              <Button
                size="sm"
                onClick={onAdminClick}
                className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Admin
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-border">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                size="sm"
                onClick={() => {
                  onAdminClick?.();
                  setIsOpen(false);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Admin
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
