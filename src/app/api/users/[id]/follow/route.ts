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

  const userToFollowId = parseInt(params.id, 10)
  const followerId = sessionUser.id

  if (userToFollowId === followerId) {
    return NextResponse.json({ message: 'You cannot follow yourself' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: followerId },
    data: {
      following: {
        connect: { id: userToFollowId },
      },
    },
  })

  return NextResponse.json({ message: 'Successfully followed user' })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const sessionUser = session.user

  if (!sessionUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userToUnfollowId = parseInt(params.id, 10)
  const followerId = sessionUser.id

  await prisma.user.update({
    where: { id: followerId },
    data: {
      following: {
        disconnect: { id: userToUnfollowId },
      },
    },
  })

  return NextResponse.json({ message: 'Successfully unfollowed user' })
}
