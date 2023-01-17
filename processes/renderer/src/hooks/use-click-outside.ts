import { useEffect } from 'react'

import { Callback } from 'process-shared/types/basic-utility-types'

export const useClickOutside = (
  ref: React.MutableRefObject<HTMLElement | null>,
  fn: Callback,
): void => {
  useEffect(() => {
    const element = ref.current

    const checkIsClickOutside = (e: MouseEvent): boolean => {
      return !element?.contains(e.target as Node)
    }

    const handleClick = (e: MouseEvent): void => {
      if (checkIsClickOutside(e)) {
        fn()
      }
    }

    if (element) {
      document.addEventListener('click', handleClick, true)
    }

    return () => document.removeEventListener('click', handleClick, true)
  })
}
