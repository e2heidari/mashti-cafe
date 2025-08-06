// Migration script to add default wholesale sections
// Run this in your Sanity Studio or via the Sanity CLI

export const wholesaleSections = [
  {
    _type: 'wholesaleSection',
    title: 'Wholesale Division',
    description: 'Premium Persian ice cream for your business. We offer bulk orders, events, and distribution services. Our wholesale division provides high-quality ice cream products perfect for restaurants, cafes, events, and retail businesses.',
    buttonText: 'View Products',
    order: 1,
    active: true,
  },
  {
    _type: 'wholesaleSection',
    title: 'Bulk Orders & Distribution',
    description: 'From small cafes to large events, we provide reliable bulk ice cream solutions. Our distribution network ensures timely delivery across the region. Perfect for weddings, corporate events, and retail establishments.',
    buttonText: 'Order Now',
    order: 2,
    active: true,
  },
  {
    _type: 'wholesaleSection',
    title: 'Quality & Authenticity',
    description: 'Every batch is crafted with traditional Persian recipes using premium ingredients. Saffron, rose water, and authentic flavors that set us apart. Consistent quality and taste that your customers will love.',
    buttonText: 'Learn More',
    order: 3,
    active: true,
  }
]

// Instructions:
// 1. Go to your Sanity Studio
// 2. Create 3 new "Wholesale Section" documents
// 3. Copy the content from above for each section
// 4. Upload images for each section (you can use /images/wholesales.jpeg)
// 5. Save each document 