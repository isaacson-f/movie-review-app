import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function GET(req: NextRequest) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const { user } = session

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const reviews = await prisma.review.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const { user } = session

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { title, releaseYear, rating, comment, posterImage } = await req.json()

  if (!title || !releaseYear || !rating || !comment || !posterImage) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: {
      title,
      releaseYear,
      rating,
      comment,
      posterImage,
      authorId: user.id,
    },
  })

  return NextResponse.json(review, { status: 201 })
}
