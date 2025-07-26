import { createClient } from '@sanity/client'
import fs from 'fs'
import csv from 'csv-parser'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // نیاز به token داره
  useCdn: false
})

const results = []

fs.createReadStream('news-items.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    console.log('CSV file successfully processed')
    
    for (const item of results) {
      try {
        const doc = {
          _type: 'newsItem',
          title: item.title,
          description: item.description,
          buttonText: item.buttonText,
          order: parseInt(item.order),
          active: item.active === 'true'
        }
        
        const result = await client.create(doc)
        console.log(`Created news item: ${result._id}`)
      } catch (error) {
        console.error(`Error creating news item: ${error.message}`)
      }
    }
  }) 