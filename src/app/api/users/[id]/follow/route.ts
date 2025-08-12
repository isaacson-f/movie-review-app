import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { User } from '@prisma/client'


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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const session = await getIronSession<{ user?: User }>(cookieStore, sessionOptions)
  const loggedInUser = session.user

  if (!loggedInUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const targetUserId = parseInt(params.id, 10)

  if (isNaN(targetUserId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 })
  }

  if (loggedInUser.id === targetUserId) {
    return NextResponse.json({ message: 'You cannot follow yourself' }, { status: 400 })
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { followers: true },
    })

    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const isFollowing = targetUser.followers.some(
      (follower) => follower.id === loggedInUser.id
    )

    if (isFollowing) {
      // Unfollow
      await prisma.user.update({
        where: { id: loggedInUser.id },
        data: {
          following: {
            disconnect: { id: targetUserId },
          },
        },
      })
      return NextResponse.json({ isFollowing: false })
    } else {
      // Follow
      await prisma.user.update({
        where: { id: loggedInUser.id },
        data: {
          following: {
            connect: { id: targetUserId },
          },
        },
      })
      return NextResponse.json({ isFollowing: true })
    }
  } catch (error) {
    console.error('Follow/unfollow error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
