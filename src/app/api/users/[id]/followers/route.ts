import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id, 10)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: true,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user.followers)
}
