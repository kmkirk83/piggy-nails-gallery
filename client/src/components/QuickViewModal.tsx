import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export interface QuickViewProduct {
  id: string | number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  image?: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  features?: string[];
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  onClose: () => void;
  onOpenCart?: () => void;
}

export default function QuickViewModal({ product, onClose, onOpenCart }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!product) return null;

  // Normalise price to a number
  const priceNum =
    typeof product.price === "number"
      ? product.price
      : parseFloat(String(product.price).replace("$", "")) || 0;

  const imageUrl = product.imageUrl || product.image;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: String(product.id),
        name: product.name,
        price: priceNum,
        imageUrl,
        category: product.category,
      });
    }
    toast.success(`${product.name} added to cart`);
    onClose();
    onOpenCart?.();
  };

  return (
    <Dialog open={!!product} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden">
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="p-6 space-y-4">
          <DialogHeader>
            <p className="text-xs text-accent/70 uppercase tracking-wider">{product.category}</p>
            <DialogTitle className="font-display text-xl leading-tight">{product.name}</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-foreground/70">{product.description}</p>

          {product.rating !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating!) ? "fill-current" : "fill-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground/60">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <ul className="space-y-1">
              {product.features.map((f, i) => (
                <li key={i} className="text-sm text-foreground/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-2xl font-bold text-accent">${priceNum.toFixed(2)}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-accent transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-medium w-5 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:border-accent transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <Button
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display py-5"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
