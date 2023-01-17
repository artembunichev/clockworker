import { useEffect } from 'react'

import { Callback } from 'process-shared/types/basic-utility-types'

export const useWindowClick = (fn: Callback): void => {
  useEffect(() => {
    window.addEventListener('click', fn, true)
    return () => window.removeEventListener('click', fn, true)
  }, [fn])
}
