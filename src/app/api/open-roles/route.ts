import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function GET() {
  try {
    const roles = await client.fetch(`*[_type == "jobOpening" && active == true] | order(order asc, postedAt desc){
      _id, title, location, type, postedAt, active
    }`)
    return NextResponse.json({ roles })
  } catch (err: any) {
    return NextResponse.json({ roles: [], message: err?.message || 'Failed to load roles' }, { status: 500 })
  }
}


