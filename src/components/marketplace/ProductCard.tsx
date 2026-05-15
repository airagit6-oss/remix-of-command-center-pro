import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, ShoppingBag, Zap, Heart, Star, Sparkles, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/lib/marketplaceData';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { favorites, subscribeUserActivity } from '@/lib/userActivity';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [isFav, setIsFav] = useState(() => favorites.has(product.id));
  const { addToCart } = useCart();
  const { hasSubscription } = useAuth();

  useEffect(() => subscribeUserActivity(() => setIsFav(favorites.has(product.id))), [product.id]);

  const aiScore = Math.round(82 + (product.rating - 4) * 12);
  const viewers = 6 + (product.users % 47);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowFav = favorites.toggle(product.id);
    toast.success(nowFav ? `Added ${product.name} to favorites` : `Removed ${product.name} from favorites`);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient glow on hover */}
      <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-fuchsia-500/0 to-cyan-500/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:from-cyan-500/30 group-hover:via-fuchsia-500/20 group-hover:to-cyan-500/30 group-hover:opacity-100" />
      {/* Base card */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:border-cyan-400/40 group-hover:shadow-[0_20px_50px_-15px_rgba(34,211,238,0.35)] group-hover:scale-[1.03]">
        {/* Thumbnail - real preview image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Live viewers pill */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[9px] font-medium text-foreground backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            {viewers} viewing
          </div>
          {/* Overlay on hover */}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 backdrop-blur-sm animate-in fade-in duration-200">
              <button
                onClick={toggleFav}
                aria-pressed={isFav}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isFav ? 'bg-primary text-primary-foreground' : 'bg-card/90 text-muted-foreground hover:bg-primary hover:text-primary-foreground'}`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
              </button>
              <Link
                to={`/product/${product.id}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                title="Add to Cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          )}
          {/* Status badge */}
          {product.status === 'trending' && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-2 py-0.5 text-[10px] font-bold uppercase text-background shadow-lg">
              <TrendingUp className="h-2.5 w-2.5" /> Trending
            </span>
          )}
          {product.status === 'new' && (
            <span className="absolute left-2 top-2 rounded-md bg-mp-success/90 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
              New
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-cyan-300">{product.category}</p>
            <span className="flex items-center gap-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-fuchsia-300">
              <Sparkles className="h-2.5 w-2.5" /> AI {aiScore}
            </span>
          </div>
          <h3 className="mt-1 text-sm font-bold text-foreground truncate">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{product.shortDescription}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-mp-gold text-mp-gold" />
              <span className="text-xs font-medium text-foreground">{product.rating.toFixed(1)}</span>
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> {product.users.toLocaleString()}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">${product.price}</span>
          </div>

          {/* Hover action buttons */}
          {hovered && (
            <div className="mt-3 flex gap-2 animate-in slide-in-from-bottom-2 duration-200">
              <Link
                to={`/product/${product.id}`}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-secondary py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Eye className="h-3.5 w-3.5" /> Details
              </Link>
              <Link
                to={hasSubscription ? `/app/${product.id}` : `/checkout?productId=${product.id}`}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg mp-gradient-bg py-2 text-xs font-semibold text-primary-foreground"
              >
                {hasSubscription ? <Zap className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                {hasSubscription ? 'Access' : 'Buy Now'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
