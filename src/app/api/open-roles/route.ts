import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: false,
})

type JobOpening = {
  _id: string;
  title: string;
  location?: string;
  type?: string;
  postedAt?: string;
  active: boolean;
};

export async function GET() {
  try {
    const roles = await client.fetch<JobOpening[]>(`*[_type == "jobOpening" && active == true] | order(order asc, postedAt desc){
      _id, title, location, type, postedAt, active
    }`)
    return NextResponse.json({ roles })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load roles'
    return NextResponse.json({ roles: [], message }, { status: 500 })
  }
}


