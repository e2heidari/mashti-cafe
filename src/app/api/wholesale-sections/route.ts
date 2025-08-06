import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function GET() {
  try {
    const wholesaleSections = await client.fetch(`
      *[_type == "wholesaleSection" && active == true] | order(order asc) {
        _id,
        title,
        description,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        buttonText,
        order,
        active
      }
    `)

    return Response.json({ wholesaleSections }, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    })
  } catch (error) {
    console.error('Error fetching wholesale sections:', error)
    return Response.json({ error: 'Failed to fetch wholesale sections' }, { status: 500 })
  }
} 