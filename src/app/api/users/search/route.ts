import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ message: 'Query parameter "q" is required' }, { status: 400 })
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: q,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      take: 10, // Limit the number of results
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('User search error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
