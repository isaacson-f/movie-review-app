'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@prisma/client'

// A simple debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function UserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300) // 300ms debounce delay

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true)
      fetch(`/api/users/search?q=${debouncedQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch search results:', err)
          setIsLoading(false)
        })
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Search for Users</h1>
      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {isLoading && <p className="mt-4">Loading...</p>}
      {results.length > 0 && (
        <ul className="mt-4 bg-white rounded shadow-md">
          {results.map((user) => (
            <li key={user.id} className="border-b last:border-b-0">
              <Link href={`/profile/${user.username}`}>
                <span className="block p-4 hover:bg-gray-100">{user.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!isLoading && debouncedQuery && results.length === 0 && (
        <p className="mt-4">No users found.</p>
      )}
    </div>
  )
}
