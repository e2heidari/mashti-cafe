import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // You'll need to add this to your .env.local
  useCdn: false,
})

const wholesaleSections = [
  {
    _type: 'wholesaleSection',
    title: 'Wholesale Division',
    description: 'Premium Persian ice cream for your business. We offer bulk orders, events, and distribution services. Our wholesale division provides high-quality ice cream products perfect for restaurants, cafes, events, and retail businesses.',
    buttonText: 'View Products',
    order: 1,
    active: true,
    // Note: You'll need to upload the image manually in Sanity Studio
    // and then update the image field with the asset reference
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

async function addWholesaleSections() {
  try {
    console.log('Adding wholesale sections to Sanity...')
    
    for (const section of wholesaleSections) {
      const result = await client.create(section)
      console.log(`✅ Created section: ${section.title} (ID: ${result._id})`)
    }
    
    console.log('🎉 All wholesale sections added successfully!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. Go to your Sanity Studio')
    console.log('2. Find the "Wholesale Section" documents')
    console.log('3. Upload images for each section')
    console.log('4. The website will automatically display the content')
    
  } catch (error) {
    console.error('❌ Error adding wholesale sections:', error)
  }
}

addWholesaleSections() 