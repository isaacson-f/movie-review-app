import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json()

  if (!email || !username || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })

  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  })

  const session = await getIronSession(req, new NextResponse(), sessionOptions);
  session.user = user;
  await session.save();

  return NextResponse.json(user, { status: 201 })
}
