export interface MenuItemType {
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
  category?: string;
}

export const menuItems: MenuItemType[] = [
  {
    icon: "🥤",
    title: "Vanilla Cinnamon Shake",
    price: "$9.99",
    description: "Creamy blend of vanilla and cinnamon flavours.",
    bgColor: "bg-orange-500",
  },
  {
    icon: "🥤",
    title: "Caramel Shake",
    price: "$9.99",
    description: "Rich and creamy caramel flavoured milkshake.",
    bgColor: "bg-amber-600",
  },
  {
    icon: "🥤",
    title: "Chocolate Shake",
    price: "$9.99",
    description: "Rich and creamy blend of chocolate.",
    bgColor: "bg-brown-600",
  },
  {
    icon: "🥤",
    title: "Oreo Shake",
    price: "$9.99",
    description: "Rich and creamy blend of Oreo cookies.",
    bgColor: "bg-gray-700",
  },
  {
    icon: "🥤",
    title: "Nutella Shake",
    price: "$9.99",
    description:
      "Rich and creamy chocolate-hazelnut treat blended to perfection.",
    bgColor: "bg-brown-800",
  },
  {
    icon: "🥤",
    title: "M & M Shake",
    price: "$9.99",
    description: "Rich and creamy shake with M&M's.",
    bgColor: "bg-red-600",
  },
  {
    icon: "🥤",
    title: "Lotus Shake",
    price: "$9.99",
    description: "Creamy and refreshing drink with a hint of lotus flavour.",
    bgColor: "bg-yellow-600",
  },
  {
    icon: "🥤",
    title: "Nescafe Shake",
    price: "$9.99",
    description: "Delicious coffee-flavored shake.",
    bgColor: "bg-amber-800",
  },
  {
    icon: "🥤",
    title: "Peanut Butter Shake",
    price: "$9.99",
    description: "Rich and creamy peanut butter blended to perfection.",
    bgColor: "bg-yellow-700",
  },
  {
    icon: "🥤",
    title: "Tahini Shake",
    price: "$9.99",
    description: "Creamy sesame-based drink with a nutty flavour.",
    bgColor: "bg-yellow-800",
  },
  {
    icon: "🥤",
    title: "Barberry Shake",
    price: "$10.99",
    description: "A refreshing blend of barberry flavours.",
    bgColor: "bg-red-700",
  },
];

export const coffeeTeaItems: MenuItemType[] = [
  {
    icon: "☕",
    title: "Espresso",
    price: "$3.95",
    description: "Rich and bold coffee shot.",
    bgColor: "bg-brown-800",
    popular: true,
  },
  {
    icon: "☕",
    title: "Cappuccino",
    price: "$5.45",
    description: "Rich and smooth espresso-style coffee drink.",
    bgColor: "bg-brown-700",
  },
  {
    icon: "☕",
    title: "Latte",
    price: "$5.45",
    description: "Smooth and creamy coffee with steamed milk.",
    bgColor: "bg-brown-600",
  },
  {
    icon: "☕",
    title: "Americano",
    price: "$4.45",
    description: "Classic espresso with hot water.",
    bgColor: "bg-brown-800",
  },
  {
    icon: "☕",
    title: "Mocha",
    price: "$6.45",
    description: "Rich chocolate and espresso blend.",
    bgColor: "bg-brown-900",
  },
  {
    icon: "🫖",
    title: "Persian Tea",
    price: "$3.95",
    description: "Traditional Persian black tea.",
    bgColor: "bg-orange-600",
    popular: true,
  },
  {
    icon: "🫖",
    title: "Green Tea",
    price: "$3.95",
    description: "Refreshing green tea.",
    bgColor: "bg-green-600",
  },
  {
    icon: "🫖",
    title: "Chai Tea",
    price: "$4.95",
    description: "Spiced Indian tea with milk.",
    bgColor: "bg-orange-700",
  },
];

