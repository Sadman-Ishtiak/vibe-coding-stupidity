import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useAsync(asyncFn) {
  const abortRef = useRef(null)
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null,
  })

  const run = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ status: 'loading', data: null, error: null })

    try {
      const data = await asyncFn({ signal: controller.signal })
      setState({ status: 'success', data, error: null })
      return data
    } catch (error) {
      if (error?.name === 'AbortError') return null
      setState({ status: 'error', data: null, error })
      throw error
    }
  }, [asyncFn])

  useEffect(() => {
    Promise.resolve()
      .then(() => run())
      .catch(() => {})
    return () => abortRef.current?.abort?.()
  }, [run])

  return useMemo(
    () => ({
      ...state,
      isIdle: state.status === 'idle',
      isLoading: state.status === 'loading',
      isSuccess: state.status === 'success',
      isError: state.status === 'error',
      run,
    }),
    [state, run],
  )
}
