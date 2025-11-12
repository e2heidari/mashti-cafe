import { memo } from "react";
import Image from "next/image";

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  category?: string;
  imageUrl?: string;
  imageAlt?: string;
  popular?: boolean;
  discount?: boolean;
  bogo?: boolean;
  originalPrice?: number;
}

const MenuItem = memo(function MenuItem({
  name,
  price,
  description,
  category,
  imageUrl,
  imageAlt,
  popular = false,
  discount = false,
  bogo = false,
  originalPrice,
}: MenuItemProps) {
  // Determine if there is a real discount
  const hasDiscount = discount && originalPrice && originalPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round((1 - price / originalPrice!) * 100)
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:transform hover:scale-105 transition-all">
      {/* Image or Icon */}
      {imageUrl ? (
        <div className="w-42 h-42 rounded-full mx-auto mb-1.5 overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            width={168}
            height={168}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ) : (
        <div className="w-36 h-36 bg-orange-500 rounded-full mx-auto mb-1.5 flex items-center justify-center overflow-hidden">
          <span className="text-4xl">🥤</span>
        </div>
      )}

      {/* Category Badge */}
      {category && (
        <div className="text-center mb-2">
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full font-pike">
            {category}
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 text-center mb-2 font-lander">
        {name}
      </h3>

      {popular && (
        <div className="text-center mb-2">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full font-pike">
            POPULAR
          </span>
        </div>
      )}

      {bogo && (
        <div className="text-center mb-2">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full font-pike">
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
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full font-pike">
              {`${discountPercentage}% OFF`}
            </span>
          </div>
        )}
        <span className="text-m font-bold text-gray-900 font-pike">
          ${price.toFixed(2)}
        </span>
      </div>

      <p className="text-gray-600 text-center text-sm leading-relaxed font-sodo">
        {description && description.trim() !== ""
          ? description
          : "Ask our staff for details!"}
      </p>
    </div>
  );
});

export default MenuItem;
