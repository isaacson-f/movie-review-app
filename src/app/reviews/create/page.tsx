import { getIronSession } from 'iron-session/next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { sessionOptions } from '@/lib/session'
import CreateReviewForm from './create-review-form'
import { User } from '@prisma/client'

async function getLoggedInUser() {
  const session = await getIronSession<{ user?: User }>(cookies(), sessionOptions)
  return session.user
}

export default async function CreateReviewPage() {
  const user = await getLoggedInUser()

  if (!user) {
    redirect('/login')
  }

  return <CreateReviewForm />
}
