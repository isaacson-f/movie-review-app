import useSWR from 'swr'
import { User } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useUser() {
  const { data, error, mutate } = useSWR<{ user?: User }>('/api/auth/user', fetcher)

  const loading = !data && !error

  return {
    loading,
    user: data?.user,
    mutate,
  }
}
