import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { sessionOptions } from '@/lib/session'
import CreateReviewForm from './create-review-form'
import { User } from '@prisma/client'

async function getLoggedInUser() {
  const cookieStore = await cookies()
  const session = await getIronSession<{ user?: User }>(cookieStore, sessionOptions)
  return session.user
}

export default async function CreateReviewPage() {
  const user = await getLoggedInUser()

  if (!user) {
    redirect('/login')
  }

  return <CreateReviewForm />
}
