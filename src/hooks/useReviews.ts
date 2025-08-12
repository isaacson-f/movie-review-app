import useSWR from 'swr'
import { Review } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useReviews() {
  const { data, error, mutate } = useSWR<Review[]>('/api/reviews', fetcher)

  const loading = !data && !error

  return {
    loading,
    reviews: data,
    mutate,
  }
}
