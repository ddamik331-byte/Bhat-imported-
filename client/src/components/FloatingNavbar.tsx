import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, LogIn } from "lucide-react";

interface FloatingNavbarProps {
  onAdminClick: () => void;
}

export function FloatingNavbar({ onAdminClick }: FloatingNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      {/* Floating Navbar */}
      <nav
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-full px-6 py-3"
            : "bg-background/60 backdrop-blur-md border border-border/50 rounded-full px-6 py-3"
        }`}
      >
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:text-accent transition-colors flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Bhat</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-accent transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Admin Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onAdminClick}
            className="gap-2 flex-shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-lg p-4 min-w-[200px] lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium hover:text-accent transition-colors py-2 px-3 rounded-md hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}
