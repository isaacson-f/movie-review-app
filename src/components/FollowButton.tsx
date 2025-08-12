'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
  targetUserId: number
  isFollowing: boolean
}

export default function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()

  const handleFollow = async () => {
    const response = await fetch(`/api/users/${targetUserId}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      setIsFollowing(data.isFollowing)
      // Refresh the page to update follower counts
      startTransition(() => {
        router.refresh()
      })
    } else {
      // Handle error
      console.error('Failed to update follow status')
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`px-4 py-2 font-bold text-white rounded ${
        isFollowing
          ? 'bg-gray-500 hover:bg-gray-700'
          : 'bg-blue-500 hover:bg-blue-700'
      }`}
    >
      {isPending ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}
