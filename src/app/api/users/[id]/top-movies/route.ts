import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id, 10)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      topMovies: true,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user.topMovies)
}

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

  const { movieIds } = await req.json()

  if (!Array.isArray(movieIds)) {
    return NextResponse.json({ message: 'movieIds must be an array' }, { status: 400 })
  }

  if (movieIds.length > 4) {
    return NextResponse.json({ message: 'You can only have up to 4 top movies' }, { status: 400 })
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      topMovies: {
        set: movieIds.map((id: number) => ({ id })),
      },
    },
    include: {
      topMovies: true,
    }
  })

  return NextResponse.json(updatedUser.topMovies)
}
