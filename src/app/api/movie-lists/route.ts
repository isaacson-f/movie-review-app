import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function POST(req: NextRequest) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const sessionUser = session.user

  if (!sessionUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await req.json()

  if (!name) {
    return NextResponse.json({ message: 'Missing name field' }, { status: 400 })
  }

  const movieList = await prisma.movieList.create({
    data: {
      name,
      userId: sessionUser.id,
    },
  })

  return NextResponse.json(movieList, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const sessionUser = session.user

  if (!sessionUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const movieLists = await prisma.movieList.findMany({
    where: {
      userId: sessionUser.id,
    },
    include: {
        movies: true // Also include the movies in each list
    }
  })

  return NextResponse.json(movieLists)
}
