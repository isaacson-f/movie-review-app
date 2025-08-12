'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, mutate } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    await mutate({ user: undefined })
    router.push('/')
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/">
        <span className="text-xl font-bold">Movie Reviews</span>
      </Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <span className="mr-4">Login</span>
            </Link>
            <Link href="/register">
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
