'use client'

import { useUser } from '@/hooks/useAuth'
import { useReviews } from '@/hooks/useReviews'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReviewCard from '@/components/ReviewCard'
import CreateReviewModal from '@/components/CreateReviewModal'

export default function ReviewsPage() {
  const { user, loading: userLoading } = useUser()
  const { reviews, loading: reviewsLoading } = useReviews()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
    }
  }, [user, userLoading, router])

  if (userLoading || reviewsLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Add Review
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <CreateReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
