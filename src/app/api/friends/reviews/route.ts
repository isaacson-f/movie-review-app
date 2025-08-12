import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function GET(req: NextRequest) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const sessionUser = session.user

  if (!sessionUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      following: true,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const followingIds = user.following.map((followedUser) => followedUser.id)

  const reviews = await prisma.review.findMany({
    where: {
      authorId: {
        in: followingIds,
      },
    },
    include: {
      author: true, // Include author details in the review
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(reviews)
}
