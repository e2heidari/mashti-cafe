import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = (token?: string) =>
  createClient({
    projectId: 'eh05fgze',
    dataset: 'mashti-menu',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })

export async function POST(request: NextRequest) {
  try {
    const token = process.env.SANITY_API_TOKEN
    const secret = process.env.SEED_SECRET
    const url = new URL(request.url)
    const provided = url.searchParams.get('secret') || ''

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing SANITY_API_TOKEN' },
        { status: 500 }
      )
    }

    // Protect in prod unless secret matches
    if (process.env.NODE_ENV === 'production' && (!secret || provided !== secret)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const c = client(token)

    const samples = [
      {
        _id: 'job-open-barista-sample',
        _type: 'jobOpening',
        title: 'Barista',
        location: 'Central',
        type: 'Part-time',
        description: [
          { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'We are looking for a friendly, detail-oriented barista to join our Central location.' }] },
        ],
        requirements: [
          '1+ year barista experience (preferred)',
          'Excellent customer service',
          'Weekend availability',
        ],
        active: true,
        order: 0,
        postedAt: new Date().toISOString(),
      },
      {
        _id: 'job-open-kitchen-sample',
        _type: 'jobOpening',
        title: 'Kitchen Staff',
        location: 'Coquitlam',
        type: 'Full-time',
        description: [
          { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Help prep fresh ingredients and keep our kitchen running smoothly.' }] },
        ],
        requirements: [
          'Food handling experience',
          'Ability to lift 20kg',
          'Team player',
        ],
        active: true,
        order: 1,
        postedAt: new Date().toISOString(),
      },
    ]

    const results: string[] = []
    for (const doc of samples) {
      const created = await c.createOrReplace<{ _id: string }>(doc as { _id: string; _type: string })
      results.push(created._id)
    }

    return NextResponse.json({ success: true, created: results })
  } catch (err) {
    console.error('Seed open roles error:', err)
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Failed to seed roles' },
      { status: 500 }
    )
  }
}


