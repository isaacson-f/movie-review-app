import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const sessionUser = session.user

  if (!sessionUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const movieId = parseInt(params.id, 10)
  const userId = sessionUser.id

  // Check if the like already exists
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  })

  if (existingLike) {
    // Unlike the movie
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    })
    return NextResponse.json({ message: 'Successfully unliked movie' })
  } else {
    // Like the movie
    await prisma.like.create({
      data: {
        userId,
        movieId,
      },
    })
    return NextResponse.json({ message: 'Successfully liked movie' })
  }
}
