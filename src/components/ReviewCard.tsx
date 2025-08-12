'use client'

import { useState } from 'react'
import { Review, User } from '@prisma/client'
import { useReviews } from '@/hooks/useReviews'
import EditReviewModal from './EditReviewModal'
import { useUser } from '@/hooks/useAuth'
import Link from 'next/link'

type ReviewWithAuthor = Review & { author: User }

interface ReviewCardProps {
  review: ReviewWithAuthor
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { user } = useUser()
  const { mutate } = useReviews()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleDelete = async () => {
    await fetch(`/api/reviews/${review.id}`, { method: 'DELETE' })
    mutate((reviews) => reviews?.filter((r) => r.id !== review.id))
  }

  const isAuthor = user?.id === review.authorId

  return (
    <>
      <div className="p-4 bg-white rounded shadow-md">
        <img src={review.posterImage} alt={review.title} className="w-full h-64 object-cover rounded mb-4" />
        <h2 className="text-xl font-bold">{review.title} ({review.releaseYear})</h2>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
          <span className="text-gray-400">{'☆'.repeat(5 - review.rating)}</span>
        </div>
        <p className="text-gray-700 mb-2">{review.comment}</p>
        <div className="text-sm text-gray-500">
          Reviewed by: <Link href={`/profile/${review.author.username}`} className="hover:underline">{review.author.username}</Link>
        </div>
        {isAuthor && (
          <div className="mt-4 flex justify-end">
            <button onClick={() => setIsEditModalOpen(true)} className="mr-2 px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700">
              Edit
            </button>
            <button onClick={handleDelete} className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">
              Delete
            </button>
          </div>
        )}
      </div>
      {isAuthor && (
        <EditReviewModal
          review={review}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  )
}