export const smoothieItems: MenuItemType[] = [
  {
    icon: "🍹",
    title: "Strawberry Banana Smoothie",
    price: "$8.99",
    description: "Fresh strawberries and banana blend.",
    bgColor: "bg-pink-500",
    popular: true,
  },
  {
    icon: "🍹",
    title: "Mango Smoothie",
    price: "$8.99",
    description: "Tropical mango smoothie.",
    bgColor: "bg-yellow-500",
  },
  {
    icon: "🍹",
    title: "Berry Blast Smoothie",
    price: "$9.99",
    description: "Mixed berries smoothie.",
    bgColor: "bg-purple-600",
  },
  {
    icon: "🍹",
    title: "Lavashak Smoothie",
    price: "$10.99",
    description: "Traditional Persian fruit leather smoothie.",
    bgColor: "bg-red-600",
    popular: true,
  },
  {
    icon: "🍹",
    title: "Shahtootfarangi Smoothie",
    price: "$10.99",
    description: "Persian mulberry smoothie.",
    bgColor: "bg-purple-700",
  },
];

export const juiceItems: MenuItemType[] = [
  {
    icon: "🧃",
    title: "Orange Juice",
    price: "$6.99",
    description: "Fresh squeezed orange juice.",
    bgColor: "bg-orange-500",
  },
  {
    icon: "🧃",
    title: "Apple Juice",
    price: "$6.99",
    description: "Fresh apple juice.",
    bgColor: "bg-green-600",
  },
  {
    icon: "🧃",
    title: "Pomegranate Juice",
    price: "$7.99",
    description: "Fresh pomegranate juice.",
    bgColor: "bg-red-600",
    popular: true,
  },
  {
    icon: "🧃",
    title: "Carrot Juice",
    price: "$6.99",
    description: "Fresh carrot juice.",
    bgColor: "bg-orange-600",
  },
];

export const proteinShakeItems: MenuItemType[] = [
  {
    icon: "🏋️",
    title: "Vanilla Protein Shake",
    price: "$12.99",
    description: "High protein vanilla shake.",
    bgColor: "bg-blue-600",
  },
  {
    icon: "🏋️",
    title: "Chocolate Protein Shake",
    price: "$12.99",
    description: "High protein chocolate shake.",
    bgColor: "bg-brown-700",
  },
  {
    icon: "🏋️",
    title: "Strawberry Protein Shake",
    price: "$12.99",
    description: "High protein strawberry shake.",
    bgColor: "bg-pink-600",
  },
];

export const iceCreamItems: MenuItemType[] = [
  {
    icon: "🍨",
    title: "Vanilla Ice Cream",
    price: "$5.99",
    description: "Classic vanilla ice cream.",
    bgColor: "bg-yellow-400",
  },
  {
    icon: "🍨",
    title: "Chocolate Ice Cream",
    price: "$5.99",
    description: "Rich chocolate ice cream.",
    bgColor: "bg-brown-600",
  },
  {
    icon: "🍨",
    title: "Strawberry Ice Cream",
    price: "$5.99",
    description: "Fresh strawberry ice cream.",
    bgColor: "bg-pink-500",
  },
  {
    icon: "🍨",
    title: "Persian Ice Cream",
    price: "$7.99",
    description: "Traditional Persian ice cream with saffron.",
    bgColor: "bg-yellow-500",
    popular: true,
  },
];

export const sweetsItems: MenuItemType[] = [
  {
    icon: "🍰",
    title: "Baklava",
    price: "$8.99",
    description: "Traditional Persian baklava.",
    bgColor: "bg-yellow-600",
    popular: true,
  },
  {
    icon: "🍰",
    title: "Zoolbia",
    price: "$6.99",
    description: "Persian fried dough dessert.",
    bgColor: "bg-orange-500",
  },
  {
    icon: "🍰",
    title: "Bamieh",
    price: "$6.99",
    description: "Persian honey-soaked dessert.",
    bgColor: "bg-yellow-500",
  },
]; 