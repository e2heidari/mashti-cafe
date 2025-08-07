import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // You'll need to set this environment variable
  useCdn: false,
})

const sampleWholesaleProducts = [
  {
    _type: 'wholesaleProduct',
    name: 'AKBAR MASHTI ICE CREAM',
    description: 'Traditional Persian ice cream with saffron and rose water',
    ingredients: ['Milk', 'Saffron', 'Rose Water', 'Cream', 'Pistachios'],
    weight: '~4Kg',
    price: 65.0,
    order: 1,
    active: true,
  },
  {
    _type: 'wholesaleProduct',
    name: 'AKBAR MASHTI ICE CREAM',
    description: 'Traditional Persian ice cream with saffron and rose water',
    ingredients: ['Milk', 'Saffron', 'Rose Water', 'Cream', 'Pistachios'],
    weight: '~10Kg',
    price: 130.0,
    order: 2,
    active: true,
  },
  {
    _type: 'wholesaleProduct',
    name: 'MILK ICE CREAM',
    description: 'Creamy milk ice cream with rose water',
    ingredients: ['Milk', 'Rose Water', 'Cream'],
    weight: '~4Kg',
    price: 45.0,
    order: 3,
    active: true,
  },
  {
    _type: 'wholesaleProduct',
    name: 'MILK ICE CREAM',
    description: 'Creamy milk ice cream with rose water',
    ingredients: ['Milk', 'Rose Water', 'Cream'],
    weight: '~10Kg',
    price: 90.0,
    order: 4,
    active: true,
  },
  {
    _type: 'wholesaleProduct',
    name: 'SAFFRON ICE CREAM',
    description: 'Premium saffron ice cream with authentic Persian flavors',
    ingredients: ['Milk', 'Saffron', 'Rose Water', 'Cream'],
    weight: '~4Kg',
    price: 55.0,
    order: 5,
    active: true,
  },
  {
    _type: 'wholesaleProduct',
    name: 'SAFFRON ICE CREAM',
    description: 'Premium saffron ice cream with authentic Persian flavors',
    ingredients: ['Milk', 'Saffron', 'Rose Water', 'Cream'],
    weight: '~10Kg',
    price: 110.0,
    order: 6,
    active: true,
  },
]

async function addSampleWholesaleProducts() {
  try {
    console.log('🚀 Starting to add sample wholesale products to Sanity...')
    
    for (const product of sampleWholesaleProducts) {
      const result = await client.create(product)
      console.log(`✅ Created: ${product.name} (${product.weight}) - ID: ${result._id}`)
    }
    
    console.log('🎉 Sample wholesale products added successfully!')
    console.log('📝 You can now view and edit these products in your Sanity Studio')
  } catch (error) {
    console.error('❌ Error adding sample wholesale products:', error)
    console.log('💡 Make sure you have set the SANITY_TOKEN environment variable')
  }
}

addSampleWholesaleProducts() 