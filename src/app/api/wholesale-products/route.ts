import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function GET() {
  try {
    const wholesaleProducts = await client.fetch(`
      *[_type == "wholesaleProduct" && active == true] | order(order asc) {
        _id,
        name,
        description,
        ingredients,
        weight,
        price,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        order,
        active
      }
    `)

    return Response.json(
      { wholesaleProducts },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching wholesale products:', error)
    return Response.json(
      { error: 'Failed to fetch wholesale products' },
      { status: 500 }
    )
  }
} 