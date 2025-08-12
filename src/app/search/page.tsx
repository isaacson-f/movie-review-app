import prisma from '@/lib/prisma'
import ReviewCard from '@/components/ReviewCard'
import { User, Review } from '@prisma/client'

type ReviewWithAuthor = Review & { author: User }

async function getRecentReviews(): Promise<ReviewWithAuthor[]> {
  const reviews = await prisma.review.findMany({
    take: 20,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
    },
  })
  return reviews as ReviewWithAuthor[]
}

import UserSearch from '@/components/UserSearch'

export default async function SearchPage() {
  const recentReviews = await getRecentReviews()

  return (
    <div className="container mx-auto p-4">
      <UserSearch />

      <h2 className="text-2xl font-bold mb-4 border-t pt-8 mt-8">Explore Recent Reviews</h2>
      {recentReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p>No reviews have been posted yet.</p>
      )}
    </div>
  )
}
