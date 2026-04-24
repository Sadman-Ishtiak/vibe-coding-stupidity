import { useAsync } from '@/hooks/useAsync'
import { listJobs } from '@/services/jobs.service'
import { useCallback } from 'react'

export function useJobs() {
  const fetchJobs = useCallback(({ signal } = {}) => listJobs({}, { signal }), [])
  return useAsync(fetchJobs)
}


