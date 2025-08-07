// Simple script to check CMS data
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function checkCMSData() {
  try {
    console.log('🔍 Checking CMS data...\n');
    
    // Get menu items count
    const itemsCount = await client.fetch('count(*[_type == "menuItem"])');
    console.log(`📊 Total Menu Items: ${itemsCount}`);
    
    // Get categories count
    const categoriesCount = await client.fetch('count(*[_type == "menuCategory"])');
    console.log(`📊 Total Categories: ${categoriesCount}\n`);
    
    // Get sample menu items
    const sampleItems = await client.fetch(`
      *[_type == "menuItem"] | order(order asc) [0...5] {
        _id,
        name,
        description,
        price,
        "categoryName": category->name,
        popular,
        discount,
        bogo,
        active,
        order
      }
    `);
    
    console.log('📋 Sample Menu Items:');
    sampleItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Category: ${item.categoryName || 'No category'}`);
      console.log(`   Price: $${item.price}`);
      console.log(`   Description: ${item.description || 'No description'}`);
      console.log(`   Popular: ${item.popular ? 'Yes' : 'No'}`);
      console.log(`   Active: ${item.active ? 'Yes' : 'No'}`);
      console.log(`   Order: ${item.order}`);
      console.log('');
    });
    
    // Get categories
    const categories = await client.fetch(`
      *[_type == "menuCategory"] | order(order asc) {
        _id,
        name,
        order
      }
    `);
    
    console.log('📂 Categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Order: ${cat.order})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCMSData(); 