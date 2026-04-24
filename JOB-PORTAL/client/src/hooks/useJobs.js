import { useAsync } from '@/hooks/useAsync'
import { listJobs } from '@/services/jobs.service'

export function useJobs() {
  return useAsync(({ signal }) => listJobs({ signal }))
}


