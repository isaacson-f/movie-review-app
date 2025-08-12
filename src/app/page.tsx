import { getIronSession } from 'iron-session/next'
import { cookies } from 'next/headers'
import Link from 'next/link'

import { sessionOptions } from '@/lib/session'
import prisma from '@/lib/prisma'
import ReviewCard from '@/components/ReviewCard'
import { User, Review } from '@prisma/client'

// Define a type for the review with author information
type ReviewWithAuthor = Review & { author: User }

async function getLoggedInUser() {
  const session = await getIronSession<{ user?: User }>(cookies(), sessionOptions)
  return session.user
}

async function getFollowingReviews(userId: number): Promise<ReviewWithAuthor[]> {
  const userWithFollowing = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: {
        include: {
          reviews: {
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
    },
  })

  if (!userWithFollowing) {
    return []
  }

  const reviews = userWithFollowing.following.flatMap((user) => user.reviews)
  reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return reviews as ReviewWithAuthor[]
}


export default async function Home() {
  const user = await getLoggedInUser()

  if (user) {
    const reviews = await getFollowingReviews(user.id)
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p>
            Your feed is empty. Follow some users to see their reviews here.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Movie Social</h1>
      <p className="text-xl mb-8">
        Discover and share movie reviews with friends and other movie lovers.
      </p>
      <div>
        <Link href="/register">
          <span className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mr-2">
            Get Started
          </span>
        </Link>
        <Link href="/login">
          <span className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700">
            Login
          </span>
        </Link>
      </div>
    </div>
  )
}
