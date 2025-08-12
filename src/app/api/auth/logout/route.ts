import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'

export async function POST(req: NextRequest) {
  const session = await getIronSession(req, new NextResponse(), sessionOptions)
  session.destroy()
  return NextResponse.json({ message: 'Logged out' })
}
