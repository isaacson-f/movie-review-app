import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function GET(req: NextRequest) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  const { user } = session

  if (!user) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ user })
}
