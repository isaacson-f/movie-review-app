import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const sessionUser = session.user

  if (!sessionUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const userId = parseInt(params.id, 10)

  if (sessionUser.id !== userId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const { email, username } = await req.json()

  if (!email && !username) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  // Check if new email or username is already taken
  if (email || username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
        NOT: { id: userId },
      },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Email or username already taken' }, { status: 409 })
    }
  }


  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      email,
      username,
    },
  })

  // Update the session with the new user data
  session.user = user;
  await session.save();

  return NextResponse.json(user)
}
