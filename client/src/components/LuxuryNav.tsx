import { useState } from "react";
import { Menu, X, Sparkles, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";

interface LuxuryNavProps {
  onCartOpen?: () => void;
}

export default function LuxuryNav({ onCartOpen }: LuxuryNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  // All browsing routes are public — only Account requires auth
  const navItems = [
    { label: "Shop", path: "/gallery" },
    { label: "Subscriptions", path: "/subscriptions" },
    { label: "Design Studio", path: "/studio" },
    { label: "Account", path: "/account", auth: true },
  ];

  return (
    <>
      {/* Luxury Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-accent/20">
        <div className="container flex items-center justify-between h-20 px-6">
          {/* Logo */}
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-background" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground tracking-tight">
              Nail'd
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              (!item.auth || isAuthenticated) && (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors uppercase tracking-wide"
                >
                  {item.label}
                </button>
              )
            ))}
            {!isAuthenticated && (
              <button
                onClick={() => (window.location.href = getLoginUrl())}
                className="px-6 py-2 bg-accent text-background font-medium rounded-sm hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Cart Icon + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Cart Button — always visible */}
            <button
              onClick={onCartOpen}
              className="relative p-2 hover:bg-accent/10 rounded-sm transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-background text-xs font-bold flex items-center justify-center leading-none">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-sm transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-accent" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-24 md:hidden">
          <div className="container px-6 py-8 space-y-6">
            {navItems.map((item) => (
              (!item.auth || isAuthenticated) && (
                <button
                  key={item.path}
                  onClick={() => {
                    setLocation(item.path);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-lg font-display text-foreground hover:text-accent transition-colors py-3 border-b border-accent/10"
                >
                  {item.label}
                </button>
              )
            ))}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  window.location.href = getLoginUrl();
                  setIsOpen(false);
                }}
                className="w-full mt-6 px-6 py-3 bg-accent text-background font-medium rounded-sm hover:bg-accent/90 transition-colors uppercase tracking-wide"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
