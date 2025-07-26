import { memo } from "react";

interface MenuItemProps {
  id: string;
  name: string;
  price: number;
  description: string;
  popular?: boolean;
  discount?: boolean;
  promotion?: boolean;
  originalPrice?: number;
}

const MenuItem = memo(function MenuItem({
  id,
  name,
  price,
  description,
  popular = false,
  discount = false,
  promotion = false,
  originalPrice,
}: MenuItemProps) {
  // Determine if there is a real discount
  const hasDiscount = discount && originalPrice && originalPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round((1 - price / originalPrice!) * 100)
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:transform hover:scale-105 transition-all">
      <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl">🥤</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
        {name}
      </h3>

      {popular && (
        <div className="text-center mb-2">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            POPULAR
          </span>
        </div>
      )}

      {promotion && (
        <div className="text-center mb-2">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            BUY 1 GET 1 FREE
          </span>
        </div>
      )}

      <div className="text-center mb-3">
        {hasDiscount && (
          <div className="mb-1 flex items-center justify-center gap-2">
            <span className="text-lg line-through text-gray-400">
              ${originalPrice?.toFixed(2)}
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {`${discountPercentage}% OFF`}
            </span>
          </div>
        )}
        <span className="text-m font-bold text-gray-900">
          ${price.toFixed(2)}
        </span>
      </div>

      <p className="text-gray-600 text-center text-sm leading-relaxed">
        {description && description.trim() !== ""
          ? description
          : "Ask our staff for details!"}
      </p>
    </div>
  );
});

export default MenuItem;
