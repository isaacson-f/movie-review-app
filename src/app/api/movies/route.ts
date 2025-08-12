import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { title, releaseYear, posterImage } = await req.json()

  if (!title || !releaseYear || !posterImage) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  // Check if the movie already exists
  let movie = await prisma.movie.findUnique({
    where: {
      title_releaseYear: {
        title,
        releaseYear,
      },
    },
  })

  if (movie) {
    return NextResponse.json(movie, { status: 200 })
  }

  // If not, create it
  movie = await prisma.movie.create({
    data: {
      title,
      releaseYear,
      posterImage,
    },
  })

  return NextResponse.json(movie, { status: 201 })
}
