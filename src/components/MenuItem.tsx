interface MenuItemProps {
  icon: string;
  title: string;
  price: string;
  description: string;
  bgColor: string;
  popular?: boolean;
  discount?: boolean;
  originalPrice?: string;
  subtitle?: string;
  promotion?: boolean;
}

export default function MenuItem({
  icon,
  title,
  price,
  description,
  bgColor,
  popular = false,
  discount = false,
  originalPrice,
  subtitle,
  promotion = false,
}: MenuItemProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:transform hover:scale-105 transition-all">
      <div
        className={`w-16 h-16 ${bgColor} rounded-full mx-auto mb-4 flex items-center justify-center`}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-white text-center mb-2">{title}</h3>
      {subtitle && (
        <p className="text-sm text-gray-300 text-center mb-2 italic">
          {subtitle}
        </p>
      )}
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
        {discount && originalPrice && (
          <div className="mb-1">
            <span className="text-lg line-through text-gray-400 mr-2">
              {originalPrice}
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              30% OFF
            </span>
          </div>
        )}
        <span className="text-2xl font-bold text-yellow-400">{price}</span>
      </div>
      <p className="text-gray-300 text-center text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
