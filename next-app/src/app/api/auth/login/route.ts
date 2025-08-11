import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'
import { User } from '@prisma/client'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: username }, { username: username }],
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }

  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  session.user = user
  await session.save()

  return NextResponse.json(user)
}
