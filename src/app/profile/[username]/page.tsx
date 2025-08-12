import { notFound } from 'next/navigation'
import { getIronSession } from 'iron-session/next'
import { cookies } from 'next/headers'

import prisma from '@/lib/prisma'
import { sessionOptions } from '@/lib/session'
import ReviewCard from '@/components/ReviewCard'
import { User, Review } from '@prisma/client'
import FollowButton from '@/components/FollowButton'

type ReviewWithAuthor = Review & { author: User }
type ProfileUser = User & {
  reviews: ReviewWithAuthor[]
  _count: { followers: number; following: number }
}

async function getProfileUser(username: string): Promise<ProfileUser | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      reviews: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  })
  return user as ProfileUser | null
}

async function getLoggedInUser() {
  const session = await getIronSession<{ user?: User }>(cookies(), sessionOptions)
  return session.user
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profileUser = await getProfileUser(params.username)
  const loggedInUser = await getLoggedInUser()

  if (!profileUser) {
    notFound()
  }

  const isOwnProfile = loggedInUser?.id === profileUser.id

  let isFollowing = false
  if (loggedInUser && !isOwnProfile) {
    const followRecord = await prisma.user.findFirst({
      where: {
        id: loggedInUser.id,
        following: {
          some: {
            id: profileUser.id,
          },
        },
      },
    })
    isFollowing = !!followRecord
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded shadow-md mb-4">
        <h1 className="text-3xl font-bold">{profileUser.username}</h1>
        <div className="flex space-x-4 my-2">
          <span>
            <span className="font-bold">{profileUser._count.followers}</span> Followers
          </span>
          <span>
            <span className="font-bold">{profileUser._count.following}</span> Following
          </span>
        </div>
        {loggedInUser && !isOwnProfile && (
          <FollowButton
            targetUserId={profileUser.id}
            isFollowing={isFollowing}
          />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {profileUser.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileUser.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p>{profileUser.username} has not posted any reviews yet.</p>
        )}
      </div>
    </div>
  )
}
