import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const { user } = session

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const review = await prisma.review.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!review || review.authorId !== user.id) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  const { title, releaseYear, rating, comment, posterImage } = await req.json()

  const updatedReview = await prisma.review.update({
    where: { id: parseInt(params.id) },
    data: { title, releaseYear, rating, comment, posterImage },
  })

  return NextResponse.json(updatedReview)
}

export async function DELETE(req: NextRequest, { params }: { params: { id:string } }) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const { user } = session

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const review = await prisma.review.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!review || review.authorId !== user.id) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  await prisma.review.delete({
    where: { id: parseInt(params.id) },
  })

  return new NextResponse(null, { status: 204 })
}
