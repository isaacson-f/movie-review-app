'use client'

import { useState, useEffect } from 'react'
import { useReviews } from '@/hooks/useReviews'
import { Review } from '@prisma/client'

export default function EditReviewModal({ review, isOpen, onClose }: { review: Review; isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [posterImage, setPosterImage] = useState('')
  const { mutate } = useReviews()

  useEffect(() => {
    if (review) {
      setTitle(review.title)
      setReleaseYear(review.releaseYear.toString())
      setRating(review.rating)
      setComment(review.comment)
      setPosterImage(review.posterImage)
    }
  }, [review])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch(`/api/reviews/${review.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        releaseYear: parseInt(releaseYear),
        rating,
        comment,
        posterImage,
      }),
    })

    if (res.ok) {
      const updatedReview = await res.json()
      mutate((reviews) =>
        reviews?.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      )
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="mb-4 text-2xl font-bold">Edit Review</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Release Year</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full px-3 py-2 border rounded"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">Comment</label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">Poster Image URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={posterImage}
              onChange={(e) => setPosterImage(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
